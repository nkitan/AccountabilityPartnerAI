// This file contains polyfills needed by the app
try {
  // Import the polyfill first (the order is important)
  require('react-native-get-random-values');
  // Make sure crypto.getRandomValues is available
  if (typeof global.crypto.getRandomValues !== 'function') {
    console.warn('crypto.getRandomValues is not available. UUID generation might not work correctly.');
  }
} catch (error) {
  console.error('Failed to load react-native-get-random-values polyfill:', error);
}