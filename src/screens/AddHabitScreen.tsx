import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, Chip } from 'react-native-paper';
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
  const [selectedPriority, setSelectedPriority] = React.useState<'high' | 'medium' | 'low'>('medium');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('work');

  // Available categories
  const categories = [
    'work', 'fitness', 'mindfulness', 'learning', 'social', 'health', 'creativity', 'custom'
  ];
  
  // Function to add a sample habit (for demo purposes)
  const addSampleHabit = () => {
    const newHabit = {
      id: uuidv4(), // Using v4 (random) for better compatibility
      title: 'Sample Habit',
      description: 'This is a sample habit for demonstration purposes.',
      category: selectedCategory,
      frequency: 'daily',
      startDate: new Date().toISOString(),
      streakCount: 0,
      longestStreak: 0,
      completedDates: [],
      active: true,
      color: '#6200EE',
      priority: selectedPriority,
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
      
      {/* Priority Selection */}
      <View style={styles.priorityContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Priority</Text>
        <View style={styles.priorityOptions}>
          <TouchableOpacity 
            style={[
              styles.priorityOption, 
              { 
                backgroundColor: selectedPriority === 'high' ? theme.colors.priorityHigh : 'transparent',
                borderColor: theme.colors.priorityHigh,
              }
            ]}
            onPress={() => setSelectedPriority('high')}
          >
            <Text style={{ 
              color: selectedPriority === 'high' ? '#fff' : theme.colors.priorityHigh 
            }}>
              High
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.priorityOption, 
              { 
                backgroundColor: selectedPriority === 'medium' ? theme.colors.priorityMedium : 'transparent',
                borderColor: theme.colors.priorityMedium,
              }
            ]}
            onPress={() => setSelectedPriority('medium')}
          >
            <Text style={{ 
              color: selectedPriority === 'medium' ? '#fff' : theme.colors.priorityMedium 
            }}>
              Medium
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.priorityOption, 
              { 
                backgroundColor: selectedPriority === 'low' ? theme.colors.priorityLow : 'transparent',
                borderColor: theme.colors.priorityLow,
              }
            ]}
            onPress={() => setSelectedPriority('low')}
          >
            <Text style={{ 
              color: selectedPriority === 'low' ? '#fff' : theme.colors.priorityLow 
            }}>
              Low
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Category Selection */}
      <View style={styles.categoryContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Category</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryChipsContainer}
        >
          {categories.map((category) => (
            <Chip
              key={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryChip,
                { 
                  backgroundColor: selectedCategory === category 
                    ? theme.colors.primary 
                    : theme.colors.surface,
                  borderColor: theme.colors.primary
                }
              ]}
              textStyle={{ 
                color: selectedCategory === category 
                  ? '#fff' 
                  : theme.colors.primary 
              }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Chip>
          ))}
        </ScrollView>
      </View>
      
      <Text style={[styles.placeholder, { color: theme.colors.placeholder }]}>
        Add habit form to be implemented
      </Text>
      
      <Button 
        mode="contained" 
        onPress={addSampleHabit}
        style={[styles.button, { 
          backgroundColor: theme.colors.primaryAction,
          borderRadius: theme.roundness * 5
        }]}
      >
        Add Sample Habit
      </Button>
      
      <Button 
        mode="outlined" 
        onPress={() => navigation.goBack()}
        style={[styles.cancelButton, { 
          borderColor: theme.colors.primaryAction,
          borderRadius: theme.roundness * 5
        }]}
        labelStyle={{ color: theme.colors.primaryAction }}
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
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: 16,
    marginBottom: 16,
    width: '80%',
  },
  cancelButton: {
    paddingHorizontal: 16,
    width: '80%',
  },
  // Styles for priority selection
  priorityContainer: {
    width: '100%',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  priorityOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  priorityOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: '28%',
    alignItems: 'center',
  },
  // Styles for category selection
  categoryContainer: {
    width: '100%',
    marginBottom: 24,
  },
  categoryChipsContainer: {
    paddingVertical: 8,
  },
  categoryChip: {
    marginRight: 8,
    borderWidth: 1,
    minWidth: 90, // Set a fixed minimum width for all chips
    justifyContent: 'center', // Center the text horizontally
    height: 36, // Set a fixed height for all chips
    alignItems: 'center', // Center content vertically
  },
});

export default AddHabitScreen;