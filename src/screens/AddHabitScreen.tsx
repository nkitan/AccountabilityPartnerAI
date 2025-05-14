import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useTheme } from '../utils/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useAppContext } from '../context/AppContext';
import 'react-native-get-random-values'; // This must be imported before uuid
import { v4 as uuidv4 } from 'uuid';
type AddHabitNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddHabit'>;

const AddHabitScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<AddHabitNavigationProp>();
  const { addHabit } = useAppContext();
  
  // Function to add a sample habit (for demo purposes)
  const addSampleHabit = () => {
    const newHabit = {
      id: uuidv4(), // Using v4 (random) for better compatibility
      title: 'Sample Habit',
      description: 'This is a sample habit for demonstration purposes.',
      category: 'productivity' as any,
      frequency: 'daily',
      startDate: new Date().toISOString(),
      streakCount: 0,
      longestStreak: 0,
      completedDates: [],
      active: true,
      color: '#6200EE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    addHabit(newHabit);
    navigation.goBack();
  };
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text variant="titleLarge" style={[styles.title, { color: theme.colors.text }]}>
        Add New Habit
      </Text>
      
      <Text style={[styles.placeholder, { color: theme.colors.placeholder }]}>
        Add habit form to be implemented
      </Text>
      
      <Button 
        mode="contained" 
        onPress={addSampleHabit}
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
      >
        Add Sample Habit
      </Button>
      
      <Button 
        mode="outlined" 
        onPress={() => navigation.goBack()}
        style={[styles.cancelButton, { borderColor: theme.colors.primary }]}
        labelStyle={{ color: theme.colors.primary }}
      >
        Cancel
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  placeholder: {
    marginBottom: 40,
  },
  button: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  cancelButton: {
    paddingHorizontal: 16,
  },
});

export default AddHabitScreen;