import { Morpheme, WordMorpheme, WordFamily, MorphemeType } from '../../models/Morpheme';
import apiService from '../api';

export interface MorphemeCreate {
  value: string;
  type: MorphemeType;
  meaning: string;
  languageOrigin: string;
  examples: string[];
}

/**
 * Service to handle morpheme-related operations
 */
class MorphemeService {
  /**
   * Get all morphemes
   * @returns Promise with array of all morphemes
   */
  public async getAllMorphemes(): Promise<Morpheme[]> {
    try {
      const morphemes = await apiService.fetchJSON<Morpheme[]>('/morphemes');
      return morphemes;
    } catch (error) {
      console.error('Error fetching morphemes:', error);
      return [];
    }
  }

  /**
   * Get morphemes by type
   * @param type The type of morphemes to fetch
   * @returns Promise with array of morphemes of the specified type
   */
  public async getMorphemesByType(type: MorphemeType): Promise<Morpheme[]> {
    try {
      const morphemes = await apiService.fetchJSON<Morpheme[]>(`/morphemes/type/${type}`);
      return morphemes;
    } catch (error) {
      console.error(`Error fetching morphemes of type ${type}:`, error);
      return [];
    }
  }

  /**
   * Get morphemes for a specific word
   * @param wordId The ID of the word
   * @returns Promise with array of morphemes and their positions
   */
  public async getMorphemesForWord(wordId: string): Promise<WordMorpheme[]> {
    try {
      const morphemes = await apiService.fetchJSON<WordMorpheme[]>(`/morphemes/word/${wordId}`);
      return morphemes;
    } catch (error) {
      console.error(`Error fetching morphemes for word ${wordId}:`, error);
      return [];
    }
  }

  /**
   * Search morphemes by value or meaning
   * @param query The search query
   * @returns Promise with array of matching morphemes
   */
  public async searchMorphemes(query: string): Promise<Morpheme[]> {
    try {
      const morphemes = await apiService.fetchJSON<Morpheme[]>(`/morphemes/search?q=${encodeURIComponent(query)}`);
      return morphemes;
    } catch (error) {
      console.error(`Error searching morphemes with query "${query}":`, error);
      return [];
    }
  }

  /**
   * Add morphemes to a word
   * @param wordId The ID of the word
   * @param morphemes Array of morpheme IDs and positions
   * @returns Promise indicating success
   */
  public async addMorphemesToWord(
    wordId: string,
    morphemes: { morphemeId: string; position: number }[]
  ): Promise<void> {
    try {
      await apiService.fetchJSON(`/morphemes/word/${wordId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ morphemes })
      });
    } catch (error) {
      console.error(`Error adding morphemes to word ${wordId}:`, error);
      throw error;
    }
  }

  /**
   * Get word families for a word
   * @param wordId The ID of the word
   * @returns Promise with array of related words and their relationship types
   */
  public async getWordFamilies(wordId: string): Promise<WordFamily[]> {
    try {
      const families = await apiService.fetchJSON<WordFamily[]>(`/morphemes/word/${wordId}/family`);
      return families;
    } catch (error) {
      console.error(`Error fetching word families for word ${wordId}:`, error);
      return [];
    }
  }

  /**
   * Add a word family relationship
   * @param baseWordId The ID of the base word
   * @param relatedWordId The ID of the related word
   * @param relationshipType The type of relationship
   * @returns Promise indicating success
   */
  public async addWordFamilyRelationship(
    baseWordId: string,
    relatedWordId: string,
    relationshipType: string
  ): Promise<void> {
    try {
      await apiService.fetchJSON(`/morphemes/word/${baseWordId}/family`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ relatedWordId, relationshipType })
      });
    } catch (error) {
      console.error('Error adding word family relationship:', error);
      throw error;
    }
  }
  /**
   * Create a new morpheme
   * @param data The morpheme data
   * @returns Promise with the created morpheme
   */
  public async createMorpheme(data: MorphemeCreate): Promise<Morpheme> {
    try {
      const morpheme = await apiService.fetchJSON<Morpheme>('/morphemes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return morpheme;
    } catch (error) {
      console.error('Error creating morpheme:', error);
      throw error;
    }
  }
}

// Export a singleton instance
const morphemeService = new MorphemeService();
export default morphemeService;