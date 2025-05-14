import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme';
import { View, Platform, UIManager, BackHandler } from 'react-native';
import { useNavigation, useNavigationContainerRef } from '@react-navigation/native';

// Import screens
import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import HabitsScreen from '../screens/HabitsScreen';
import HabitDetailsScreen from '../screens/HabitDetailsScreen';
import AddHabitScreen from '../screens/AddHabitScreen';
import EditHabitScreen from '../screens/EditHabitScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import RewardsScreen from '../screens/RewardsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

// Import types
import { RootStackParamList } from '../types';
import { useAppContext } from '../context/AppContext';

// Create navigators
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

// Main tab navigator
interface MainTabNavigatorProps {
  navigationRef: any;
}

const MainTabNavigator: React.FC<MainTabNavigatorProps> = ({ navigationRef }) => {
  const theme = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Habits') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Statistics') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarHideOnKeyboard: true,
        // Prevent white flash during tab transitions
        tabBarBackground: () => (
          <View style={{ flex: 1, backgroundColor: theme.colors.surface }} />
        ),
        // Disable animations to prevent white flash
        lazy: false,
        freezeOnBlur: true,
        // Ensure screens are pre-rendered to prevent white flash
        unmountOnBlur: false,
      })}
      // Add background color to prevent white flash
      sceneContainerStyle={{ 
        backgroundColor: theme.colors.background,
      }}
      // Disable tab transition animations
      screenListeners={{
        tabPress: e => {
          // Prevent default animation
          e.preventDefault();
          const target = e.target?.split('-')[0];
          if (target) {
            navigationRef.current?.navigate(target as any);
          }
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Habits" component={HabitsScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Statistics" component={StatisticsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Create custom navigation themes that match our app theme
const createCustomNavigationTheme = (theme: any) => {
  const navigationTheme = theme.dark ? DarkTheme : DefaultTheme;
  
  return {
    ...navigationTheme,
    colors: {
      ...navigationTheme.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.outline,
      notification: theme.colors.notification,
      // Custom colors
      streak: theme.colors.streak,
      reward: theme.colors.reward,
      success: theme.colors.success,
      info: theme.colors.info,
      disabled: theme.colors.disabled,
      error: theme.colors.error,
    },
  };
};

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Background component to prevent white flash
const ScreenBackground = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: theme.colors.background,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1
    }}>
      {children}
    </View>
  );
}

// Root navigator
const AppNavigator = () => {
  const { isFirstLaunch, isDarkMode } = useAppContext();
  const theme = useTheme();
  const navigationTheme = createCustomNavigationTheme(theme);
  const navigationRef = useNavigationContainerRef();
  
  // Handle hardware back button to prevent white flash
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (navigationRef.current?.canGoBack()) {
        navigationRef.current?.goBack();
        return true;
      }
      return false;
    });
    
    return () => backHandler.remove();
  }, [navigationRef]);
  
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Persistent background to prevent white flash */}
      <ScreenBackground>
        <View style={{ flex: 1 }} />
      </ScreenBackground>
      
      <NavigationContainer 
        ref={navigationRef}
        theme={navigationTheme}
        documentTitle={{
          formatter: (options, route) => 
            `${options?.title ?? route?.name} - Accountability Partner AI`
        }}
        onReady={() => {
          // This helps ensure the navigation is fully ready before rendering
          console.log('Navigation container is ready');
        }}
        // Prevent white flash during navigation
        theme={{
          ...navigationTheme,
          colors: {
            ...navigationTheme.colors,
            background: theme.colors.background,
          },
        }}
      >
      <Stack.Navigator
        initialRouteName={isFirstLaunch ? 'Onboarding' : 'Main'}
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text,
          headerShadowVisible: false,
          animation: 'none', // Disable animation to prevent white flash
          animationDuration: 0,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
          // Prevent white flash during transitions
          cardStyle: { backgroundColor: theme.colors.background },
          cardOverlayEnabled: false,
          presentation: 'card',
          // Additional options to prevent white flash
          detachPreviousScreen: false,
          freezeOnBlur: true,
        }}
      >
        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Main" 
          options={{ headerShown: false }}
        >
          {() => <MainTabNavigator navigationRef={navigationRef} />}
        </Stack.Screen>
        <Stack.Screen 
          name="HabitDetails" 
          component={HabitDetailsScreen}
          options={{ title: 'Habit Details' }}
        />
        <Stack.Screen 
          name="AddHabit" 
          component={AddHabitScreen}
          options={{ title: 'Add New Habit' }}
        />
        <Stack.Screen 
          name="EditHabit" 
          component={EditHabitScreen}
          options={{ title: 'Edit Habit' }}
        />
        <Stack.Screen 
          name="Rewards" 
          component={RewardsScreen}
          options={{ title: 'Rewards' }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
        <Stack.Screen 
          name="Notifications" 
          component={NotificationsScreen}
          options={{ title: 'Notifications' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </View>
  );
};

export default AppNavigator;