import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Dimensions, 
  FlatList, 
  TouchableOpacity, 
  Animated 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from 'react-native-paper';
import { useTheme } from '../utils/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useAppContext } from '../context/AppContext';
import { StatusBar } from 'expo-status-bar';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

type OnboardingNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

const { width, height } = Dimensions.get('window');

interface OnboardingItem {
  id: string;
  title: string;
  description: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconSize: number;
}

const OnboardingScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<OnboardingNavigationProp>();
  const { setIsFirstLaunch, setUser } = useAppContext();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Onboarding data
  const onboardingData: OnboardingItem[] = [
    {
      id: '1',
      title: 'Welcome to Your Accountability Partner',
      description: 'Your AI-powered companion to help you build better habits and achieve your goals.',
      iconName: 'rocket',
      iconColor: theme.colors.primary,
      iconSize: 120,
    },
    {
      id: '2',
      title: 'Set Meaningful Goals',
      description: 'Define clear, achievable goals across work, fitness, mindfulness, and more.',
      iconName: 'flag',
      iconColor: '#03dac6',
      iconSize: 120,
    },
    {
      id: '3',
      title: 'Stay Accountable',
      description: 'Get personalized reminders, encouragement, and feedback to keep you on track.',
      iconName: 'calendar',
      iconColor: '#ff9800',
      iconSize: 120,
    },
    {
      id: '4',
      title: 'Earn Rewards',
      description: 'Build streaks and earn virtual currency to celebrate your consistency and progress.',
      iconName: 'trophy',
      iconColor: '#ffd700',
      iconSize: 120,
    },
  ];

  // Handle completing onboarding
  const handleGetStarted = () => {
    // Create a default user
    const newUser = {
      id: uuidv4(),
      name: 'User', // In a real app, you'd collect the user's name
      streakCount: 0,
      virtualCurrency: 100, // Starting amount
      joinedDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };
    
    setUser(newUser);
    setIsFirstLaunch(false);
    navigation.navigate('Main');
  };

  // Handle skipping onboarding
  const handleSkip = () => {
    handleGetStarted(); // Same action as Get Started for now
  };

  // Handle next slide
  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleGetStarted();
    }
  };

  // Render onboarding item
  const renderItem = ({ item }: { item: OnboardingItem }) => {
    return (
      <View style={[styles.slide, { width, backgroundColor: theme.colors.background }]}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={item.iconName} 
            size={item.iconSize} 
            color={item.iconColor} 
          />
        </View>
        <Text style={[styles.title, { color: theme.colors.primary }]}>{item.title}</Text>
        <Text style={[styles.description, { color: theme.colors.text }]}>{item.description}</Text>
      </View>
    );
  };

  // Render pagination dots
  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {onboardingData.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 20, 10],
            extrapolate: 'clamp',
          });
          
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          
          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                { 
                  width: dotWidth,
                  opacity,
                  backgroundColor: theme.colors.primary,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="light" />
      
      {/* Skip button */}
      {currentIndex < onboardingData.length - 1 && (
        <TouchableOpacity 
          style={styles.skipButton} 
          onPress={handleSkip}
        >
          <Text style={[styles.skipText, { color: theme.colors.primary }]}>Skip</Text>
        </TouchableOpacity>
      )}
      
      {/* Onboarding slides */}
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        scrollEventThrottle={16}
      />
      
      {/* Pagination dots */}
      {renderPagination()}
      
      {/* Next/Get Started button */}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleNext}
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          labelStyle={styles.buttonText}
        >
          {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: width * 0.8,
    height: height * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  button: {
    paddingVertical: 8,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingScreen;