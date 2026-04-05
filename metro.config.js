const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

// Remove core react-native alias if needed, but nativewind/metro handles standard configs
const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('mjs');

// Add support for Storybook resolution
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const defaultResolveResult = context.resolveRequest(
    context,
    moduleName,
    platform
  );
  return defaultResolveResult;
};

module.exports = withNativeWind(config, { input: './global.css' });
