import React, { useEffect, useRef } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme';
import { View, Platform, UIManager, BackHandler, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useNavigation, useNavigationContainerRef } from '@react-navigation/native';
import { Text } from 'react-native-paper';

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

// Custom Tab Bar Button Component
interface TabBarButtonProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconOutline: keyof typeof Ionicons.glyphMap;
  isFocused: boolean;
  onPress: () => void;
}

const TabBarButton: React.FC<TabBarButtonProps> = ({ 
  label, 
  icon, 
  iconOutline, 
  isFocused, 
  onPress 
}) => {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(isFocused ? 1 : 0)).current;
  
  useEffect(() => {
    // Scale animation when tab is pressed
    if (isFocused) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        })
      ]).start();
      
      // Fade in the label
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      // Fade out the label
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [isFocused, scaleAnim, opacityAnim]);
  
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={tabStyles.tabButton}
    >
      <View style={tabStyles.tabButtonContent}>
        <View style={tabStyles.iconWrapper}>
          <Animated.View
            style={[
              {
                transform: [{ scale: scaleAnim }],
                backgroundColor: isFocused 
                  ? theme.dark 
                    ? `${theme.colors.primary}40` 
                    : `${theme.colors.primary}20`
                  : 'transparent',
                opacity: isFocused ? 1 : 0,
              }
            ]}
          />
          <Ionicons
            name={isFocused ? icon : iconOutline}
            size={24}
            color={isFocused ? theme.colors.primary : theme.colors.outline}
            style={tabStyles.icon}
          />
        </View>
        
        <Animated.View
          style={[
            tabStyles.labelContainer,
            {
              opacity: opacityAnim,
              transform: [
                { 
                  translateY: opacityAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [5, 0]
                  }) 
                }
              ]
            }
          ]}
        >
          <Text
            style={[
              tabStyles.label,
              { color: theme.colors.primary }
            ]}
            numberOfLines={1}
          >
            {label}
          </Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

// Custom Tab Bar Component
const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const theme = useTheme();
  
  // Define icon mapping
  const iconMapping = {
    Home: { icon: 'home', outline: 'home-outline' },
    Habits: { icon: 'list', outline: 'list-outline' },
    Chat: { icon: 'chatbubble', outline: 'chatbubble-outline' },
    Statistics: { icon: 'stats-chart', outline: 'stats-chart-outline' },
    Profile: { icon: 'person', outline: 'person-outline' },
  };
  
  return (
    <View style={[
      tabStyles.tabBar,
      { 
        backgroundColor: theme.colors.surface,
        borderTopColor: theme.dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
      }
    ]}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel || route.name;
        const isFocused = state.index === index;
        
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
        
        const routeName = route.name as keyof typeof iconMapping;
        const { icon, outline } = iconMapping[routeName];
        
        return (
          <TabBarButton
            key={index}
            label={label}
            icon={icon as keyof typeof Ionicons.glyphMap}
            iconOutline={outline as keyof typeof Ionicons.glyphMap}
            isFocused={isFocused}
            onPress={onPress}
          />
        );
      })}
    </View>
  );
};

// Main tab navigator
interface MainTabNavigatorProps {
  navigationRef: any;
}

const MainTabNavigator: React.FC<MainTabNavigatorProps> = ({ navigationRef }) => {
  const theme = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        lazy: false,
        freezeOnBlur: true,
        unmountOnBlur: false,
      }}
      sceneContainerStyle={{ 
        backgroundColor: theme.colors.background,
      }}
      tabBar={props => <CustomTabBar {...props} />}
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

// Enable LayoutAnimation on Android - Breaks Icons?
/*
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
*/

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

// Tab bar styles
const tabStyles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 85 : 65,
    paddingBottom: Platform.OS === 'ios' ? 25 : 5,
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconBackground: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    top: 0,
    left: 0,
  },
  icon: {
    zIndex: 2,
  },
  labelContainer: {
    position: 'absolute',
    bottom: -2,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default AppNavigator;