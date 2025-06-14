import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { v7 as uuidv7 } from 'uuid';
import { User } from '../types';

// Define notification type
export interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  type: 'reminder' | 'streak' | 'achievement' | 'message' | 'system';
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
        const tokenData = await Notifications.getExpoPushTokenAsync({
          projectId: 'accountability-partner-ai', // Replace with your actual Expo project ID if different
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
        id: notification.request.identifier || uuidv7(),
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
      Notifications.removeNotificationSubscription(notificationListener);
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

  // Toggle theme and save preference
  const toggleTheme = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      await AsyncStorage.setItem('isDarkMode', JSON.stringify(newMode));
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
  
  // Schedule a local notification with the latest options
  const scheduleNotification = async (
    title: string,
    body: string,
    trigger: Notifications.NotificationTriggerInput,
    type: Notification['type'] = 'reminder'
  ) => {
    try {
      // Create a unique identifier for the notification
      const notificationId = uuidv7();
      
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
      }}
    >
      {!isLoading && children}
    </AppContext.Provider>
  );
};