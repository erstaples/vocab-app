const webpack = require('webpack');
const path = require('path');

module.exports = function override(config, env) {
  // Add polyfills for Node.js core modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "fs": false,
    "path": require.resolve("path-browserify"),
    "os": require.resolve("os-browserify/browser"),
    "crypto": require.resolve("crypto-browserify"),
    "buffer": require.resolve("buffer/"),
    "stream": require.resolve("stream-browserify"),
    "util": require.resolve("util/"),
    "vm": require.resolve("vm-browserify"),
    "net": false,
    "tls": false,
    "dns": false,
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "constants": require.resolve("constants-browserify"),
    "events": require.resolve("events/"),
    "url": require.resolve("url/"),
    "assert": require.resolve("assert/"),
    "querystring": require.resolve("querystring-es3"),
    "punycode": require.resolve("punycode/"),
    "zlib": require.resolve("browserify-zlib"),
    "child_process": false,
    // Complete disabling of problematic modules
    "pg-native": false,
    "node-gyp": false,
    "mock-aws-s3": false,
    "aws-sdk": false,
    "nock": false,
    "bcrypt": false
  };

  // Add alias for problematic modules
  config.resolve.alias = {
    ...config.resolve.alias,
    // Alias @mapbox/node-pre-gyp/lib/util/s3_setup.js to an empty module
    '@mapbox/node-pre-gyp/lib/util/s3_setup': path.resolve(__dirname, 'src/polyfills/empty.js'),
    'pg-native': path.resolve(__dirname, 'src/polyfills/empty.js')
  };

  // Add plugins to provide global Buffer and process
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
    // Completely ignore problematic modules
    new webpack.NormalModuleReplacementPlugin(
      /node_modules\/@mapbox\/node-pre-gyp\/lib\/util\/s3_setup.js$/,
      path.resolve(__dirname, 'src/polyfills/empty.js')
    ),
    new webpack.NormalModuleReplacementPlugin(
      /node_modules\/pg-native/,
      path.resolve(__dirname, 'src/polyfills/empty.js')
    ),
    new webpack.NormalModuleReplacementPlugin(
      /node_modules\/bcrypt\/bcrypt.js$/,
      path.resolve(__dirname, 'src/polyfills/empty.js')
    )
  ];

  // Ignore warnings
  config.ignoreWarnings = [
    /Failed to parse source map/,
    /Critical dependency/,
    /Can't resolve '(mock-aws-s3|aws-sdk|nock)'/
  ];

  return config;
};
