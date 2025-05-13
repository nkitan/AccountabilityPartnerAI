import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Title, Card, Paragraph, Button } from 'react-native-paper';
import { useTheme } from '../utils/theme';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';

const StatisticsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { habits, checkIns } = useAppContext();
  
  // Calculate basic stats
  const totalHabits = habits.length;
  const activeHabits = habits.filter(habit => habit.active).length;
  const completedToday = habits.filter(habit => 
    habit.completedDates.includes(new Date().toISOString().split('T')[0])
  ).length;
  
  // Get habit with longest streak
  const habitWithLongestStreak = habits.length > 0 
    ? habits.reduce((prev, current) => (prev.streakCount > current.streakCount) ? prev : current) 
    : null;
  
  // Get habit with most completions
  const habitWithMostCompletions = habits.length > 0 
    ? habits.reduce((prev, current) => 
        (prev.completedDates.length > current.completedDates.length) ? prev : current
      ) 
    : null;
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Title style={[styles.title, { color: theme.colors.text }]}>Statistics</Title>
      
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={{ color: theme.colors.text }}>Overview</Title>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                {totalHabits}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text }]}>
                Total Habits
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                {activeHabits}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text }]}>
                Active Habits
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                {completedToday}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text }]}>
                Completed Today
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                {habitWithLongestStreak?.streakCount || 0}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text }]}>
                Longest Streak
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
      
      {habitWithLongestStreak && habitWithLongestStreak.streakCount > 0 && (
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Ionicons name="flame" size={24} color={theme.colors.streak} />
              <Title style={[styles.cardTitle, { color: theme.colors.text }]}>
                Longest Streak
              </Title>
            </View>
            
            <Paragraph style={[styles.streakText, { color: theme.colors.text }]}>
              Your longest streak is {habitWithLongestStreak.streakCount} days for "{habitWithLongestStreak.title}"
            </Paragraph>
          </Card.Content>
        </Card>
      )}
      
      {habitWithMostCompletions && habitWithMostCompletions.completedDates.length > 0 && (
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
              <Title style={[styles.cardTitle, { color: theme.colors.text }]}>
                Most Consistent Habit
              </Title>
            </View>
            
            <Paragraph style={[styles.streakText, { color: theme.colors.text }]}>
              You've completed "{habitWithMostCompletions.title}" {habitWithMostCompletions.completedDates.length} times
            </Paragraph>
          </Card.Content>
        </Card>
      )}
      
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={{ color: theme.colors.text }}>Habit Categories</Title>
          
          <Paragraph style={[styles.placeholderText, { color: theme.colors.placeholder }]}>
            Detailed habit category breakdown charts will be displayed here
          </Paragraph>
        </Card.Content>
      </Card>
      
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={{ color: theme.colors.text }}>Weekly Progress</Title>
          
          <Paragraph style={[styles.placeholderText, { color: theme.colors.placeholder }]}>
            Weekly completion rate charts will be displayed here
          </Paragraph>
        </Card.Content>
      </Card>
      
      <Button 
        mode="outlined" 
        onPress={() => navigation.goBack()}
        style={[styles.button, { borderColor: theme.colors.primary }]}
        labelStyle={{ color: theme.colors.primary }}
      >
        Back
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
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    marginLeft: 8,
  },
  streakText: {
    fontSize: 16,
    lineHeight: 24,
  },
  placeholderText: {
    marginTop: 16,
    marginBottom: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  button: {
    marginTop: 8,
  },
});

export default StatisticsScreen;