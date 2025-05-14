import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Title, List, Switch, Divider, Button } from 'react-native-paper';
import { useTheme } from '../utils/theme';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';

const SettingsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { settings, updateSettings } = useAppContext();
  
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
  
  // Handle sound toggle
  const toggleSound = () => {
    updateSettings({ 
      soundEnabled: !settings.soundEnabled 
    });
  };
  
  // Handle vibration toggle
  const toggleVibration = () => {
    updateSettings({ 
      vibrationEnabled: !settings.vibrationEnabled 
    });
  };
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Title style={[styles.title, { color: theme.colors.text }]}>Settings</Title>
      
      <List.Section style={styles.section}>
        <List.Subheader style={{ color: theme.colors.primary }}>Appearance</List.Subheader>
        
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
          title="Language"
          description="Change application language"
          titleStyle={{ color: theme.colors.text }}
          descriptionStyle={{ color: theme.colors.placeholder }}
          left={props => <List.Icon {...props} icon="translate" color={theme.colors.primary} />}
          right={props => <Text style={{ color: theme.colors.text }}>English</Text>}
        />
      </List.Section>
      
      <List.Section style={styles.section}>
        <List.Subheader style={{ color: theme.colors.primary }}>Notifications</List.Subheader>
        
        <List.Item
          title="Push Notifications"
          description="Enable or disable all notifications"
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
          title="Reminder Time"
          description="Set default time for daily reminders"
          titleStyle={{ color: theme.colors.text }}
          descriptionStyle={{ color: theme.colors.placeholder }}
          left={props => <List.Icon {...props} icon="clock" color={theme.colors.primary} />}
          right={props => <Text style={{ color: theme.colors.text }}>{settings.reminderTime}</Text>}
        />
      </List.Section>
      
      <List.Section style={styles.section}>
        <List.Subheader style={{ color: theme.colors.primary }}>Feedback</List.Subheader>
        
        <List.Item
          title="Sound"
          description="Enable or disable sound effects"
          titleStyle={{ color: theme.colors.text }}
          descriptionStyle={{ color: theme.colors.placeholder }}
          left={props => <List.Icon {...props} icon="volume-high" color={theme.colors.primary} />}
          right={props => (
            <Switch
              value={settings.soundEnabled}
              onValueChange={toggleSound}
              color={theme.colors.primary}
            />
          )}
        />
        
        <Divider style={styles.divider} />
        
        <List.Item
          title="Vibration"
          description="Enable or disable vibration feedback"
          titleStyle={{ color: theme.colors.text }}
          descriptionStyle={{ color: theme.colors.placeholder }}
          left={props => <List.Icon {...props} icon="vibrate" color={theme.colors.primary} />}
          right={props => (
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={toggleVibration}
              color={theme.colors.primary}
            />
          )}
        />
      </List.Section>
      
      <Button 
        mode="outlined" 
        onPress={() => navigation.goBack()}
        style={[styles.button, { borderColor: theme.colors.primary }]}
        labelStyle={{ color: theme.colors.primary }}
      >
        Save Changes
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
  },
  divider: {
    marginLeft: 60,
  },
  button: {
    marginTop: 16,
    marginBottom: 40,
  },
});

export default SettingsScreen;