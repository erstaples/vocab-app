/**
 * React App Rewired configuration
 * This is a minimal config that doesn't modify webpack configuration.
 * Since we've moved all Node.js functionality to the backend,
 * we no longer need polyfills or special webpack configurations.
 */

module.exports = function override(config, env) {
  // No modifications needed anymore
  return config;
};
