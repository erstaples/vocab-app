import { create } from 'zustand';
import { api } from '../api/client';
import type {
  DashboardStats,
  UnlinkedWord,
  PaginatedResponse,
  MorphemeBreakdown,
  WordSuggestion,
  DefinitionData,
  WordFamilyData,
  AIPreview,
  AIGenerationLog,
  Morpheme,
  PartOfSpeech,
} from '@vocab-builder/shared';

export interface WordPopulateData {
  word: string;
  partOfSpeech: PartOfSpeech;
  pronunciation: string;
  definition: string;
  exampleSentence: string;
  etymology: string;
  difficulty: number;
}

interface AdminState {
  // Dashboard
  stats: DashboardStats | null;
  unlinkedWords: UnlinkedWord[];
  totalUnlinkedWords: number;
  unlinkedWordsPage: number;
  isLoadingStats: boolean;
  isLoadingUnlinkedWords: boolean;

  // AI Config
  aiConfigured: boolean;
  aiProvider: 'anthropic' | 'openai' | null;
  isConfiguringAI: boolean;

  // AI Operations
  currentPreview: AIPreview | null;
  isGenerating: boolean;
  aiError: string | null;

  // AI History
  aiHistory: (AIGenerationLog & { username?: string })[];
  totalAiHistory: number;
  aiHistoryPage: number;
  isLoadingHistory: boolean;

  // Error state
  error: string | null;

  // Dashboard Actions
  fetchStats: () => Promise<void>;
  fetchUnlinkedWords: (page?: number, search?: string) => Promise<void>;

  // Word-Morpheme Actions
  updateWordMorphemes: (wordId: number, morphemeIds: number[]) => Promise<void>;
  getWordMorphemes: (wordId: number) => Promise<{ id: number; morpheme: string; type: string; meaning: string; position: number }[]>;

  // AI Actions
  checkAIConfig: () => Promise<void>;
  configureAI: (provider: 'anthropic' | 'openai', apiKey: string) => Promise<void>;
  clearAIConfig: () => Promise<void>;
  analyzeWord: (word: string) => Promise<MorphemeBreakdown>;
  populateWord: (word: string) => Promise<WordPopulateData>;
  suggestWords: (morphemeId: number, limit?: number) => Promise<{ morpheme: Morpheme; suggestions: WordSuggestion[] }>;
  generateDefinition: (word: string, partOfSpeech: string) => Promise<DefinitionData>;
  generateWordFamily: (root: string, meaning: string) => Promise<WordFamilyData>;
  applyPreview: (type: string, data: Record<string, unknown>) => Promise<{ morphemesCreated: number; wordsCreated: number; associationsCreated: number }>;
  setPreview: (preview: AIPreview | null) => void;
  fetchAIHistory: (page?: number) => Promise<void>;

  // Utility
  clearError: () => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  // Initial state
  stats: null,
  unlinkedWords: [],
  totalUnlinkedWords: 0,
  unlinkedWordsPage: 1,
  isLoadingStats: false,
  isLoadingUnlinkedWords: false,
  aiConfigured: false,
  aiProvider: null,
  isConfiguringAI: false,
  currentPreview: null,
  isGenerating: false,
  aiError: null,
  aiHistory: [],
  totalAiHistory: 0,
  aiHistoryPage: 1,
  isLoadingHistory: false,
  error: null,

  // Dashboard Actions
  fetchStats: async () => {
    set({ isLoadingStats: true, error: null });
    try {
      const response = await api.get<DashboardStats>('/admin/stats');
      set({ stats: response.data, isLoadingStats: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch stats',
        isLoadingStats: false,
      });
    }
  },

  fetchUnlinkedWords: async (page = 1, search?: string) => {
    set({ isLoadingUnlinkedWords: true, error: null });
    try {
      const params = new URLSearchParams({ page: page.toString(), pageSize: '20' });
      if (search) params.append('search', search);

      const response = await api.get<PaginatedResponse<UnlinkedWord>>(
        `/admin/unlinked-words?${params}`
      );
      set({
        unlinkedWords: response.data.items,
        totalUnlinkedWords: response.data.total,
        unlinkedWordsPage: page,
        isLoadingUnlinkedWords: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch unlinked words',
        isLoadingUnlinkedWords: false,
      });
    }
  },

  // Word-Morpheme Actions
  updateWordMorphemes: async (wordId: number, morphemeIds: number[]) => {
    try {
      await api.post('/admin/word-morphemes', { wordId, morphemeIds });
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to update word morphemes');
    }
  },

  getWordMorphemes: async (wordId: number) => {
    const response = await api.get<{
      wordId: number;
      morphemes: { id: number; morpheme: string; type: string; meaning: string; position: number }[];
    }>(`/admin/word-morphemes/${wordId}`);
    return response.data.morphemes;
  },

  // AI Actions
  checkAIConfig: async () => {
    try {
      const response = await api.get<{ configured: boolean; provider: string | null }>(
        '/admin/ai/config'
      );
      set({
        aiConfigured: response.data.configured,
        aiProvider: response.data.provider as 'anthropic' | 'openai' | null,
      });
    } catch (error) {
      set({ aiConfigured: false, aiProvider: null });
    }
  },

  configureAI: async (provider: 'anthropic' | 'openai', apiKey: string) => {
    set({ isConfiguringAI: true, aiError: null });
    try {
      await api.post('/admin/ai/config', { provider, apiKey });
      set({
        aiConfigured: true,
        aiProvider: provider,
        isConfiguringAI: false,
      });
    } catch (error) {
      set({
        aiError: error instanceof Error ? error.message : 'Failed to configure AI',
        isConfiguringAI: false,
      });
      throw error;
    }
  },

  clearAIConfig: async () => {
    try {
      await api.delete('/admin/ai/config');
      set({ aiConfigured: false, aiProvider: null });
    } catch (error) {
      console.error('Failed to clear AI config:', error);
    }
  },

  analyzeWord: async (word: string) => {
    set({ isGenerating: true, aiError: null });
    try {
      const response = await api.post<MorphemeBreakdown>('/admin/ai/analyze-word', { word });
      const breakdown = response.data;
      set({
        currentPreview: {
          type: 'morpheme-breakdown',
          data: breakdown,
          originalInput: { word },
        },
        isGenerating: false,
      });
      return breakdown;
    } catch (error) {
      set({
        aiError: error instanceof Error ? error.message : 'Failed to analyze word',
        isGenerating: false,
      });
      throw error;
    }
  },

  populateWord: async (word: string) => {
    set({ isGenerating: true, aiError: null });
    try {
      const response = await api.post<WordPopulateData>('/admin/ai/populate-word', { word });
      set({ isGenerating: false });
      return response.data;
    } catch (error) {
      set({
        aiError: error instanceof Error ? error.message : 'Failed to populate word data',
        isGenerating: false,
      });
      throw error;
    }
  },

  suggestWords: async (morphemeId: number, limit = 10) => {
    set({ isGenerating: true, aiError: null });
    try {
      const response = await api.post<{ morpheme: Morpheme; suggestions: WordSuggestion[] }>(
        '/admin/ai/suggest-words',
        { morphemeId, limit }
      );
      set({
        currentPreview: {
          type: 'word-suggestions',
          data: response.data.suggestions,
          originalInput: { morphemeId, limit },
        },
        isGenerating: false,
      });
      return response.data;
    } catch (error) {
      set({
        aiError: error instanceof Error ? error.message : 'Failed to suggest words',
        isGenerating: false,
      });
      throw error;
    }
  },

  generateDefinition: async (word: string, partOfSpeech: string) => {
    set({ isGenerating: true, aiError: null });
    try {
      const response = await api.post<DefinitionData>('/admin/ai/generate-definition', {
        word,
        partOfSpeech,
      });
      set({
        currentPreview: {
          type: 'definition',
          data: response.data,
          originalInput: { word, partOfSpeech },
        },
        isGenerating: false,
      });
      return response.data;
    } catch (error) {
      set({
        aiError: error instanceof Error ? error.message : 'Failed to generate definition',
        isGenerating: false,
      });
      throw error;
    }
  },

  generateWordFamily: async (root: string, meaning: string) => {
    set({ isGenerating: true, aiError: null });
    try {
      const response = await api.post<WordFamilyData>('/admin/ai/bulk-family', { root, meaning });
      set({
        currentPreview: {
          type: 'word-family',
          data: response.data,
          originalInput: { root, meaning },
        },
        isGenerating: false,
      });
      return response.data;
    } catch (error) {
      set({
        aiError: error instanceof Error ? error.message : 'Failed to generate word family',
        isGenerating: false,
      });
      throw error;
    }
  },

  applyPreview: async (type: string, data: Record<string, unknown>) => {
    set({ isGenerating: true, aiError: null });
    try {
      const response = await api.post<{
        success: boolean;
        results: { morphemesCreated: number; wordsCreated: number; associationsCreated: number };
      }>('/admin/ai/apply', { type, data });
      set({ currentPreview: null, isGenerating: false });
      return response.data.results;
    } catch (error) {
      set({
        aiError: error instanceof Error ? error.message : 'Failed to apply changes',
        isGenerating: false,
      });
      throw error;
    }
  },

  setPreview: (preview: AIPreview | null) => {
    set({ currentPreview: preview });
  },

  fetchAIHistory: async (page = 1) => {
    set({ isLoadingHistory: true });
    try {
      const response = await api.get<PaginatedResponse<AIGenerationLog & { username?: string }>>(
        `/admin/ai/history?page=${page}&pageSize=20`
      );
      set({
        aiHistory: response.data.items,
        totalAiHistory: response.data.total,
        aiHistoryPage: page,
        isLoadingHistory: false,
      });
    } catch (error) {
      set({ isLoadingHistory: false });
      console.error('Failed to fetch AI history:', error);
    }
  },

  clearError: () => set({ error: null, aiError: null }),
}));
