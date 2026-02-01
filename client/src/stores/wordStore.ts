import { create } from 'zustand';
import type { WordWithDetails, Morpheme, PaginatedResponse } from '@vocab-builder/shared';
import { api } from '../api/client';

interface WordState {
  words: WordWithDetails[];
  morphemes: Morpheme[];
  selectedWord: WordWithDetails | null;
  isLoading: boolean;
  error: string | null;
  totalWords: number;
  currentPage: number;
  pageSize: number;

  // Actions
  fetchWords: (page?: number, filters?: WordFilters) => Promise<void>;
  fetchWord: (id: number) => Promise<void>;
  fetchMorphemes: () => Promise<void>;
  createWord: (word: CreateWordInput) => Promise<WordWithDetails>;
  updateWord: (id: number, word: UpdateWordInput) => Promise<void>;
  deleteWord: (id: number) => Promise<void>;
  createMorpheme: (morpheme: CreateMorphemeInput) => Promise<Morpheme>;
  updateMorpheme: (id: number, morpheme: UpdateMorphemeInput) => Promise<void>;
  deleteMorpheme: (id: number) => Promise<void>;
  clearError: () => void;
}

interface WordFilters {
  search?: string;
  partOfSpeech?: string;
  difficulty?: number;
}

interface CreateWordInput {
  word: string;
  partOfSpeech: string;
  pronunciation?: string;
  etymology?: string;
  difficulty: number;
  definitions: { definition: string; exampleSentence?: string; isPrimary: boolean }[];
  morphemeIds?: number[];
}

interface UpdateWordInput extends Partial<CreateWordInput> {}

interface CreateMorphemeInput {
  morpheme: string;
  type: 'prefix' | 'root' | 'suffix';
  meaning: string;
  origin?: string;
}

interface UpdateMorphemeInput extends Partial<CreateMorphemeInput> {}

export const useWordStore = create<WordState>((set, get) => ({
  words: [],
  morphemes: [],
  selectedWord: null,
  isLoading: false,
  error: null,
  totalWords: 0,
  currentPage: 1,
  pageSize: 20,

  fetchWords: async (page = 1, filters?: WordFilters) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: get().pageSize.toString(),
      });
      if (filters?.search) params.append('search', filters.search);
      if (filters?.partOfSpeech) params.append('partOfSpeech', filters.partOfSpeech);
      if (filters?.difficulty) params.append('difficulty', filters.difficulty.toString());

      const response = await api.get<PaginatedResponse<WordWithDetails>>(`/words?${params}`);
      set({
        words: response.data.items,
        totalWords: response.data.total,
        currentPage: page,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch words',
        isLoading: false,
      });
    }
  },

  fetchWord: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<WordWithDetails>(`/words/${id}`);
      set({ selectedWord: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch word',
        isLoading: false,
      });
    }
  },

  fetchMorphemes: async () => {
    try {
      const response = await api.get<Morpheme[]>('/morphemes');
      set({ morphemes: response.data });
    } catch (error) {
      console.error('Failed to fetch morphemes:', error);
    }
  },

  createWord: async (word: CreateWordInput) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<WordWithDetails>('/words', word);
      const newWord = response.data;
      set(state => ({
        words: [newWord, ...state.words],
        isLoading: false,
      }));
      return newWord;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create word',
        isLoading: false,
      });
      throw error;
    }
  },

  updateWord: async (id: number, word: UpdateWordInput) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put<WordWithDetails>(`/words/${id}`, word);
      const updatedWord = response.data;
      set(state => ({
        words: state.words.map(w => (w.id === id ? updatedWord : w)),
        selectedWord: state.selectedWord?.id === id ? updatedWord : state.selectedWord,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update word',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteWord: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/words/${id}`);
      set(state => ({
        words: state.words.filter(w => w.id !== id),
        selectedWord: state.selectedWord?.id === id ? null : state.selectedWord,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete word',
        isLoading: false,
      });
      throw error;
    }
  },

  createMorpheme: async (morpheme: CreateMorphemeInput) => {
    try {
      const response = await api.post<Morpheme>('/morphemes', morpheme);
      const newMorpheme = response.data;
      set(state => ({
        morphemes: [...state.morphemes, newMorpheme],
      }));
      return newMorpheme;
    } catch (error) {
      throw error;
    }
  },

  updateMorpheme: async (id: number, morpheme: UpdateMorphemeInput) => {
    try {
      const response = await api.put<Morpheme>(`/morphemes/${id}`, morpheme);
      const updatedMorpheme = response.data;
      set(state => ({
        morphemes: state.morphemes.map(m => (m.id === id ? updatedMorpheme : m)),
      }));
    } catch (error) {
      throw error;
    }
  },

  deleteMorpheme: async (id: number) => {
    try {
      await api.delete(`/morphemes/${id}`);
      set(state => ({
        morphemes: state.morphemes.filter(m => m.id !== id),
      }));
    } catch (error) {
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
