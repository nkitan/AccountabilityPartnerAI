import { MD3LightTheme, MD3DarkTheme, useTheme as usePaperTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

// Extend the MD3Theme type to include our custom colors
declare global {
  namespace ReactNativePaper {
    interface MD3Colors {
      streak: string;
      reward: string;
      success: string;
      info: string;
      text: string;
      placeholder: string;
    }
  }
}

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
    text: '#000000',
    placeholder: '#757575',
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
    text: '#FFFFFF',
    placeholder: '#BBBBBB',
  },
};

// Helper function to create transparent colors
export const withOpacity = (color: string, opacity: number): string => {
  // For hex colors
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
  // For named colors or other formats, use a fallback approach
  return `rgba(103, 80, 164, ${opacity})`;
};

// Custom hook to use our extended theme
export const useTheme = () => {
  return usePaperTheme<MD3Theme>();
};