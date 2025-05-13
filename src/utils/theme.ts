import { MD3LightTheme, MD3DarkTheme, useTheme as usePaperTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

// Extend the default themes with custom colors
export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Custom colors
    streak: '#FF9800',
    reward: '#FFD700',
    success: '#4CAF50',
    info: '#2196F3',
    disabled: '#9E9E9E',
    error: '#F44336',
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    // Custom colors
    streak: '#FF9800',
    reward: '#FFD700',
    success: '#4CAF50',
    info: '#2196F3',
    disabled: '#757575',
    error: '#F44336',
  },
};

// Custom hook to use our extended theme
export const useTheme = () => {
  return usePaperTheme<MD3Theme>();
};