import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useAppContext } from '../context/AppContext';

type HabitDetailsRouteProp = RouteProp<RootStackParamList, 'HabitDetails'>;
type HabitDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HabitDetails'>;

const HabitDetailsScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<HabitDetailsRouteProp>();
  const navigation = useNavigation<HabitDetailsNavigationProp>();
  const { habits } = useAppContext();
  
  const { habitId } = route.params;
  const habit = habits.find(h => h.id === habitId);
  
  if (!habit) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>Habit not found</Text>
        <Button 
          mode="contained" 
          onPress={() => navigation.goBack()}
          style={{ marginTop: 20, backgroundColor: theme.colors.primary }}
        >
          Go Back
        </Button>
      </View>
    );
  }
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text variant="titleLarge" style={[styles.title, { color: theme.colors.text }]}>
        {habit.title}
      </Text>
      
      {/* Streak Information */}
      <View style={[styles.streakInfoCard, { 
        backgroundColor: theme.colors.streakContainer,
        borderRadius: theme.roundness * 2,
        padding: 16,
        marginVertical: 12
      }]}>
        <Text style={[styles.streakTitle, { color: theme.colors.text }]}>
          Current Streak
        </Text>
        <View style={styles.streakRow}>
          <Ionicons name="flame" size={24} color={theme.colors.streak} />
          <Text style={[styles.streakCount, { color: theme.colors.text }]}>
            {habit.streakCount} days
          </Text>
        </View>
      </View>
      
      {/* Goal Focus Section */}
      <View style={[styles.goalSection, { 
        backgroundColor: theme.colors.goalFocused + '20', // 20% opacity
        borderRadius: theme.roundness * 2,
        padding: 16,
        marginVertical: 12
      }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.goalFocused }]}>
          Goal Focus
        </Text>
        <Text style={[styles.goalDescription, { color: theme.colors.text }]}>
          {habit.description}
        </Text>
      </View>
      
      <Text style={[styles.placeholder, { color: theme.colors.placeholder }]}>
        More habit details to be implemented
      </Text>
      
      <Button 
        mode="contained" 
        onPress={() => navigation.navigate('EditHabit', { habitId })}
        style={[styles.button, { 
          backgroundColor: theme.colors.primaryAction,
          borderRadius: theme.roundness * 5,
          marginTop: 20
        }]}
      >
        Edit Habit
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    alignItems: 'stretch', // Changed from center to stretch for full-width cards
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  placeholder: {
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: 16,
    alignSelf: 'center',
  },
  // New styles for streak info
  streakInfoCard: {
    width: '100%',
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakCount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  // New styles for goal section
  goalSection: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  goalDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default HabitDetailsScreen;