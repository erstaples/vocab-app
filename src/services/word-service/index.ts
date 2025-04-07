import { Word } from '../../models';
import apiService from '../api';

export interface WordWithMorphemes extends Omit<Word, 'id'> {
  morphemes: {
    id: number;
    position: number;
  }[];
}

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
      console.log('Fetching word:', id);
      const word = await apiService.fetchJSON<Word>(`/words/${id}`);
      console.log('Fetched word:', word);
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
   * Create a new word with optional morphemes
   * @param wordData Word data including optional morphemes
   * @returns Promise with the created word including its ID
   */
  public async createWord(wordData: WordWithMorphemes): Promise<Word> {
    try {
      // First create the word
      const { morphemes, ...wordFields } = wordData;
      const newWord = await apiService.fetchJSON<Word>('/words', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(wordFields)
      });

      // If morphemes are provided, associate them with the word
      if (morphemes && morphemes.length > 0) {
        await apiService.fetchJSON(`/words/${newWord.id}/morphemes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            morphemes: morphemes.map(m => ({
              morphemeId: m.id,
              position: m.position
            }))
          })
        });
      }

      return newWord;
    } catch (error) {
      console.error('Error creating word:', error);
      throw error;
    }
  }

  /**
   * Update an existing word
   * @param id Word ID
   * @param wordData Updated word data
   * @returns Promise with the updated word
   */
  public async updateWord(id: string, wordData: Partial<WordWithMorphemes>): Promise<Word> {
    try {
      const { morphemes, ...wordFields } = wordData;
      
      // Update word fields
      const updatedWord = await apiService.fetchJSON<Word>(`/words/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(wordFields)
      });

      // If morphemes are provided, update word-morpheme associations
      if (morphemes && morphemes.length > 0) {
        await apiService.fetchJSON(`/words/${id}/morphemes`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            morphemes: morphemes.map(m => ({
              morphemeId: m.id,
              position: m.position
            }))
          })
        });
      }

      return updatedWord;
    } catch (error) {
      console.error(`Error updating word ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get morphemes for a word
   * @param wordId Word ID
   * @returns Promise with array of morphemes
   */
  public async getWordMorphemes(wordId: string): Promise<Array<{
    id: number;
    text: string;
    type: string;
    meaning: string;
  }>> {
    try {
      console.log('Fetching morphemes for word:', wordId);
      const response = await apiService.fetchJSON<Array<{
        id: number;
        value: string;
        type: string;
        meaning: string;
      }>>(`/words/${wordId}/morphemes`);
      console.log('Raw morpheme response:', response);
      
      const mappedMorphemes = response.map(m => ({
        id: m.id,
        text: m.value,
        type: m.type,
        meaning: m.meaning
      }));
      console.log('Mapped morphemes:', mappedMorphemes);
      
      return mappedMorphemes;
    } catch (error) {
      console.error(`Error fetching morphemes for word ${wordId}:`, error);
      console.error('Full error:', error);
      return [];
    }
  }

  /**
   * Delete a word
   * @param id Word ID
   * @returns Promise that resolves when deletion is complete
   */
  public async deleteWord(id: string): Promise<void> {
    try {
      await apiService.fetchJSON(`/words/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error(`Error deleting word ${id}:`, error);
      throw error;
    }
  }

  /**
   * @deprecated Use createWord instead
   */
  public async addWord(word: Omit<Word, 'id'>): Promise<Word> {
    console.warn('addWord is deprecated. Please use createWord instead.');
    return this.createWord({ ...word, morphemes: [] });
  }
}

// Export a singleton instance
const wordService = new WordService();
export default wordService;
