// Import polyfills first
import './polyfill';

import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { AppProvider, useAppContext } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import { lightTheme, darkTheme } from './src/utils/theme';
import { ActivityIndicator, View } from 'react-native';

// Main app component with theme support
const Main = () => {
  const [isReady, setIsReady] = useState(false);
  const { isDarkMode } = useAppContext();
  const theme = isDarkMode ? darkTheme : lightTheme;
  
  // Simulate loading resources
  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Here you would load fonts, initialize services, etc.
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    };

    prepareApp();
  }, []);

  if (!isReady) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: isDarkMode ? theme.colors.background : theme.colors.background 
      }}>
        <ActivityIndicator 
          size="large" 
          color={isDarkMode ? theme.colors.primaryAction : theme.colors.primaryAction} 
        />
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} translucent={false} backgroundColor={theme.colors.background} />
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <AppNavigator />
      </View>
    </PaperProvider>
  );
};

// Root component that provides context
export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <Main />
      </AppProvider>
    </SafeAreaProvider>
  );
}
