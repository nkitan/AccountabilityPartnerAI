import { MD3LightTheme, MD3DarkTheme, MD3Theme } from 'react-native-paper'; // Assuming react-native-paper

// --- Light Theme ---

export const defaultLightTheme: MD3Theme = {
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
    
    // Achievement and Milestone colors
    achievement: '#9C27B0',      // Purple for achievements
    achievementContainer: '#E1BEE7', // Light purple for achievement backgrounds
    milestone: '#2196F3',        // Blue for milestones
    milestoneContainer: '#BBDEFB' // Light blue for milestone backgrounds
  },
  roundness: 4,
  // fonts: configureFonts({config: yourFontConfig}),
};

// --- Dark Theme ---
export const defaultDarkTheme: MD3Theme = {
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
    
    // Achievement and Milestone colors
    achievement: '#CE93D8',      // Lighter purple for dark mode
    achievementContainer: '#4A148C', // Darker purple for dark mode backgrounds
    milestone: '#64B5F6',        // Lighter blue for dark mode
    milestoneContainer: '#0D47A1' // Darker blue for dark mode backgrounds
  },
  roundness: 4,
  // fonts: configureFonts({config: yourFontConfig}),
};

// --- Theme 1: Focused Teal & Amber - LIGHT ---
export const focusedTealAmberLightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#00796B', // Teal
    onPrimary: '#FFFFFF',
    primaryContainer: '#A7F3D0', // Light Teal
    onPrimaryContainer: '#00201B',
    secondary: '#FF8F00', // Amber
    onSecondary: '#FFFFFF',
    secondaryContainer: '#FFECB3', // Light Amber
    onSecondaryContainer: '#2C1A00',
    tertiary: '#38666B', // Darker Cyan/Blue-Gray
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#BCEBF0',
    onTertiaryContainer: '#001F23',
    error: '#B00020',
    onError: '#FFFFFF',
    errorContainer: '#FDE7E9',
    onErrorContainer: '#3E0005',
    background: '#FBFCFF', // Slightly off-white
    onBackground: '#191C1D',
    surface: '#F0F2F5', // A slightly more distinct surface from background
    onSurface: '#191C1D',
    surfaceVariant: '#DAE5E2',
    onSurfaceVariant: '#3F4947',
    outline: '#6F7977',
    outlineVariant: '#BFC9C6', // For subtle borders

    // --- Custom Semantic Colors ---
    streak: '#FF6F00',         // Vibrant Orange for streaks (from secondary)
    reward: '#FFC107',         // Gold for rewards
    success: '#388E3C',         // Medium Green for success
    info: '#0288D1',           // Medium Blue for info
    warning: '#FBC02D',        // Yellow for warnings
    
    disabled: '#BDBDBD',
    text: '#191C1D',           // Matches onBackground
    placeholder: '#6F7977',     // Matches outline

    // --- New Productivity-Focused Colors ---
    primaryAction: '#00796B',    // Teal (matches primary)
    secondaryAction: '#FF8F00',  // Amber (matches secondary)
    
    goalFocused: '#004D40',     // Darker Teal for focused goals
    taskPending: '#E0F2F1',     // Very light teal for pending task backgrounds
    taskCompleteBackground: '#C8E6C9', // Light green background for completed tasks
    
    priorityHigh: '#D32F2F',    // Strong Red
    priorityMedium: '#FFA000',   // Bright Orange/Amber
    priorityLow: '#1976D2',     // Calm Blue

    cardBackground: '#FFFFFF',   // Pure white cards on a slightly off-white bg
    inputFocusBorder: '#00796B', // Teal
    appBarBackground: '#E0F2F7', // Light Cyan/Teal tint for app bar
    bottomNavBackground: '#FFFFFF',

    scrim: 'rgba(0, 0, 0, 0.5)',
    successContainer: '#A5D6A7',
    errorContainer: '#FFCDD2',
    infoContainer: '#B3E5FC',
    warningContainer: '#FFF59D',
    streakContainer: '#FFCC80',  // Light Orange
    rewardContainer: '#FFE082',  // Light Gold
  },
};

// --- Theme 1: Focused Teal & Amber - DARK ---
export const focusedTealAmberDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#4DB6AC', // Lighter Teal
    onPrimary: '#003731',
    primaryContainer: '#005048', // Dark Teal container
    onPrimaryContainer: '#A7F3D0',
    secondary: '#FFB74D', // Lighter Amber
    onSecondary: '#492B00',
    secondaryContainer: '#683F00', // Dark Amber container
    onSecondaryContainer: '#FFECB3',
    tertiary: '#A0CFD4', // Lighter Cyan/Blue-Gray
    onTertiary: '#00363B',
    tertiaryContainer: '#1E4D52',
    onTertiaryContainer: '#BCEBF0',
    error: '#FFB4AB',
    onError: '#690005',
    errorContainer: '#93000A',
    onErrorContainer: '#FFDAD6',
    background: '#101415', // Very dark, slightly cool gray
    onBackground: '#E1E3E3',
    surface: '#181C1D', // Slightly lighter than background
    onSurface: '#E1E3E3',
    surfaceVariant: '#3F4947',
    onSurfaceVariant: '#BFC9C6',
    outline: '#899390',
    outlineVariant: '#3F4947',

    // --- Custom Semantic Colors ---
    streak: '#FF8A65',         // Lighter, softer Orange
    reward: '#FFD54F',         // Lighter Gold
    success: '#81C784',         // Lighter Green
    info: '#4FC3F7',           // Lighter Blue
    warning: '#FFEE58',        // Lighter Yellow
    
    disabled: '#616161',
    text: '#E1E3E3',           // Matches onBackground
    placeholder: '#899390',     // Matches outline

    // --- New Productivity-Focused Colors ---
    primaryAction: '#4DB6AC',    // Lighter Teal
    secondaryAction: '#FFB74D',  // Lighter Amber
    
    goalFocused: '#80CBC4',     // Soft, focused Teal
    taskPending: '#263238',     // Dark Blue-Gray for pending
    taskCompleteBackground: '#1B5E20', // Dark Muted Green
    
    priorityHigh: '#EF9A9A',    // Lighter Red
    priorityMedium: '#FFCC80',   // Lighter Orange/Amber
    priorityLow: '#90CAF9',     // Lighter Blue

    cardBackground: '#1E2223',   // Dark surface for cards
    inputFocusBorder: '#4DB6AC', // Lighter Teal
    appBarBackground: '#212728', // Slightly off-black for app bar
    bottomNavBackground: '#181C1D', // Matches surface

    scrim: 'rgba(0, 0, 0, 0.6)',
    successContainer: '#345E36',
    errorContainer: '#740007',
    infoContainer: '#004A73',
    warningContainer: '#604900',
    streakContainer: '#863B00',
    rewardContainer: '#6F4F00',
  },
};

// --- Theme 2: Deep Blue & Vibrant Green - LIGHT ---
export const deepBlueGreenLightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1A237E', // Deep Indigo/Blue
    onPrimary: '#FFFFFF',
    primaryContainer: '#C5CAE9', // Light Indigo
    onPrimaryContainer: '#000051',
    secondary: '#00C853', // Vibrant Green
    onSecondary: '#000000', // Black text on vibrant green for contrast
    secondaryContainer: '#A5D6A7', // Light Green
    onSecondaryContainer: '#003300',
    tertiary: '#546E7A', // Blue Gray
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#CFD8DC',
    onTertiaryContainer: '#29434E',
    error: '#D32F2F',
    onError: '#FFFFFF',
    errorContainer: '#FFCDD2',
    onErrorContainer: '#4A0004',
    background: '#F5F7FA', // Cool, light gray
    onBackground: '#1A1B1F',
    surface: '#FFFFFF', // White surface
    onSurface: '#1A1B1F',
    surfaceVariant: '#E0E0E0', // Light gray variant
    onSurfaceVariant: '#424242',
    outline: '#757575',
    outlineVariant: '#BDBDBD',

    // --- Custom Semantic Colors ---
    streak: '#FF9100',         // Orange for streaks
    reward: '#FFD600',         // Bright Yellow/Gold for rewards
    success: '#00C853',         // Vibrant Green (matches secondary)
    info: '#2962FF',           // Bright Blue for info
    warning: '#FFAB00',        // Amber for warnings
    
    disabled: '#BDBDBD',
    text: '#1A1B1F',
    placeholder: '#757575',

    // --- New Productivity-Focused Colors ---
    primaryAction: '#1A237E',    // Deep Blue (matches primary)
    secondaryAction: '#00C853',  // Vibrant Green (matches secondary)
    
    goalFocused: '#303F9F',     // Slightly lighter, but still strong blue
    taskPending: '#E8EAF6',     // Very light indigo for pending
    taskCompleteBackground: '#B9F6CA', // Very light, vibrant green
    
    priorityHigh: '#C62828',    // Strong Red
    priorityMedium: '#F9A825',   // Strong Yellow/Orange
    priorityLow: '#1565C0',     // Medium Blue

    cardBackground: '#FFFFFF',
    inputFocusBorder: '#1A237E',
    appBarBackground: '#E8EAF6', // Lightest blue tint for app bar
    bottomNavBackground: '#FFFFFF',

    scrim: 'rgba(0, 0, 0, 0.5)',
    successContainer: '#80CBC4', // Softer Green
    errorContainer: '#EF9A9A',
    infoContainer: '#90CAF9',
    warningContainer: '#FFE082',
    streakContainer: '#FFCC80',
    rewardContainer: '#FFF59D',
  },
};

// --- Theme 2: Deep Blue & Vibrant Green - DARK ---
export const deepBlueGreenDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#9FA8DA', // Lighter Indigo/Blue
    onPrimary: '#00003F',
    primaryContainer: '#000051', // Dark Indigo container
    onPrimaryContainer: '#C5CAE9',
    secondary: '#69F0AE', // Lighter Vibrant Green
    onSecondary: '#003D00',
    secondaryContainer: '#005200', // Dark Green container
    onSecondaryContainer: '#A5D6A7',
    tertiary: '#B0BEC5', // Lighter Blue Gray
    onTertiary: '#29434E',
    tertiaryContainer: '#3D5A64',
    onTertiaryContainer: '#CFD8DC',
    error: '#FF8A80', // Lighter Red
    onError: '#4A0004',
    errorContainer: '#8C0009',
    onErrorContainer: '#FFCDD2',
    background: '#121212', // Standard dark
    onBackground: '#E0E0E0',
    surface: '#1E1E1E', // Slightly lighter dark surface
    onSurface: '#E0E0E0',
    surfaceVariant: '#424242', // Medium gray variant
    onSurfaceVariant: '#BDBDBD',
    outline: '#9E9E9E',
    outlineVariant: '#424242',

    // --- Custom Semantic Colors ---
    streak: '#FFB74D',
    reward: '#FFF176',
    success: '#69F0AE',         // Lighter Vibrant Green (matches secondary)
    info: '#82B1FF',           // Lighter Bright Blue
    warning: '#FFD180',        // Lighter Amber
    
    disabled: '#616161',
    text: '#E0E0E0',
    placeholder: '#9E9E9E',

    // --- New Productivity-Focused Colors ---
    primaryAction: '#9FA8DA',    // Lighter Indigo/Blue
    secondaryAction: '#69F0AE',  // Lighter Vibrant Green
    
    goalFocused: '#7986CB',     // Muted, focused light blue
    taskPending: '#2C2C3A',     // Dark, slightly blueish gray
    taskCompleteBackground: '#004D40', // Dark Teal/Green for completed
    
    priorityHigh: '#E57373',
    priorityMedium: '#FFB74D',
    priorityLow: '#64B5F6',

    cardBackground: '#282828',   // Dark gray for cards
    inputFocusBorder: '#9FA8DA',
    appBarBackground: '#1F1F1F', // Darker than surface for app bar
    bottomNavBackground: '#1E1E1E', // Matches surface

    scrim: 'rgba(0, 0, 0, 0.6)',
    successContainer: '#004E1A',
    errorContainer: '#6E0007',
    infoContainer: '#0D47A1', // Kept darker for contrast
    warningContainer: '#663C00',
    streakContainer: '#663300',
    rewardContainer: '#665200',
  },
};