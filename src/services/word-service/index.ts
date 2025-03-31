import { Word } from '../../models';
import apiService from '../api';

/**
 * Service to handle word-related operations
 * Uses API service to fetch data from backend
 */
export class WordService {
  /**
   * Get all available words
   * @returns Promise with array of all words
   */
  public async getAllWords(): Promise<Word[]> {
    try {
      const words = await apiService.fetchJSON<Word[]>('/words');
      return words;
    } catch (error) {
      console.error('Error fetching words:', error);
      return [];
    }
  }

  /**
   * Get a specific word by ID
   * @param id Word ID
   * @returns Promise with word object or undefined if not found
   */
  public async getWordById(id: string): Promise<Word | undefined> {
    try {
      const word = await apiService.fetchJSON<Word>(`/words/${id}`);
      return word;
    } catch (error) {
      console.error(`Error fetching word ${id}:`, error);
      return undefined;
    }
  }

  /**
   * Get words by difficulty level
   * @param level Difficulty level (1-5)
   * @returns Promise with array of words matching the difficulty level
   */
  public async getWordsByDifficulty(level: 1 | 2 | 3 | 4 | 5): Promise<Word[]> {
    try {
      const words = await apiService.fetchJSON<Word[]>(`/words?difficulty=${level}`);
      return words;
    } catch (error) {
      console.error(`Error fetching words with difficulty ${level}:`, error);
      return [];
    }
  }

  /**
   * Get a batch of new words for the user to learn (legacy method)
   * @param count Number of words to return
   * @param excludeIds IDs of words to exclude (e.g., already known words)
   * @param maxDifficulty Maximum difficulty level
   * @returns Array of words
   */
  public getNewWords(
    count: number,
    excludeIds?: string[],
    maxDifficulty?: 1 | 2 | 3 | 4 | 5
  ): Word[];

  /**
   * Get a batch of new words for the user to learn (API method)
   * @param userId User ID
   * @param count Number of words to return
   * @param maxDifficulty Maximum difficulty level
   * @returns Promise with array of words
   */
  public getNewWords(
    userId: string,
    count?: number,
    maxDifficulty?: 1 | 2 | 3 | 4 | 5
  ): Promise<Word[]>;

  /**
   * Get a batch of new words for the user to learn
   * Implementation that handles both legacy and API versions
   */
  public getNewWords(
    userIdOrCount: string | number,
    countOrExcludeIds?: number | string[],
    maxDifficulty: 1 | 2 | 3 | 4 | 5 = 5
  ): Word[] | Promise<Word[]> {
    // If the first parameter is a number, use the legacy implementation
    if (typeof userIdOrCount === 'number') {
      console.warn('Using deprecated getNewWords method - update to use API version');
            
      // Mock implementation that returns empty array
      // This is temporary during transition and should be removed once all code is updated
      const mockWords: Word[] = [];
      return mockWords;
    }
    
    // Otherwise, use the API implementation
    else {
      const userId = userIdOrCount;
      const count = typeof countOrExcludeIds === 'number' ? countOrExcludeIds : 5;
      
      // Using the API's new-words endpoint which knows about the user's progress
      return this.getNewWordsFromApi(userId, count, maxDifficulty);
    }
  }
  
  /**
   * Private method to get new words from API
   */
  private async getNewWordsFromApi(
    userId: string,
    count: number = 5,
    maxDifficulty: 1 | 2 | 3 | 4 | 5 = 5
  ): Promise<Word[]> {
    try {
      return await apiService.getNewWords(userId, count, maxDifficulty);
    } catch (error) {
      console.error('Error fetching new words:', error);
      return [];
    }
  }

  /**
   * Search for words based on a query string
   * @param query Search query
   * @returns Promise with array of matching words
   */
  public async searchWords(query: string): Promise<Word[]> {
    try {
      const words = await apiService.fetchJSON<Word[]>(`/words/search?query=${encodeURIComponent(query)}`);
      return words;
    } catch (error) {
      console.error(`Error searching for words with query "${query}":`, error);
      return [];
    }
  }

  /**
   * Get related words for a given word
   * @param wordId ID of the word to find relations for
   * @param count Maximum number of related words to return
   * @returns Promise with array of related words
   */
  public async getRelatedWords(wordId: string, count: number = 5): Promise<Word[]> {
    try {
      const words = await apiService.fetchJSON<Word[]>(`/words/${wordId}/related?count=${count}`);
      return words;
    } catch (error) {
      console.error(`Error fetching related words for word ${wordId}:`, error);
      return [];
    }
  }

  /**
   * Add a new word
   * @param word Word data (without ID)
   * @returns Promise with the created word including its ID
   */
  public async addWord(word: Omit<Word, 'id'>): Promise<Word> {
    try {
      const newWord = await apiService.fetchJSON<Word>('/words', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(word)
      });
      return newWord;
    } catch (error) {
      console.error('Error adding word:', error);
      throw error;
    }
  }
}

// Export a singleton instance
const wordService = new WordService();
export default wordService;
