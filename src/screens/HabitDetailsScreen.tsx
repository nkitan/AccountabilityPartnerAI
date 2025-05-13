import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Title, Button } from 'react-native-paper';
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
      <Title style={[styles.title, { color: theme.colors.text }]}>
        {habit.title}
      </Title>
      
      <Text style={[styles.description, { color: theme.colors.text }]}>
        {habit.description}
      </Text>
      
      <Text style={[styles.placeholder, { color: theme.colors.placeholder }]}>
        Habit details screen to be implemented
      </Text>
      
      <Button 
        mode="contained" 
        onPress={() => navigation.navigate('EditHabit', { habitId })}
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  placeholder: {
    marginBottom: 40,
  },
  button: {
    paddingHorizontal: 16,
  },
});

export default HabitDetailsScreen;