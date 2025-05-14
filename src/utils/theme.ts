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

// --- Light Theme ---
export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,

    // --- Your Existing Custom Colors (Slightly Refined where needed) ---
    streak: '#FF9800',         // Vibrant Orange for streaks
    reward: '#FFC107',         // A slightly richer Gold for rewards
    success: '#4CAF50',         // Classic Green for success
    info: '#03A9F4',           // A slightly brighter Blue for info
    warning: '#FFEB3B',        // Yellow for warnings (consider adding this)
    error: '#F44336',           // Standard Red for errors
    disabled: '#BDBDBD',       // Lighter Gray for disabled elements for better subtlety
    
    text: '#1C1B1F',           // MD3 default OnBackground, good for text
    placeholder: '#757575',     // Maintained your placeholder

    // --- New Productivity-Focused Colors ---
    // Core App Actions & Status
    primaryAction: MD3LightTheme.colors.primary, // Or a custom vibrant color like a Teal: '#00796B'
    secondaryAction: MD3LightTheme.colors.secondary, // Or a custom complementary color: '#FF6F00'
    
    // Task & Goal Specific
    goalFocused: '#6200EE',     // A deep purple for focused goals (can be primary or specific)
    taskPending: '#ECEFF1',     // Very light blue-gray for pending task backgrounds
    taskCompleteBackground: '#E8F5E9', // Light green background for completed tasks
    
    // Priority Indicators
    priorityHigh: '#D32F2F',    // Stronger Red for high priority
    priorityMedium: '#FFA000',   // Amber for medium priority
    priorityLow: '#1976D2',     // Calm Blue for low priority

    // UI Elements
    cardBackground: MD3LightTheme.colors.surface, // Default surface is good
    inputFocusBorder: MD3LightTheme.colors.primary,
    appBarBackground: MD3LightTheme.colors.surface,
    bottomNavBackground: MD3LightTheme.colors.surfaceContainer, // Slightly different from main background

    // Semantic Overlays & Tints
    scrim: 'rgba(0, 0, 0, 0.5)',
    successContainer: '#C8E6C9', // Lighter green for backgrounds of success messages
    errorContainer: '#FFCDD2',   // Lighter red for backgrounds of error messages
    infoContainer: '#B3E5FC',    // Lighter blue for backgrounds of info messages
    warningContainer: '#FFF9C4', // Lighter yellow for backgrounds of warning messages
    streakContainer: '#FFE0B2',  // Lighter orange for streak related UI elements
    rewardContainer: '#FFECB3',  // Lighter gold for reward related UI elements
  },
  roundness: 4,
  // fonts: configureFonts({config: yourFontConfig}),
};

// --- Dark Theme ---
export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,

    // --- Your Existing Custom Colors (Slightly Refined where needed) ---
    streak: '#FFB74D',         // Lighter Orange for dark mode visibility
    reward: '#FFD54F',         // Lighter Gold for dark mode visibility
    success: '#81C784',         // Lighter Green for dark mode
    info: '#4FC3F7',           // Lighter Blue for dark mode
    warning: '#FFF176',        // Lighter Yellow for warnings
    error: '#E57373',           // Lighter Red for dark mode
    disabled: '#757575',       // Maintained your disabled color, good contrast
    
    text: '#E6E1E5',           // MD3 default OnBackground, good for text
    placeholder: '#A0A0A0',     // Slightly adjusted for dark mode clarity

    // --- New Productivity-Focused Colors ---
    // Core App Actions & Status
    primaryAction: MD3DarkTheme.colors.primary, // Or a custom vibrant color like a lighter Teal: '#4DB6AC'
    secondaryAction: MD3DarkTheme.colors.secondary, // Or a custom complementary color: '#FFAB40'

    // Task & Goal Specific
    goalFocused: '#BB86FC',     // Lighter Purple for focused goals in dark mode
    taskPending: '#373737',     // Dark gray for pending task backgrounds
    taskCompleteBackground: '#2E7D32', // Darker, muted green background for completed tasks
    
    // Priority Indicators
    priorityHigh: '#EF9A9A',    // Lighter, but still distinct Red
    priorityMedium: '#FFCC80',   // Lighter Amber
    priorityLow: '#90CAF9',     // Lighter Calm Blue

    // UI Elements
    cardBackground: MD3DarkTheme.colors.surface, 
    inputFocusBorder: MD3DarkTheme.colors.primary,
    appBarBackground: MD3DarkTheme.colors.surface, // Often slightly lighter than main bg in dark mode: MD3DarkTheme.colors.surfaceContainerHigh
    bottomNavBackground: MD3DarkTheme.colors.surfaceContainer,

    // Semantic Overlays & Tints
    scrim: 'rgba(0, 0, 0, 0.6)', // Scrim might need to be a bit darker in dark mode
    successContainer: '#1B5E20', // Darker green for backgrounds of success messages
    errorContainer: '#B71C1C',   // Darker red for backgrounds of error messages
    infoContainer: '#0D47A1',    // Darker blue for backgrounds of info messages
    warningContainer: '#F57F17', // Darker yellow/amber for backgrounds of warning messages
    streakContainer: '#E65100',  // Darker orange
    rewardContainer: '#FF8F00',  // Darker gold
  },
  roundness: 4,
  // fonts: configureFonts({config: yourFontConfig}),
};


// Custom hook to use our extended theme
export const useTheme = () => {
  return usePaperTheme<MD3Theme>();
};