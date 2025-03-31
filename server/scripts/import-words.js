/**
 * Script to import words from the frontend static dataset into the database
 * Run with: node import-words.js
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Import services
const db = require('../services/database');
const wordService = require('../services/word-service');
const migrationService = require('../services/migrations');

// Path to the frontend word service file
const FRONTEND_WORD_SERVICE_PATH = path.join(__dirname, '..', '..', 'src', 'services', 'word-service', 'index.ts');

/**
 * Extract words from the frontend TypeScript file
 * This is a simple parser that extracts word data from the TypeScript file
 * @returns {Array} Extracted words
 */
function extractWordsFromFrontendFile() {
  try {
    // Read the frontend word service file
    const fileContent = fs.readFileSync(FRONTEND_WORD_SERVICE_PATH, 'utf8');
    
    // Find the literary words array in the file
    const wordsArrayStart = fileContent.indexOf('const literaryWords: Word[] = [');
    const wordsArrayEnd = fileContent.indexOf('];', wordsArrayStart);
    
    if (wordsArrayStart === -1 || wordsArrayEnd === -1) {
      throw new Error('Could not find literaryWords array in the frontend file');
    }
    
    // Extract the array content
    const arrayContent = fileContent.substring(wordsArrayStart, wordsArrayEnd + 2);
    
    // Use regex to extract word objects
    const wordRegex = /{\s*id:\s*['"](.+?)['"],\s*value:\s*['"](.+?)['"],\s*definition:\s*['"](.+?)['"],\s*partOfSpeech:\s*['"](.+?)['"],\s*pronunciation:\s*['"](.+?)['"],\s*example:\s*['"](.+?)['"],\s*synonyms:\s*\[(.*?)\],\s*difficulty:\s*(\d+),\s*etymology:\s*['"](.+?)['"]\s*}/gs;
    
    const words = [];
    let wordMatch;
    
    while ((wordMatch = wordRegex.exec(arrayContent)) !== null) {
      try {
        // Extract values from regex match
        const [_, id, value, definition, partOfSpeech, pronunciation, example, synonymsStr, difficulty, etymology] = wordMatch;
        
        // Parse synonyms - they might be in quotes or not
        const synonyms = synonymsStr
          .split(',')
          .map(s => s.trim())
          .map(s => s.replace(/^['"]|['"]$/g, '')) // Remove quotes if present
          .filter(s => s.length > 0);
        
        // Create a clean word object
        const wordObj = {
          id,
          value,
          definition,
          partOfSpeech,
          pronunciation,
          example,
          synonyms,
          difficulty: parseInt(difficulty),
          etymology
        };
        
        words.push(wordObj);
      } catch (err) {
        console.error(`Error parsing word match:`, err);
      }
    }
    
    console.log(`Extracted ${words.length} words from the frontend file`);
    return words;
  } catch (error) {
    console.error('Error extracting words from frontend file:', error);
    return [];
  }
}

/**
 * Import words into the database
 */
async function importWords() {
  try {
    // Run migrations first to ensure the words table exists
    await migrationService.runMigrations();
    
    // Extract words from the frontend file
    const words = extractWordsFromFrontendFile();
    
    if (words.length === 0) {
      console.error('No words extracted from the frontend file');
      return;
    }
    
    console.log(`Found ${words.length} words to import`);
    
    // Import words using the word service
    const importedCount = await wordService.importWords(words);
    
    console.log(`Successfully imported ${importedCount} words into the database`);
    
    // Close the database connection
    await db.close();
  } catch (error) {
    console.error('Error importing words:', error);
  }
}

// Run the import function
importWords().then(() => {
  console.log('Import process completed');
}).catch(err => {
  console.error('Import process failed:', err);
});