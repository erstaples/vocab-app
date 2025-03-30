// src/pages/Review.tsx
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { Word, UserWordProgress, LearningMode } from '../models';
import { getLearningModeComponent } from '../components/learning-modes';

const Review: React.FC = () => {
  const { words, dueCount, recordReview, user } = useContext(AppContext);
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState<{ progress: UserWordProgress; word: Word } | null>(null);
  const [selectedMode, setSelectedMode] = useState<LearningMode>(LearningMode.FLASHCARD);
  const [reviewComplete, setReviewComplete] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    wordsReviewed: 0,
    averageScore: 0,
    totalScore: 0,
    startTime: Date.now(),
  });

  // Initialize review session
  useEffect(() => {
    if (words.length > 0 && currentIndex < words.length) {
      setCurrentWord(words[currentIndex]);

      // Select a learning mode based on user preferences
      if (user && user.preferences.learningModes.length > 0) {
        const randomMode = user.preferences.learningModes[
          Math.floor(Math.random() * user.preferences.learningModes.length)
        ];
        setSelectedMode(randomMode);
      }
    } else if (words.length === 0) {
      setReviewComplete(true);
    }
  }, [words, currentIndex, user]);

  // Handle completion of a word review
  const handleReviewComplete = (score: 0 | 1 | 2 | 3 | 4 | 5, timeSpent: number) => {
    if (!currentWord) return;

    // Record this review
    recordReview(currentWord.word.id, score, timeSpent, selectedMode);

    // Update session stats
    const newWordsReviewed = sessionStats.wordsReviewed + 1;
    const newTotalScore = sessionStats.totalScore + score;
    setSessionStats({
      ...sessionStats,
      wordsReviewed: newWordsReviewed,
      totalScore: newTotalScore,
      averageScore: newTotalScore / newWordsReviewed,
    });

    // Move to the next word
    if (currentIndex + 1 < words.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setReviewComplete(true);
    }
  };

  // Handle returning to dashboard
  const handleReturnToDashboard = () => {
    navigate('/dashboard');
  };

  // Render the review completion screen
  const renderCompletionScreen = () => {
    const sessionDuration = Math.round((Date.now() - sessionStats.startTime) / 1000 / 60);

    return (
      <div className="review-complete">
        <h2>Review Session Complete!</h2>

        <div className="session-stats">
          <div className="stat">
            <span className="stat-value">{sessionStats.wordsReviewed}</span>
            <span className="stat-label">Words Reviewed</span>
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

        <button className="primary-button" onClick={handleReturnToDashboard}>
          Return to Dashboard
        </button>
      </div>
    );
  };

  // If no words are due, display a message
  if (dueCount === 0) {
    return (
      <div className="review-page">
        <div className="no-reviews">
          <h2>No words due for review</h2>
          <p>Great job! You've reviewed all your due words.</p>
          <button className="primary-button" onClick={handleReturnToDashboard}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // If review is complete, show completion screen
  if (reviewComplete) {
    return (
      <div className="review-page">
        {renderCompletionScreen()}
      </div>
    );
  }

  // If current word is not set, show loading
  if (!currentWord) {
    return <div className="loading">Loading review...</div>;
  }

  // Determine progress through the review session
  const progress = ((currentIndex + 1) / words.length) * 100;

  return (
    <div className="review-page">
      <header className="review-header">
        <h1>Review Session</h1>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }} />
        </div>
        <div className="progress-text">
          {currentIndex + 1} of {words.length}
        </div>
      </header>

      <div className="review-content">
        {/* Render the appropriate learning mode component */}
        {getLearningModeComponent(selectedMode, currentWord.word, handleReviewComplete)}
      </div>
    </div>
  );
};

export default Review;