import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity,
  Image
} from 'react-native';
import { 
  Text, 
  Card, 
  Button, 
  Avatar, 
  Divider,
  List,
  Switch
} from 'react-native-paper';
import { useTheme } from '../utils/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useAppContext } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { 
    user, 
    habits, 
    settings, 
    updateSettings, 
    resetApp 
  } = useAppContext();
  
  // Calculate stats
  const totalHabits = habits.length;
  const activeHabits = habits.filter(habit => habit.active).length;
  const completedToday = habits.filter(habit => 
    habit.completedDates.includes(new Date().toISOString().split('T')[0])
  ).length;
  
  // Get longest streak habit
  const habitWithLongestStreak = habits.length > 0 
    ? habits.reduce((prev, current) => (prev.streakCount > current.streakCount) ? prev : current) 
    : null;
  
  // Handle theme toggle - will update immediately
  const toggleTheme = () => {
    updateSettings({ 
      theme: settings.theme === 'light' ? 'dark' : 'light' 
    });
    // Theme will change immediately due to our AppContext changes
  };
  
  // Handle notifications toggle
  const toggleNotifications = () => {
    updateSettings({ 
      notificationsEnabled: !settings.notificationsEnabled 
    });
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <StatusBar style="auto" />
      
      {/* Profile header */}
      <View style={styles.header}>
        <Avatar.Text 
          size={80} 
          label={user?.name?.substring(0, 2).toUpperCase() || 'U'} 
          backgroundColor={theme.colors.primary}
        />
        <Text variant="headlineMedium" style={[styles.userName, { color: theme.colors.text }]}>
          {user?.name || 'User'}
        </Text>
        <Text variant="bodyMedium" style={[styles.joinDate, { color: theme.colors.placeholder }]}>
          Member since {user?.joinedDate 
            ? new Date(user.joinedDate).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              }) 
            : 'Today'}
        </Text>
      </View>
      
      {/* Stats card */}
      <Card style={[styles.statsCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text variant="titleLarge" style={{ color: theme.colors.text }}>Your Stats</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                {user?.streakCount || 0}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text }]}>
                Day Streak
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                {user?.virtualCurrency || 0}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text }]}>
                Coins
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
          </View>
          
          {habitWithLongestStreak && habitWithLongestStreak.streakCount > 0 && (
            <View style={styles.longestStreakContainer}>
              <Ionicons name="trophy" size={24} color={theme.colors.reward} />
              <Text style={[styles.longestStreakText, { color: theme.colors.text }]}>
                Longest streak: {habitWithLongestStreak.streakCount} days ({habitWithLongestStreak.title})
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
      
      {/* Rewards button */}
      <Button 
        mode="contained" 
        onPress={() => navigation.navigate('Rewards')}
        style={[styles.rewardsButton, { backgroundColor: theme.colors.reward }]}
        icon={({ size, color }) => (
          <Ionicons name="star" size={size} color={color} />
        )}
      >
        View Rewards
      </Button>
      
      {/* Settings */}
      <Card style={[styles.settingsCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text variant="titleLarge" style={{ color: theme.colors.text }}>Settings</Text>
          
          <List.Item
            title="Dark Theme"
            description="Switch between light and dark mode"
            titleStyle={{ color: theme.colors.text }}
            descriptionStyle={{ color: theme.colors.placeholder }}
            left={props => <List.Icon {...props} icon="theme-light-dark" color={theme.colors.primary} />}
            right={props => (
              <Switch
                value={settings.theme === 'dark'}
                onValueChange={toggleTheme}
                color={theme.colors.primary}
              />
            )}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Notifications"
            description="Enable or disable push notifications"
            titleStyle={{ color: theme.colors.text }}
            descriptionStyle={{ color: theme.colors.placeholder }}
            left={props => <List.Icon {...props} icon="bell" color={theme.colors.primary} />}
            right={props => (
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={toggleNotifications}
                color={theme.colors.primary}
              />
            )}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Statistics"
            description="View detailed progress statistics"
            titleStyle={{ color: theme.colors.text }}
            descriptionStyle={{ color: theme.colors.placeholder }}
            left={props => <List.Icon {...props} icon="chart-bar" color={theme.colors.primary} />}
            onPress={() => navigation.navigate('Statistics')}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Notifications Center"
            description="View all your notifications"
            titleStyle={{ color: theme.colors.text }}
            descriptionStyle={{ color: theme.colors.placeholder }}
            left={props => <List.Icon {...props} icon="bell-ring" color={theme.colors.primary} />}
            onPress={() => navigation.navigate('Notifications')}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
        </Card.Content>
      </Card>
      
      {/* About section */}
      <Card style={[styles.aboutCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text variant="titleLarge" style={{ color: theme.colors.text }}>About</Text>
          
          <Text variant="bodyMedium" style={[styles.aboutText, { color: theme.colors.text }]}>
            Your AI Accountability Partner is designed to help you build better habits through consistent tracking, 
            personalized feedback, and a reward system that keeps you motivated.
          </Text>
          
          <View style={styles.versionContainer}>
            <Text style={[styles.versionText, { color: theme.colors.placeholder }]}>
              Version 1.0.0
            </Text>
          </View>
        </Card.Content>
      </Card>
      
      {/* Reset button */}
      <Button 
        mode="outlined" 
        onPress={resetApp}
        style={[styles.resetButton, { borderColor: theme.colors.error }]}
        labelStyle={{ color: theme.colors.error }}
      >
        Reset App Data
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
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
  },
  joinDate: {
    fontSize: 14,
  },
  statsCard: {
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
  longestStreakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    padding: 12,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 8,
  },
  longestStreakText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  rewardsButton: {
    marginBottom: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  settingsCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  divider: {
    marginVertical: 8,
  },
  aboutCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  aboutText: {
    lineHeight: 22,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  versionText: {
    fontSize: 12,
  },
  resetButton: {
    marginTop: 8,
    borderWidth: 1,
  },
});

export default ProfileScreen;