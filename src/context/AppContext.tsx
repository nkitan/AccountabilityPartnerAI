import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import 'react-native-get-random-values'; // This must be imported before uuid
import { v4 as uuidv4 } from 'uuid';
import { User, Habit } from '../types';

// Define notification type
export interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  type: 'reminder' | 'streak' | 'achievement' | 'message' | 'system';
}

// Define check-in type
export interface CheckIn {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
  createdAt: string;
}

// Define AI message type
export interface AIMessage {
  id: string;
  content: string;
  timestamp: string;
  isUser: boolean;
}

// Define settings type
export interface Settings {
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  reminderTime: string;
}

interface AppContextType {
  isFirstLaunch: boolean;
  setIsFirstLaunch: (value: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  expoPushToken: string;
  scheduleNotification: (
    title: string,
    body: string,
    trigger: Notifications.NotificationTriggerInput,
    type?: Notification['type']
  ) => Promise<string | null>;
  // Added missing properties
  habits: Habit[];
  addHabit: (habit: Habit) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  checkIns: CheckIn[];
  addCheckIn: (checkIn: CheckIn) => void;
  conversation: AIMessage[];
  addMessage: (message: AIMessage) => void;
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
}

const defaultContext: AppContextType = {
  isFirstLaunch: true,
  setIsFirstLaunch: () => {},
  user: null,
  setUser: () => {},
  isDarkMode: false,
  toggleTheme: () => {},
  notifications: [],
  addNotification: () => {},
  markNotificationAsRead: () => {},
  clearNotifications: () => {},
  expoPushToken: '',
  scheduleNotification: async () => null,
  // Added missing properties with default values
  habits: [],
  addHabit: () => {},
  updateHabit: () => {},
  deleteHabit: () => {},
  checkIns: [],
  addCheckIn: () => {},
  conversation: [],
  addMessage: () => {},
  settings: {
    theme: 'light',
    notificationsEnabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    reminderTime: '09:00',
  },
  updateSettings: () => {},
};

const AppContext = createContext<AppContextType>(defaultContext);

export const useAppContext = () => useContext(AppContext);

interface AppProviderProps {
  children: ReactNode;
}

// Configure notifications with the latest options
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  // Added missing state
  const [habits, setHabits] = useState<Habit[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [conversation, setConversation] = useState<AIMessage[]>([]);
  const [settings, setSettings] = useState<Settings>({
    theme: 'light',
    notificationsEnabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    reminderTime: '09:00',
  });

  // Register for push notifications
  useEffect(() => {
    const registerForPushNotifications = async () => {
      try {
        // Check if we're on a physical device (not simulator/emulator)
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        // If we don't have permission yet, ask for it
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        
        // If we still don't have permission, exit
        if (finalStatus !== 'granted') {
          console.log('Failed to get push token for push notification!');
          return;
        }
        
        // Get the token using the latest API
        // For development, we'll use a dummy projectId
        const tokenData = await Notifications.getExpoPushTokenAsync({
          projectId: 'your-expo-project-id', // Replace with your actual project ID in production
        });
        
        setExpoPushToken(tokenData.data);
        
        // Set up notification handling for Android with the latest options
        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'Default Channel',
            description: 'Default notification channel for the app',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
            enableLights: true,
            enableVibrate: true,
            showBadge: true,
          });
        }
      } catch (error) {
        console.error('Error registering for push notifications:', error);
      }
    };
    
    registerForPushNotifications();
    
    // Set up notification listeners
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      // Add the received notification to our local state
      const newNotification: Notification = {
        id: notification.request.identifier || uuidv4(),
        title: notification.request.content.title || 'New Notification',
        body: notification.request.content.body || '',
        timestamp: new Date().toISOString(),
        read: false,
        type: (notification.request.content.data?.type as Notification['type']) || 'system',
      };
      
      addNotification(newNotification);
    });
    
    // Clean up listeners on unmount
    return () => {
      notificationListener.remove();
    };
  }, []);

  // Check if it's the first launch and load saved data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load first launch status
        const value = await AsyncStorage.getItem('isFirstLaunch');
        if (value === null) {
          // First time launching the app
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
        
        // Load user data if available
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
        
        // Load theme preference
        const themePreference = await AsyncStorage.getItem('isDarkMode');
        if (themePreference) {
          setIsDarkMode(JSON.parse(themePreference));
        }
        
        // Load notifications
        const notificationsData = await AsyncStorage.getItem('notifications');
        if (notificationsData) {
          setNotifications(JSON.parse(notificationsData));
        }
        
        // Load habits
        const habitsData = await AsyncStorage.getItem('habits');
        if (habitsData) {
          setHabits(JSON.parse(habitsData));
        }
        
        // Load check-ins
        const checkInsData = await AsyncStorage.getItem('checkIns');
        if (checkInsData) {
          setCheckIns(JSON.parse(checkInsData));
        }
        
        // Load conversation
        const conversationData = await AsyncStorage.getItem('conversation');
        if (conversationData) {
          setConversation(JSON.parse(conversationData));
        }
        
        // Load settings
        const settingsData = await AsyncStorage.getItem('settings');
        if (settingsData) {
          const loadedSettings = JSON.parse(settingsData);
          setSettings(loadedSettings);
          // Sync isDarkMode with settings theme
          if (loadedSettings.theme === 'dark') {
            setIsDarkMode(true);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  // Save first launch status when it changes
  useEffect(() => {
    const saveFirstLaunchStatus = async () => {
      try {
        if (!isFirstLaunch) {
          await AsyncStorage.setItem('isFirstLaunch', 'false');
        }
      } catch (error) {
        console.error('Error saving first launch status:', error);
      }
    };
    
    if (!isLoading) {
      saveFirstLaunchStatus();
    }
  }, [isFirstLaunch, isLoading]);

  // Save user data when it changes
  useEffect(() => {
    const saveUserData = async () => {
      try {
        if (user) {
          await AsyncStorage.setItem('user', JSON.stringify(user));
        } else {
          await AsyncStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Error saving user data:', error);
      }
    };
    
    if (!isLoading) {
      saveUserData();
    }
  }, [user, isLoading]);

  // Save notifications when they change
  useEffect(() => {
    const saveNotifications = async () => {
      try {
        await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
      } catch (error) {
        console.error('Error saving notifications:', error);
      }
    };
    
    if (!isLoading) {
      saveNotifications();
    }
  }, [notifications, isLoading]);
  
  // Save habits when they change
  useEffect(() => {
    const saveHabits = async () => {
      try {
        await AsyncStorage.setItem('habits', JSON.stringify(habits));
      } catch (error) {
        console.error('Error saving habits:', error);
      }
    };
    
    if (!isLoading) {
      saveHabits();
    }
  }, [habits, isLoading]);
  
  // Save check-ins when they change
  useEffect(() => {
    const saveCheckIns = async () => {
      try {
        await AsyncStorage.setItem('checkIns', JSON.stringify(checkIns));
      } catch (error) {
        console.error('Error saving check-ins:', error);
      }
    };
    
    if (!isLoading) {
      saveCheckIns();
    }
  }, [checkIns, isLoading]);
  
  // Save conversation when it changes
  useEffect(() => {
    const saveConversation = async () => {
      try {
        await AsyncStorage.setItem('conversation', JSON.stringify(conversation));
      } catch (error) {
        console.error('Error saving conversation:', error);
      }
    };
    
    if (!isLoading) {
      saveConversation();
    }
  }, [conversation, isLoading]);
  
  // Save settings when they change
  useEffect(() => {
    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem('settings', JSON.stringify(settings));
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    };
    
    if (!isLoading) {
      saveSettings();
    }
  }, [settings, isLoading]);

  // Toggle theme and save preference
  const toggleTheme = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      await AsyncStorage.setItem('isDarkMode', JSON.stringify(newMode));
      // Also update the settings theme
      updateSettings({ theme: newMode ? 'dark' : 'light' });
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  };

  // Add a new notification
  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  // Mark a notification as read
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };
  
  // Add a new habit
  const addHabit = (habit: Habit) => {
    setHabits(prev => [...prev, habit]);
  };
  
  // Update an existing habit
  const updateHabit = (updatedHabit: Habit) => {
    setHabits(prev => 
      prev.map(habit => 
        habit.id === updatedHabit.id ? updatedHabit : habit
      )
    );
  };
  
  // Delete a habit
  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
  };
  
  // Add a new check-in
  const addCheckIn = (checkIn: CheckIn) => {
    setCheckIns(prev => [...prev, checkIn]);
  };
  
  // Add a new message to the conversation
  const addMessage = (message: AIMessage) => {
    setConversation(prev => [...prev, message]);
  };
  
  // Update settings
  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  // Schedule a local notification with the latest options
  const scheduleNotification = async (
    title: string,
    body: string,
    trigger: Notifications.NotificationTriggerInput,
    type: Notification['type'] = 'reminder'
  ) => {
    try {
      // Create a unique identifier for the notification
      const notificationId = uuidv4();
      
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { type, id: notificationId },
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          color: type === 'streak' ? '#FF9800' : 
                 type === 'achievement' ? '#FFD700' : 
                 type === 'reminder' ? '#2196F3' : '#6200EE',
          badge: 1,
        },
        trigger,
        identifier: notificationId,
      });
      
      // Also add to our local notifications state
      const newNotification: Notification = {
        id: notificationId,
        title,
        body,
        timestamp: new Date().toISOString(),
        read: false,
        type,
      };
      
      addNotification(newNotification);
      
      return identifier;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  };

  return (
    <AppContext.Provider
      value={{
        isFirstLaunch,
        setIsFirstLaunch,
        user,
        setUser,
        isDarkMode,
        toggleTheme,
        notifications,
        addNotification,
        markNotificationAsRead,
        clearNotifications,
        expoPushToken,
        scheduleNotification,
        // Added missing properties and functions
        habits,
        addHabit,
        updateHabit,
        deleteHabit,
        checkIns,
        addCheckIn,
        conversation,
        addMessage,
        settings,
        updateSettings,
      }}
    >
      {!isLoading && children}
    </AppContext.Provider>
  );
};