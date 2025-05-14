import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  RefreshControl,
  Animated,
  Dimensions,
  StatusBar,
  Platform
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
  Chip,
  Surface
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Habit, AIMessage } from '../types';
import { useAppContext } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import AIPartnerService from '../services/AIPartnerService';
import 'react-native-get-random-values'; // This must be imported before uuid
import { v4 as uuidv4 } from 'uuid';
import { LinearGradient } from 'expo-linear-gradient';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const { width, height } = Dimensions.get('window');

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
  
  // Animation values
  const scrollY = new Animated.Value(0);
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });
  const headerTranslate = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -20],
    extrapolate: 'clamp',
  });

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
    
    // Determine priority color
    const priorityColor = habit.priority === 'high' ? theme.colors.priorityHigh : 
                         habit.priority === 'low' ? theme.colors.priorityLow : 
                         theme.colors.priorityMedium;
    
    // Get priority icon
    const priorityIcon = habit.priority === 'high' ? "flash" : 
                        habit.priority === 'medium' ? "alert-circle" : "leaf";
    
    return (
      <Card 
        key={habit.id} 
        style={[
          styles.habitCard, 
          { 
            backgroundColor: theme.colors.cardBackground,
            borderRadius: theme.roundness * 2,
            borderLeftWidth: 4,
            borderLeftColor: habit.color || priorityColor,
            marginBottom: 12
          }
        ]}
        onPress={() => navigation.navigate('HabitDetails', { habitId: habit.id })}
      >
        <Card.Content style={styles.habitCardContent}>
          <View style={styles.habitCardHeader}>
            <View style={styles.habitTitleContainer}>
              <Text variant="titleMedium" style={{ color: theme.colors.text, fontWeight: '600' }}>
                {habit.title}
              </Text>
              <View style={styles.habitMetaContainer}>
                <Chip 
                  style={{ backgroundColor: 'rgba(3, 169, 244, 0.1)', marginRight: 8 }}
                  textStyle={{ color: theme.colors.info, fontSize: 12 }}
                >
                  {habit.category || 'General'}
                </Chip>
                
                {habit.priority && (
                  <Chip 
                    style={{ 
                      backgroundColor: 
                        habit.priority === 'high' 
                          ? 'rgba(255, 87, 34, 0.1)' 
                          : habit.priority === 'medium'
                            ? 'rgba(255, 193, 7, 0.1)'
                            : 'rgba(76, 175, 80, 0.1)',
                    }}
                    textStyle={{ 
                      color: 
                        habit.priority === 'high' 
                          ? theme.colors.priorityHigh
                          : habit.priority === 'medium'
                            ? theme.colors.priorityMedium
                            : theme.colors.priorityLow,
                      fontSize: 12
                    }}
                    icon={() => (
                      <Ionicons 
                        name={priorityIcon}
                        size={14} 
                        color={
                          habit.priority === 'high' 
                            ? theme.colors.priorityHigh
                            : habit.priority === 'medium'
                              ? theme.colors.priorityMedium
                              : theme.colors.priorityLow
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
                  backgroundColor: isCompleted 
                    ? theme.colors.successContainer 
                    : 'rgba(33, 150, 243, 0.1)',
                  borderColor: isCompleted 
                    ? theme.colors.success 
                    : theme.colors.primaryAction,
                  borderWidth: 1,
                  borderRadius: 20,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  minWidth: 100
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
            <Text style={{ marginLeft: 5, color: theme.colors.text }}>
              {habit.streakCount} day streak
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar 
        backgroundColor="transparent" 
        translucent={true} 
        barStyle={theme.dark ? 'light-content' : 'dark-content'} 
      />
      
      <ScrollView 
        style={{ flex: 1 }}
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
          
          <TouchableOpacity 
            onPress={() => navigation.navigate('Profile')}
            style={styles.profileButton}
          >
            <Avatar.Text 
              size={50} 
              label={user?.name?.substring(0, 2).toUpperCase() || 'U'} 
              backgroundColor={theme.colors.primary}
            />
            <View style={[styles.badgeContainer, { backgroundColor: theme.colors.reward }]}>
              <Ionicons name="star" size={14} color="#fff" />
              <Text style={styles.badgeText}>{user?.virtualCurrency || 0}</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Progress summary */}
        <Card style={[styles.progressCard, { 
          backgroundColor: theme.colors.cardBackground,
          borderRadius: theme.roundness * 3,
        }]}>
          <Card.Content>
            <View style={styles.progressHeader}>
              <Text variant="titleLarge" style={{ color: theme.colors.text, fontWeight: 'bold' }}>
                Today's Progress
              </Text>
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
            
            <View style={styles.progressStatsContainer}>
              <View style={styles.progressStat}>
                <Text style={[styles.progressStatValue, { color: theme.colors.text, fontWeight: 'bold' }]}>
                  {completedToday}
                </Text>
                <Text style={[styles.progressStatLabel, { color: theme.colors.placeholder }]}>
                  Completed
                </Text>
              </View>
              
              <View style={styles.progressStat}>
                <Text style={[styles.progressStatValue, { color: theme.colors.text, fontWeight: 'bold' }]}>
                  {todayHabits.length - completedToday}
                </Text>
                <Text style={[styles.progressStatLabel, { color: theme.colors.placeholder }]}>
                  Remaining
                </Text>
              </View>
              
              <View style={styles.progressStat}>
                <View style={styles.streakSummary}>
                  <Ionicons name="flame" size={20} color={theme.colors.streak} />
                  <Text style={[styles.streakSummaryText, { color: theme.colors.text, fontWeight: 'bold' }]}>
                    {user?.streakCount || 0}
                  </Text>
                </View>
                <Text style={[styles.progressStatLabel, { color: theme.colors.placeholder }]}>
                  Day Streak
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        {/* AI Partner message */}
        {todayMessage && (
          <Card 
            style={[styles.messageCard, { 
              backgroundColor: theme.colors.cardBackground,
              borderRadius: theme.roundness * 3,
            }]}
            onPress={navigateToChat}
          >
            <Card.Content>
              <View style={styles.messageHeader}>
                <Avatar.Icon 
                  size={46} 
                  icon="robot" 
                  backgroundColor={theme.colors.primaryAction}
                  color="#fff"
                />
                <View style={styles.messageTitleContainer}>
                  <Text style={[styles.messageTitle, { color: theme.colors.text, fontWeight: 'bold' }]}>
                    Your Accountability Partner
                  </Text>
                  <Text style={[styles.messageSubtitle, { color: theme.colors.placeholder }]}>
                    Daily Motivation
                  </Text>
                </View>
              </View>
              
              <View style={styles.messageContent}>
                <Text variant="bodyMedium" style={[styles.messageText, { color: theme.colors.text }]}>
                  {todayMessage.content}
                </Text>
              </View>
              
              <View style={styles.messageActions}>
                <Button 
                  mode="contained" 
                  onPress={navigateToChat}
                  style={[styles.chatButton, { backgroundColor: theme.colors.primaryAction }]}
                  icon="chat"
                >
                  Continue Chat
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}
        
        {/* Today's habits */}
        <View style={styles.habitsSection}>
          <View style={styles.sectionHeader}>
            <View>
              <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.text, fontWeight: 'bold' }]}>
                Today's Habits
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.placeholder }}>
                {todayHabits.length} {todayHabits.length === 1 ? 'habit' : 'habits'} scheduled
              </Text>
            </View>
            
            <Button 
              mode="text" 
              onPress={() => navigation.navigate('Habits')}
              labelStyle={{ color: theme.colors.primary }}
            >
              See All
            </Button>
          </View>
          
          {todayHabits.length > 0 ? (
            <View>
              {todayHabits.map(habit => renderHabitCard(habit))}
            </View>
          ) : (
            <Card style={[styles.emptyCard, { backgroundColor: theme.colors.cardBackground }]}>
              <Card.Content style={styles.emptyCardContent}>
                <Ionicons name="calendar-outline" size={40} color={theme.colors.placeholder} />
                <Text variant="titleMedium" style={[styles.emptyTitle, { color: theme.colors.text }]}>
                  No habits for today
                </Text>
                <Text variant="bodyMedium" style={[styles.emptyText, { color: theme.colors.placeholder }]}>
                  Create a new habit to start building consistency
                </Text>
                <Button 
                  mode="contained" 
                  onPress={navigateToAddHabit}
                  style={[styles.addButton, { backgroundColor: theme.colors.primaryAction }]}
                  icon="plus"
                >
                  Add a Habit
                </Button>
              </Card.Content>
            </Card>
          )}
        </View>
      </ScrollView>
      
      {/* Add habit floating button */}
      {todayHabits.length > 0 && (
        <Button 
          mode="contained" 
          onPress={navigateToAddHabit}
          style={[styles.floatingButton, { backgroundColor: theme.colors.primaryAction }]}
          icon="plus"
        >
          Add Habit
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  contentContainer: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: Platform.OS === 'ios' ? 10 : 0,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
  },
  profileButton: {
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  
  // Progress card styles
  progressCard: {
    marginBottom: 20,
    borderRadius: 16,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  progressStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  progressStat: {
    flex: 1,
    alignItems: 'center',
  },
  progressStatValue: {
    fontSize: 20,
    marginBottom: 4,
  },
  progressStatLabel: {
    fontSize: 12,
  },
  streakSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakSummaryText: {
    marginLeft: 5,
    fontSize: 20,
  },
  
  // Message card styles
  messageCard: {
    marginBottom: 20,
    borderRadius: 16,
    elevation: 2,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  messageTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  messageTitle: {
    fontSize: 18,
    marginBottom: 2,
  },
  messageSubtitle: {
    fontSize: 14,
  },
  messageContent: {
    marginBottom: 16,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  messageActions: {
    alignItems: 'flex-end',
  },
  chatButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  
  // Habits section styles
  habitsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 4,
  },
  
  // Habit card styles
  habitCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  habitCardContent: {
    padding: 12,
  },
  habitCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  habitTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  habitMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  
  // Empty state styles
  emptyCard: {
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
  },
  emptyCardContent: {
    alignItems: 'center',
    padding: 30,
  },
  emptyTitle: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  addButton: {
    borderRadius: 20,
    marginTop: 10,
  },
  
  // Floating button styles
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 30,
    paddingHorizontal: 20,
    elevation: 4,
  },
});

export default HomeScreen;