// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add polyfill to the beginning of the entry file
config.resolver.extraNodeModules = {
  crypto: require.resolve('react-native-get-random-values')
};

module.exports = config;