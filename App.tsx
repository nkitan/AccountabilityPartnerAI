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
        backgroundColor: isDarkMode ? '#121212' : '#F5F5F5' 
      }}>
        <ActivityIndicator 
          size="large" 
          color={isDarkMode ? '#BB86FC' : '#6200EE'} 
        />
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <AppNavigator />
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
