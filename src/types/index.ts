/**
 * Navigation types for the application
 * Using the latest React Navigation v7 type patterns
 */
export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  Home: undefined;
  Habits: undefined;
  HabitDetails: { habitId: string };
  AddHabit: undefined;
  EditHabit: { habitId: string };
  Chat: undefined;
  Profile: undefined;
  Statistics: undefined;
  Rewards: undefined;
  Settings: undefined;
  Notifications: undefined;
};

/**
 * Type declaration to extend the React Navigation types
 */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

/**
 * User type definition
 */
export interface User {
  id: string;
  name: string;
  streakCount: number;
  virtualCurrency: number;
  joinedDate: string;
  lastActive: string;
}

/**
 * Habit type definition
 */
export interface Habit {
  id: string;
  title: string;
  description: string;
  category: string;
  frequency: string[];
  reminderTime?: string;
  createdAt: string;
  updatedAt: string;
  streak: number;
  completedDates: string[];
}