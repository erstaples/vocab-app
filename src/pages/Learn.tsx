// src/pages/Learn.tsx
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { Word, LearningMode } from '../models';
import { UserProgressService } from '../services/user-progress-service';
import { getLearningModeComponent } from '../components/learning-modes';

// Create an instance of the service
const userProgressService = new UserProgressService();

const Learn: React.FC = () => {
  const { user, recordReview } = useContext(AppContext);
  const navigate = useNavigate();

  const [newWords, setNewWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [learningComplete, setLearningComplete] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    wordsLearned: 0,
    averageScore: 0,
    totalScore: 0,
    startTime: Date.now(),
  });

  // Initialize learning session
  useEffect(() => {
    // Get the number of new words per day from user preferences
    const wordsPerDay = user?.preferences.newWordsPerDay || 5;

    // Fetch new words
    const words = userProgressService.getNewWords(wordsPerDay);
    setNewWords(words);

    if (words.length > 0) {
      setCurrentWord(words[0]);
    } else {
      setLearningComplete(true);
    }
  }, [user]);

  // Update current word when index changes
  useEffect(() => {
    if (newWords.length > 0 && currentIndex < newWords.length) {
      setCurrentWord(newWords[currentIndex]);
    } else if (newWords.length > 0) {
      setLearningComplete(true);
    }
  }, [currentIndex, newWords]);

  // Handle completion of a word learning
  const handleLearningComplete = (score: 0 | 1 | 2 | 3 | 4 | 5, timeSpent: number) => {
    if (!currentWord) return;

    // Record this learning activity
    recordReview(
      currentWord.id,
      score,
      timeSpent,
      LearningMode.FLASHCARD // Initial learning starts with flashcards
    );

    // Update session stats
    const newWordsLearned = sessionStats.wordsLearned + 1;
    const newTotalScore = sessionStats.totalScore + score;
    setSessionStats({
      ...sessionStats,
      wordsLearned: newWordsLearned,
      totalScore: newTotalScore,
      averageScore: newTotalScore / newWordsLearned,
    });

    // Move to the next word
    if (currentIndex + 1 < newWords.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setLearningComplete(true);
    }
  };

  // Handle returning to dashboard
  const handleReturnToDashboard = () => {
    navigate('/dashboard');
  };

  // Render the learning completion screen
  const renderCompletionScreen = () => {
    const sessionDuration = Math.round((Date.now() - sessionStats.startTime) / 1000 / 60);

    return (
      <div className="learning-complete">
        <h2>Learning Session Complete!</h2>

        <div className="session-stats">
          <div className="stat">
            <span className="stat-value">{sessionStats.wordsLearned}</span>
            <span className="stat-label">Words Learned</span>
          </div>
          <div className="stat">
            <span className="stat-value">{sessionStats.averageScore.toFixed(1)}</span>
            <span className="stat-label">Average Score</span>
          </div>
          <div className="stat">
            <span className="stat-value">{sessionDuration}</span>
            <span className="stat-label">Minutes</span>
          </div>
        </div>

        <div className="completion-message">
          <p>
            Great job! You've learned {sessionStats.wordsLearned} new words today.
            These words will appear in your review sessions based on the spaced repetition algorithm.
          </p>
        </div>

        <button className="primary-button" onClick={handleReturnToDashboard}>
          Return to Dashboard
        </button>
      </div>
    );
  };

  // If learning is complete, show completion screen
  if (learningComplete) {
    return (
      <div className="learn-page">
        {renderCompletionScreen()}
      </div>
    );
  }

  // If current word is not set, show loading
  if (!currentWord) {
    return <div className="loading">Loading new words...</div>;
  }

  // Determine progress through the learning session
  const progress = ((currentIndex + 1) / newWords.length) * 100;

  return (
    <div className="learn-page">
      <header className="learn-header">
        <h1>Learn New Words</h1>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }} />
        </div>
        <div className="progress-text">
          {currentIndex + 1} of {newWords.length}
        </div>
      </header>

      <div className="learn-intro">
        <p className="intro-text">
          You're about to learn a new word. Take your time to understand its meaning,
          pronunciation, and how to use it in a sentence.
        </p>
      </div>

      <div className="learn-content">
        {/* For initial learning, we use the flashcard mode */}
        {getLearningModeComponent(
          LearningMode.FLASHCARD,
          currentWord,
          handleLearningComplete
        )}
      </div>
    </div>
  );
};

export default Learn;
