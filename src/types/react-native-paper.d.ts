import 'react-native-paper';
import '@react-navigation/native';

declare module 'react-native-paper' {
  interface ThemeColors {
    // Custom colors
    streak: string;
    reward: string;
    success: string;
    info: string;
    disabled: string;
    error: string;
  }
}

// Extend React Navigation types
declare module '@react-navigation/native' {
  export interface Theme {
    dark: boolean;
    colors: {
      primary: string;
      background: string;
      card: string;
      text: string;
      border: string;
      notification: string;
      // Custom colors
      streak: string;
      reward: string;
      success: string;
      info: string;
      disabled: string;
      error: string;
    };
  }
}