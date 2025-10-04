const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude Firebase packages from web bundles
config.resolver.resolverMainFields = ['browser', 'main'];
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];

module.exports = config;
