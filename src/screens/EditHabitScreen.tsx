import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Title, Button } from 'react-native-paper';
import { useTheme } from '../utils/theme';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useAppContext } from '../context/AppContext';

type EditHabitRouteProp = RouteProp<RootStackParamList, 'EditHabit'>;
type EditHabitNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditHabit'>;

const EditHabitScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<EditHabitRouteProp>();
  const navigation = useNavigation<EditHabitNavigationProp>();
  const { habits, updateHabit } = useAppContext();
  
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
  
  // Function to update the habit (for demo purposes)
  const updateSampleHabit = () => {
    const updatedHabit = {
      ...habit,
      title: habit.title + ' (Updated)',
      updatedAt: new Date().toISOString()
    };
    
    updateHabit(updatedHabit);
    navigation.goBack();
  };
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Title style={[styles.title, { color: theme.colors.text }]}>
        Edit Habit: {habit.title}
      </Title>
      
      <Text style={[styles.placeholder, { color: theme.colors.placeholder }]}>
        Edit habit form to be implemented
      </Text>
      
      <Button 
        mode="contained" 
        onPress={updateSampleHabit}
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
      >
        Update Habit
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

export default EditHabitScreen;