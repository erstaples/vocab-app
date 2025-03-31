#!/usr/bin/env node

/**
 * Script to store the demo user ID in localStorage for testing in the browser
 * This will create an HTML file that you can open to set localStorage
 */

const fs = require('fs');
const path = require('path');

// Get the demo user ID from command line argument or use the one from the previous run
const demoUserId = process.argv[2] || '6d352c36-ad17-40bc-885e-d49c993ea4ca';

// Create a simple HTML file to set the localStorage value
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Set Demo User ID</title>
</head>
<body>
  <h1>Setting Demo User ID in localStorage</h1>
  <div id="result"></div>
  
  <script>
    try {
      localStorage.setItem("demo_user_id", "${demoUserId}");
      document.getElementById("result").innerHTML = 
        "Success! The demo user ID has been set in localStorage: <strong>${demoUserId}</strong>.<br><br>" +
        "You can now close this page and return to the vocabulary app.";
    } catch (error) {
      document.getElementById("result").innerHTML = 
        "Error setting localStorage: " + error.message;
    }
  </script>
</body>
</html>
`;

// Write the HTML file
const outputPath = path.join(__dirname, '..', 'public', 'set-demo-user.html');
fs.writeFileSync(outputPath, htmlContent);

console.log(`HTML file created at: ${outputPath}`);
console.log(`Open this file in your browser to set the demo user ID in localStorage.`);
console.log(`You can access it at: http://localhost:3000/set-demo-user.html when the app is running.`);
