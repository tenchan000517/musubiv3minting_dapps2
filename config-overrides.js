const path = require('path');

module.exports = function override(config, env) {
  // Node.js core modules の polyfills を追加
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "assert": require.resolve("assert/build/assert.js"),
    "stream": require.resolve("stream-browserify"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "os": require.resolve("os-browserify/browser"),
    "buffer": require.resolve("buffer/"),
    "zlib": require.resolve("browserify-zlib") // zlibのポリフィルを追加
  };

  return config;
};
