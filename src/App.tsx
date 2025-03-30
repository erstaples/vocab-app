// src/App.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { User, Word, UserWordProgress, LearningMode } from './models';
import { UserProgressService } from './services/user-progress-service';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import Review from './pages/Review';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// Create an instance of the service
const userProgressService = new UserProgressService();

// AppContext for global state
export const AppContext = React.createContext<{
  user: User | null;
  words: { progress: UserWordProgress; word: Word }[];
  dueCount: number;
  isLoading: boolean;
  updateUser: (userData: Partial<User>) => void;
  updatePreferences: (preferences: Partial<User['preferences']>) => void;
  recordReview: (
    wordId: string,
    score: 0 | 1 | 2 | 3 | 4 | 5,
    timeSpent: number,
    learningMode: LearningMode
  ) => void;
  refreshWords: () => void;
}>({
  user: null,
  words: [],
  dueCount: 0,
  isLoading: true,
  updateUser: () => { },
  updatePreferences: () => { },
  recordReview: () => { },
  refreshWords: () => { }
});

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [words, setWords] = useState<{ progress: UserWordProgress; word: Word }[]>([]);
  const [dueCount, setDueCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize app data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Load user data
        const currentUser = userProgressService.getCurrentUser();
        setUser(currentUser);

        // Load due words
        const dueWords = userProgressService.getDueWords();
        setWords(dueWords);
        setDueCount(dueWords.length);

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading app data:', error);
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Update user
  const updateUser = (userData: Partial<User>) => {
    const updatedUser = userProgressService.updateUser(userData);
    setUser(updatedUser);
  };

  // Update user preferences
  const updatePreferences = (preferences: Partial<User['preferences']>) => {
    const updatedUser = userProgressService.updatePreferences(preferences);
    setUser(updatedUser);
  };

  // Record a word review
  const recordReview = (
    wordId: string,
    score: 0 | 1 | 2 | 3 | 4 | 5,
    timeSpent: number,
    learningMode: LearningMode
  ) => {
    const updatedUser = userProgressService.recordReview(
      wordId,
      score,
      timeSpent,
      learningMode
    );
    setUser(updatedUser);
    refreshWords();
  };

  // Refresh the words list
  const refreshWords = useCallback(() => {
    const dueWords = userProgressService.getDueWords();
    setWords(dueWords);
    setDueCount(dueWords.length);
  }, []);

  // App context value
  const contextValue = {
    user,
    words,
    dueCount,
    isLoading,
    updateUser,
    updatePreferences,
    recordReview,
    refreshWords
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <AppContext.Provider value={contextValue}>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/review" element={<Review />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AppContext.Provider>
  );
};

export default App;
