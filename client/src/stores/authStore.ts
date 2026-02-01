import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserStats, UserPreferences, AuthResponse } from '@vocab-builder/shared';
import { api } from '../api/client';

interface AuthState {
  user: Omit<User, 'passwordHash'> | null;
  token: string | null;
  stats: UserStats | null;
  preferences: UserPreferences | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchPreferences: () => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      stats: null,
      preferences: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<AuthResponse>('/auth/login', { email, password });
          const { user, token } = response.data;
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          // Fetch stats and preferences after login
          get().fetchStats();
          get().fetchPreferences();
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (email: string, username: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<AuthResponse>('/auth/register', { email, username, password });
          const { user, token } = response.data;
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          stats: null,
          preferences: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      fetchCurrentUser: async () => {
        const { token } = get();
        if (!token) {
          set({ isLoading: false });
          return;
        }

        set({ isLoading: true });
        try {
          const response = await api.get<Omit<User, 'passwordHash'>>('/auth/me');
          set({
            user: response.data,
            isAuthenticated: true,
            isLoading: false,
          });
          // Fetch stats and preferences
          get().fetchStats();
          get().fetchPreferences();
        } catch {
          // Token invalid, clear auth state
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      fetchStats: async () => {
        try {
          const response = await api.get<UserStats>('/users/stats');
          set({ stats: response.data });
        } catch (error) {
          console.error('Failed to fetch stats:', error);
        }
      },

      fetchPreferences: async () => {
        try {
          const response = await api.get<UserPreferences>('/users/preferences');
          set({ preferences: response.data });
        } catch (error) {
          console.error('Failed to fetch preferences:', error);
        }
      },

      updatePreferences: async (preferences: Partial<UserPreferences>) => {
        try {
          const response = await api.put<UserPreferences>('/users/preferences', preferences);
          set({ preferences: response.data });
        } catch (error) {
          console.error('Failed to update preferences:', error);
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'vocab-builder-auth',
      partialize: state => ({ token: state.token }),
    }
  )
);
