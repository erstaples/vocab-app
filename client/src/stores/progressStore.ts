import { create } from 'zustand';
import type {
  WordWithDetails,
  UserWordProgress,
  ReviewRequest,
  ReviewResponse,
  Badge,
  DueWordsResponse,
  LearnWordsResponse,
} from '@vocab-builder/shared';
import { api } from '../api/client';

interface ProgressState {
  dueWords: WordWithDetails[];
  newWords: WordWithDetails[];
  currentProgress: Map<number, UserWordProgress>;
  recentBadges: Badge[];
  totalDue: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchDueWords: () => Promise<void>;
  fetchNewWords: (count?: number) => Promise<void>;
  learnWord: (wordId: number) => Promise<void>;
  submitReview: (review: ReviewRequest) => Promise<ReviewResponse>;
  clearRecentBadges: () => void;
  clearError: () => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
  dueWords: [],
  newWords: [],
  currentProgress: new Map(),
  recentBadges: [],
  totalDue: 0,
  isLoading: false,
  error: null,

  fetchDueWords: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<DueWordsResponse>('/progress/due');
      set({
        dueWords: response.data.words,
        totalDue: response.data.totalDue,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch due words',
        isLoading: false,
      });
    }
  },

  fetchNewWords: async (count = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<LearnWordsResponse>(`/progress/new?count=${count}`);
      set({
        newWords: response.data.words,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch new words',
        isLoading: false,
      });
    }
  },

  learnWord: async (wordId: number) => {
    try {
      const response = await api.post<UserWordProgress>('/progress/learn', { wordId });
      const progress = response.data;
      set(state => {
        const newProgress = new Map(state.currentProgress);
        newProgress.set(wordId, progress);
        return {
          currentProgress: newProgress,
          newWords: state.newWords.filter(w => w.id !== wordId),
        };
      });
    } catch (error) {
      console.error('Failed to mark word as learned:', error);
      throw error;
    }
  },

  submitReview: async (review: ReviewRequest) => {
    try {
      const response = await api.post<ReviewResponse>('/progress/review', review);
      const result = response.data;

      set(state => {
        const newProgress = new Map(state.currentProgress);
        newProgress.set(review.wordId, result.progress);

        const newBadges = result.newBadges || [];

        return {
          currentProgress: newProgress,
          dueWords: state.dueWords.filter(w => w.id !== review.wordId),
          totalDue: Math.max(0, state.totalDue - 1),
          recentBadges: [...state.recentBadges, ...newBadges],
        };
      });

      return result;
    } catch (error) {
      console.error('Failed to submit review:', error);
      throw error;
    }
  },

  clearRecentBadges: () => set({ recentBadges: [] }),

  clearError: () => set({ error: null }),
}));
