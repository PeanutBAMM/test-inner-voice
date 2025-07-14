const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);
  
  // Disable unstable features for stability
  config.resolver.unstable_enablePackageExports = false;
  config.resolver.unstable_enableSymlinks = false;
  
  // Better error handling and compatibility
  config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
  
  // Improve source extensions
  config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];
  
  // WSL2 optimization - prevent excessive file watching
  config.watchFolders = [];
  
  // Disable caching for more predictable behavior during development
  config.resetCache = true;
  
  // Better error messages
  config.transformer.minifierConfig = {
    keep_fnames: true,
    mangle: {
      keep_fnames: true,
    },
  };
  
  // Increase transformer timeout for slower systems
  config.transformer.asyncRequireModulePath = require.resolve(
    'metro-runtime/src/modules/asyncRequire'
  );
  
  return config;
})();