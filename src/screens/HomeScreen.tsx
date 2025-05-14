import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  RefreshControl
} from 'react-native';
import { 
  useTheme, 
  Text, 
  Card,   
  Button, 
  Avatar, 
  Divider,
  IconButton,
  ProgressBar,
  Chip
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Habit, AIMessage } from '../types';
import { useAppContext } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import AIPartnerService from '../services/AIPartnerService';
import 'react-native-get-random-values'; // This must be imported before uuid
import { v4 as uuidv4 } from 'uuid';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { 
    user, 
    setUser,
    habits, 
    checkIns, 
    conversation, 
    addHabit, 
    updateHabit, 
    addCheckIn,
    addNotification
  } = useAppContext();
  
  const [refreshing, setRefreshing] = useState(false);
  const [todayMessage, setTodayMessage] = useState<AIMessage | null>(null);
  const [todayHabits, setTodayHabits] = useState<Habit[]>([]);
  const [completedToday, setCompletedToday] = useState(0);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Load today's habits and message
  useEffect(() => {
    loadTodayData();
  }, [habits, checkIns]);
  
  // Update user's streak count based on the highest streak among all habits
  useEffect(() => {
    if (user && habits.length > 0) {
      const highestStreak = Math.max(...habits.map(habit => habit.streakCount));
      if (highestStreak > (user.streakCount || 0)) {
        setUser({
          ...user,
          streakCount: highestStreak
        });
      }
    }
  }, [habits, user]);

  const loadTodayData = () => {
    // Filter habits for today based on frequency
    const filteredHabits = habits.filter(habit => {
      if (!habit.active) return false;
      
      if (habit.frequency === 'daily') return true;
      
      if (habit.frequency === 'weekly') {
        const habitStartDate = new Date(habit.startDate);
        const todayDate = new Date();
        const dayDiff = Math.floor((todayDate.getTime() - habitStartDate.getTime()) / (1000 * 60 * 60 * 24));
        return dayDiff % 7 === 0;
      }
      
      // For monthly and custom frequencies, we'd need more complex logic
      return true;
    });
    
    setTodayHabits(filteredHabits);
    
    // Count completed habits for today
    const completed = filteredHabits.filter(habit => 
      habit.completedDates.includes(today)
    ).length;
    
    // Check if all habits for today are completed and it's a new completion
    if (filteredHabits.length > 0 && completed === filteredHabits.length && completed > completedToday) {
      // Award consistency bonus
      const consistencyBonus = 15;
      
      if (user) {
        setUser({
          ...user,
          virtualCurrency: (user.virtualCurrency || 0) + consistencyBonus
        });
        
        // Create a notification for the consistency bonus
        const bonusNotification = {
          id: uuidv4(),
          title: 'Daily Bonus!',
          body: `You completed all habits for today! +${consistencyBonus} points bonus!`,
          timestamp: new Date().toISOString(),
          read: false,
          type: 'reward'
        };
        
        addNotification(bonusNotification);
      }
    }
    
    setCompletedToday(completed);
    
    // Generate a daily message if none exists
    if (!todayMessage) {
      const newMessage = AIPartnerService.generateEncouragementMessage(habits);
      setTodayMessage(newMessage);
    }
  };

  // Handle pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    loadTodayData();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Handle habit completion
  const handleCompleteHabit = (habit: Habit) => {
    // Check if already completed today
    if (habit.completedDates.includes(today)) return;
    
    // Update habit with new completion date and streak
    const updatedHabit = {
      ...habit,
      completedDates: [...habit.completedDates, today],
      streakCount: habit.streakCount + 1,
      longestStreak: Math.max(habit.longestStreak, habit.streakCount + 1),
      updatedAt: new Date().toISOString()
    };
    
    // Create a check-in record
    const newCheckIn = {
      id: uuidv4(),
      habitId: habit.id,
      date: today,
      completed: true,
      createdAt: new Date().toISOString()
    };
    
    // Update state
    updateHabit(updatedHabit);
    addCheckIn(newCheckIn);
    
    // Calculate points earned
    // Base points for completing any habit
    let pointsEarned = 10;
    
    // Priority bonus
    if (habit.priority) {
      if (habit.priority === 'high') pointsEarned += 5;
      else if (habit.priority === 'medium') pointsEarned += 3;
    }
    
    // Streak bonus (capped at 20 points)
    const streakBonus = Math.min(Math.floor(updatedHabit.streakCount / 7) * 5, 20);
    pointsEarned += streakBonus;
    
    // Check for streak milestones
    const streakMilestones = [7, 14, 30, 60, 90, 180, 365];
    let milestoneBonus = 0;
    
    if (streakMilestones.includes(updatedHabit.streakCount)) {
      milestoneBonus = updatedHabit.streakCount * 2; // 2 points per day in the streak
      pointsEarned += milestoneBonus;
      
      // Create a milestone notification
      const milestoneNotification = {
        id: uuidv4(),
        title: `${updatedHabit.streakCount} Day Streak!`,
        body: `Amazing! You've maintained ${habit.title} for ${updatedHabit.streakCount} days! +${milestoneBonus} points bonus!`,
        timestamp: new Date().toISOString(),
        read: false,
        type: 'milestone',
        relatedHabitId: habit.id
      };
      
      addNotification(milestoneNotification);
    }
    
    // Update user's virtual currency and streak count
    if (user) {
      setUser({
        ...user,
        streakCount: Math.max(updatedHabit.streakCount, user.streakCount || 0),
        virtualCurrency: (user.virtualCurrency || 0) + pointsEarned
      });
    }
    
    // Create a notification for habit completion
    const notification = {
      id: uuidv4(),
      title: 'Habit Completed',
      body: `Great job completing ${habit.title}! Your streak is now ${updatedHabit.streakCount} days.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'streak',
      relatedHabitId: habit.id
    };
    
    addNotification(notification);
    
    // Create a notification for points earned
    const pointsNotification = {
      id: uuidv4(),
      title: 'Points Earned',
      body: `You earned ${pointsEarned} points for completing ${habit.title}!${streakBonus > 0 ? ` (includes +${streakBonus} streak bonus)` : ''}${milestoneBonus > 0 ? ` (includes +${milestoneBonus} milestone bonus)` : ''}`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'reward',
      relatedHabitId: habit.id
    };
    
    addNotification(pointsNotification);
    
    // Refresh data
    loadTodayData();
  };

  // Navigate to add habit screen
  const navigateToAddHabit = () => {
    navigation.navigate('AddHabit');
  };

  // Navigate to chat screen
  const navigateToChat = () => {
    navigation.navigate('Chat');
  };

  // Render a habit card
  const renderHabitCard = (habit: Habit) => {
    const isCompleted = habit.completedDates.includes(today);
    
    // Determine priority color (assuming habit has a priority property, or defaulting to 'medium')
    const priorityColor = habit.priority === 'high' ? theme.colors.priorityHigh : 
                         habit.priority === 'low' ? theme.colors.priorityLow : 
                         theme.colors.priorityMedium;
    
    return (
      <Card 
        key={habit.id} 
        style={[
          styles.habitCard, 
          { 
            backgroundColor: theme.colors.cardBackground,
            borderColor: theme.colors.outline,
            borderLeftColor: habit.color || priorityColor,
            borderLeftWidth: 5,
            borderRadius: theme.roundness * 2
          }
        ]}
        onPress={() => navigation.navigate('HabitDetails', { habitId: habit.id })}
      >
        <Card.Content style={styles.habitCardContent}>
          <View style={styles.habitCardHeader}>
            <View style={styles.habitTitleContainer}>
              <Text variant="titleLarge" style={{ color: theme.colors.text }}>{habit.title}</Text>
              <View style={styles.habitMetaContainer}>
                <Text variant="bodyMedium" style={{ color: theme.colors.placeholder, marginRight: 8 }}>{habit.category}</Text>
                {habit.priority && (
                  <Chip 
                    style={[
                      styles.priorityChip, 
                      { 
                        backgroundColor: 
                          habit.priority === 'high' 
                            ? 'rgba(255, 87, 34, 0.2)' 
                            : habit.priority === 'medium'
                              ? 'rgba(255, 193, 7, 0.2)'
                              : 'rgba(76, 175, 80, 0.2)',
                        height: 32,
                        width: 'auto'
                      }
                    ]}
                    textStyle={{ 
                      color: 
                        habit.priority === 'high' 
                          ? theme.colors.priorityHigh || '#FF5722' 
                          : habit.priority === 'medium'
                            ? theme.colors.priorityMedium || '#FFC107'
                            : theme.colors.priorityLow || '#4CAF50',
                      fontSize: 12,
                      fontWeight: '500'
                    }}
                    icon={() => (
                      <Ionicons 
                        name={
                          habit.priority === 'high' 
                            ? "flash" 
                            : habit.priority === 'medium'
                              ? "alert"
                              : "leaf"
                        }
                        size={14} 
                        color={
                          habit.priority === 'high' 
                            ? theme.colors.priorityHigh || '#FF5722' 
                            : habit.priority === 'medium'
                              ? theme.colors.priorityMedium || '#FFC107'
                              : theme.colors.priorityLow || '#4CAF50'
                        }
                      />
                    )}
                  >
                    {habit.priority.charAt(0).toUpperCase() + habit.priority.slice(1)}
                  </Chip>
                )}
              </View>
            </View>
            
            <TouchableOpacity 
              style={[
                styles.completeButton, 
                { 
                  backgroundColor: isCompleted ? theme.colors.taskCompleteBackground : theme.colors.surface,
                  borderColor: isCompleted ? theme.colors.success : theme.colors.primaryAction,
                }
              ]}
              onPress={() => handleCompleteHabit(habit)}
              disabled={isCompleted}
            >
              {isCompleted ? (
                <Ionicons name="checkmark" size={24} color={theme.colors.success} />
              ) : (
                <Text style={{ color: theme.colors.primaryAction }}>Complete</Text>
              )}
            </TouchableOpacity>
          </View>
          
          <View style={styles.streakContainer}>
            <Ionicons name="flame" size={18} color={theme.colors.streak} />
            <Text style={[styles.streakText, { color: theme.colors.text }]}>
              {habit.streakCount} day streak
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header with greeting and profile */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme.colors.text }]}>
            Hello, {user?.name || 'Friend'}
          </Text>
          <Text style={[styles.date, { color: theme.colors.placeholder }]}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>
        
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Avatar.Text 
            size={50} 
            label={user?.name?.substring(0, 2).toUpperCase() || 'U'} 
            backgroundColor={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>
      
      {/* Progress summary */}
      <Card style={[styles.progressCard, { 
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.roundness * 3
      }]}>
        <Card.Content>
          <View style={styles.progressHeader}>
            <Text variant="titleLarge" style={{ color: theme.colors.text }}>Today's Progress</Text>
            <View style={styles.currencyContainer}>
              <Ionicons name="star" size={18} color={theme.colors.reward} />
              <Text style={[styles.currencyText, { color: theme.colors.text }]}>
                {user?.virtualCurrency || 0}
              </Text>
            </View>
          </View>
          
          <View style={styles.progressBarContainer}>
            <ProgressBar 
              progress={todayHabits.length > 0 ? completedToday / todayHabits.length : 0} 
              color={theme.colors.primaryAction}
              style={styles.progressBar}
            />
            <Text style={[styles.progressText, { color: theme.colors.text }]}>
              {completedToday}/{todayHabits.length} habits completed
            </Text>
          </View>
          
          <View style={styles.streakSummary}>
            <Ionicons name="flame" size={24} color={theme.colors.streak} />
            <Text style={[styles.streakSummaryText, { color: theme.colors.text }]}>
              {user?.streakCount || 0} day streak
            </Text>
          </View>
        </Card.Content>
      </Card>
      
      {/* AI Partner message */}
      {todayMessage && (
        <Card 
          style={[styles.messageCard, { 
            backgroundColor: theme.colors.infoContainer,
            borderRadius: theme.roundness * 3
          }]}
          onPress={navigateToChat}
        >
          <Card.Content style={styles.messageCardContent}>
            <View style={styles.messageHeader}>
              <Avatar.Icon 
                size={40} 
                icon="robot" 
                backgroundColor={theme.colors.primaryAction}
                color="#fff"
              />
              <Text style={[styles.messageTitle, { color: theme.colors.primaryAction }]}>
                Your Accountability Partner
              </Text>
            </View>
            
            <Text variant="bodyMedium" style={[styles.messageText, { color: theme.colors.text }]}>
              {todayMessage.content}
            </Text>
            
            <Button 
              mode="text" 
              onPress={navigateToChat}
              style={styles.chatButton}
              labelStyle={{ color: theme.colors.primaryAction }}
            >
              Continue Chat
            </Button>
          </Card.Content>
        </Card>
      )}
      
      {/* Today's habits */}
      <View style={styles.habitsSection}>
        <View style={styles.sectionHeader}>
          <Text variant="titleLarge" style={{ color: theme.colors.text }}>Today's Habits</Text>
          <Button 
            mode="text" 
            onPress={() => navigation.navigate('Habits')}
            labelStyle={{ color: theme.colors.primary }}
          >
            See All
          </Button>
        </View>
        
        {todayHabits.length > 0 ? (
          todayHabits.map(habit => renderHabitCard(habit))
        ) : (
          <Card style={[styles.emptyCard, { 
            backgroundColor: theme.colors.cardBackground,
            borderRadius: theme.roundness * 2
          }]}>
            <Card.Content style={styles.emptyCardContent}>
              <Ionicons name="calendar-outline" size={40} color={theme.colors.placeholder} />
              <Text variant="bodyMedium" style={[styles.emptyText, { color: theme.colors.placeholder }]}>
                No habits scheduled for today
              </Text>
              <Button 
                mode="contained" 
                onPress={navigateToAddHabit}
                style={[styles.addButton, { 
                  backgroundColor: theme.colors.primaryAction,
                  borderRadius: theme.roundness * 5
                }]}
              >
                Add a Habit
              </Button>
            </Card.Content>
          </Card>
        )}
      </View>
      
      {/* Add habit button */}
      {todayHabits.length > 0 && (
        <Button 
          mode="contained" 
          onPress={navigateToAddHabit}
          style={[styles.floatingButton, { 
            backgroundColor: theme.colors.primaryAction,
            borderRadius: theme.roundness * 7
          }]}
          icon="plus"
        >
          Add Habit
        </Button>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 16,
  },
  progressCard: {
    marginBottom: 20,
    borderRadius: 12,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    marginVertical: 10,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
  progressText: {
    marginTop: 5,
    textAlign: 'center',
  },
  streakSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  streakSummaryText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageCard: {
    marginBottom: 20,
    borderRadius: 12,
  },
  messageCardContent: {
    padding: 5,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  messageTitle: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  chatButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  habitsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  habitCard: {
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  habitCardContent: {
    padding: 5,
  },
  habitCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  habitTitleContainer: {
    flex: 1,
  },
  habitMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  priorityChip: {
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 4,
    minWidth: 32,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  completeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  streakText: {
    marginLeft: 5,
    fontSize: 14,
  },
  emptyCard: {
    borderRadius: 12,
    marginBottom: 20,
  },
  emptyCardContent: {
    alignItems: 'center',
    padding: 30,
  },
  emptyText: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  addButton: {
    borderRadius: 20,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 30,
    paddingHorizontal: 20,
  },
});

export default HomeScreen;