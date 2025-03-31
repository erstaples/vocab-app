/**
 * Script to remove unnecessary polyfills and update the build configuration
 * This script should be run after migrating to use the backend API
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const POLYFILLS_DIR = path.join(ROOT_DIR, 'src', 'polyfills');
const CONFIG_OVERRIDES_PATH = path.join(ROOT_DIR, 'config-overrides.js');

// Function to remove a directory recursively
function removeDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach(file => {
      const curPath = path.join(dirPath, file);
      
      if (fs.lstatSync(curPath).isDirectory()) {
        // Recursive case: it's a directory
        removeDirectory(curPath);
      } else {
        // Base case: it's a file
        console.log(`Removing file: ${curPath}`);
        fs.unlinkSync(curPath);
      }
    });
    
    console.log(`Removing directory: ${dirPath}`);
    fs.rmdirSync(dirPath);
  }
}

// Function to update the config-overrides.js file
function updateConfigOverrides() {
  if (!fs.existsSync(CONFIG_OVERRIDES_PATH)) {
    console.error(`Config overrides file not found: ${CONFIG_OVERRIDES_PATH}`);
    return;
  }
  
  console.log(`Updating config-overrides.js to remove Node.js polyfills...`);
  
  // Read the current file
  const originalContent = fs.readFileSync(CONFIG_OVERRIDES_PATH, 'utf8');
  
  // Replace with a minimal config that doesn't need customize-cra
  const updatedContent = `/**
 * React App Rewired configuration
 * This is a minimal config that doesn't modify webpack configuration.
 * Since we've moved all Node.js functionality to the backend,
 * we no longer need polyfills or special webpack configurations.
 */

module.exports = function override(config, env) {
  // No modifications needed anymore
  return config;
};
`;
  
  // Write the updated content
  fs.writeFileSync(CONFIG_OVERRIDES_PATH, updatedContent, 'utf8');
  console.log(`Config overrides file updated successfully!`);
}

// Main function to remove polyfills
function removePolyfills() {
  console.log('Starting polyfill removal...');
  
  // Step 1: Remove the polyfills directory
  console.log(`\nRemoving polyfills directory: ${POLYFILLS_DIR}`);
  removeDirectory(POLYFILLS_DIR);
  
  // Step 2: Update the config-overrides.js file
  console.log(`\nUpdating build configuration...`);
  updateConfigOverrides();
  
  console.log('\nPolyfill removal completed successfully!');
  console.log('\nNote: You may need to update your imports in any files that were using these polyfills.');
  console.log('Check for any "import fs from \'../polyfills/fs\'" or similar statements in your code.');
}

// Run the main function
removePolyfills();