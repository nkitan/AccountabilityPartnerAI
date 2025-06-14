import { MD3LightTheme, MD3DarkTheme, useTheme as usePaperTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { deepBlueGreenDarkTheme, deepBlueGreenLightTheme, focusedTealAmberDarkTheme, focusedTealAmberLightTheme } from './themes';

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
      achievement: string;
      achievementContainer: string;
      milestone: string;
      milestoneContainer: string;
    }
  }
}

// Export the extended themes with custom colors
export const lightTheme = focusedTealAmberLightTheme;
export const darkTheme = focusedTealAmberDarkTheme;

// Custom hook to use our extended theme
export const useTheme = () => {
  return usePaperTheme<MD3Theme>();
};