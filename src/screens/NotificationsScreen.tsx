import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Text, Title, Card, Paragraph, Button } from 'react-native-paper';
import { useTheme } from '../utils/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppContext, Notification } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { v7 as uuidv7 } from 'uuid';
import { RootStackParamList } from '../types';

const NotificationsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { 
    notifications, 
    addNotification, 
    markNotificationAsRead, 
    clearNotifications,
    scheduleNotification 
  } = useAppContext();
  
  // Add a sample notification (for demo purposes)
  const addSampleNotification = () => {
    const newNotification = {
      id: uuidv7(),
      title: 'Streak Milestone',
      body: 'Congratulations! You\'ve reached a 7-day streak on your habit.',
      timestamp: new Date().toISOString(),
      read: false,
      type: 'streak'
    };
    
    addNotification(newNotification);
  };
  
  // Schedule a test notification with advanced options
  const scheduleTestNotification = async () => {
    // Get current date/time
    const now = new Date();
    
    // Schedule for 5 seconds from now
    const notificationId = await scheduleNotification(
      '🔔 Test Notification',
      'This is a test notification with advanced features. Tap to view more details.',
      { 
        seconds: 5,
        repeats: false 
      },
      'system'
    );
    
    if (notificationId) {
      // Show confirmation to user with countdown
      alert(`Test notification scheduled! It will appear in 5 seconds at ${new Date(now.getTime() + 5000).toLocaleTimeString()}.`);
    }
  };
  
  // Schedule a daily reminder notification
  const scheduleDailyReminder = async () => {
    // Set time for 8:00 AM tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 0, 0, 0);
    
    const notificationId = await scheduleNotification(
      '⏰ Daily Habit Reminder',
      'Don\'t forget to check in with your habits today!',
      { 
        hour: 8,
        minute: 0,
        repeats: true 
      },
      'reminder'
    );
    
    if (notificationId) {
      alert(`Daily reminder scheduled for 8:00 AM every day, starting tomorrow.`);
    }
  };
  
  // Mark notification as read
  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
  };
  
  // Render a notification item
  const renderNotificationItem = ({ item }: { item: Notification }) => {
    // Get icon based on notification type
    let icon = 'notifications';
    let iconColor = theme.colors.primary;
    
    switch (item.type) {
      case 'reminder':
        icon = 'alarm';
        iconColor = theme.colors.info;
        break;
      case 'streak':
        icon = 'flame';
        iconColor = theme.colors.streak;
        break;
      case 'achievement':
        icon = 'trophy';
        iconColor = theme.colors.reward;
        break;
      case 'message':
        icon = 'chatbubble';
        iconColor = theme.colors.primary;
        break;
      case 'system':
        icon = 'information-circle';
        iconColor = theme.colors.secondary;
        break;
    }
    
    return (
      <Card 
        style={[
          styles.notificationCard, 
          { 
            backgroundColor: item.read ? theme.colors.surface : theme.colors.primary + '10',
            borderColor: theme.colors.outline
          }
        ]}
        onPress={() => handleMarkAsRead(item.id)}
      >
        <Card.Content style={styles.notificationContent}>
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={24} color={iconColor} />
          </View>
          
          <View style={styles.textContainer}>
            <Title style={[styles.notificationTitle, { color: theme.colors.text }]}>
              {item.title}
            </Title>
            <Paragraph style={[styles.notificationBody, { color: theme.colors.text }]}>
              {item.body}
            </Paragraph>
            <Text style={[styles.timestamp, { color: theme.colors.placeholder }]}>
              {new Date(item.timestamp).toLocaleString()}
            </Text>
          </View>
          
          {!item.read && (
            <View style={[styles.unreadIndicator, { backgroundColor: theme.colors.primary }]} />
          )}
        </Card.Content>
      </Card>
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Title style={[styles.title, { color: theme.colors.text }]}>Notifications</Title>
        
        <Button 
          mode="text" 
          onPress={clearNotifications}
          labelStyle={{ color: theme.colors.primary }}
          disabled={notifications.length === 0}
        >
          Clear All
        </Button>
      </View>
      
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off" size={80} color={theme.colors.placeholder} />
          <Paragraph style={[styles.emptyText, { color: theme.colors.placeholder }]}>
            No notifications yet
          </Paragraph>
        </View>
      )}
      
      {/* Demo buttons */}
      <View style={styles.demoButtonsContainer}>
        <Button 
          mode="contained" 
          onPress={addSampleNotification}
          style={[styles.demoButton, { backgroundColor: theme.colors.primary }]}
        >
          Add Sample Notification
        </Button>
        <Button 
          mode="contained-tonal" 
          onPress={scheduleTestNotification}
          style={[styles.demoButton, { marginTop: 8 }]}
        >
          Schedule Test Notification
        </Button>
        <Button 
          mode="outlined" 
          onPress={scheduleDailyReminder}
          style={[styles.demoButton, { marginTop: 8 }]}
          icon="alarm"
        >
          Set Daily Reminder
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 80,
  },
  notificationCard: {
    borderRadius: 12,
    borderWidth: 1,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 5,
  },
  iconContainer: {
    marginRight: 12,
    padding: 8,
  },
  textContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationBody: {
    fontSize: 14,
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 8,
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 8,
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
  demoButtonsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  demoButton: {
    width: '100%',
  },
});

export default NotificationsScreen;