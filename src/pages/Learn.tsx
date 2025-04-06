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
  const { user, recordReview, updateUser } = useContext(AppContext);
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
    const fetchData = async () => {
      try {
        // If the user is not loaded or has been lost after navigation, reload it
        if (!user) {
          const currentUser = await userProgressService.getCurrentUser();
          console.log("Learn: Reloaded user:", currentUser);
          updateUser(currentUser); // Update the AppContext with the reloaded user
        }

        // Get the number of new words per day from user preferences
        // Add a safety check for when preferences might be undefined
        const wordsPerDay = user?.preferences?.newWordsPerDay || 5;

        // Fetch new words
        const words = await userProgressService.getNewWords(wordsPerDay);
        console.log('Learn: Fetched new words:', words);
        setNewWords(words);

        if (words.length > 0) {
          console.log('Learn: Setting current word:', words[0]);
          setCurrentWord(words[0]);
        } else {
          console.log('Learn: No words available, showing completion screen');
          setLearningComplete(true);
        }
      } catch (error) {
        console.error('Error loading learning data:', error);
      }
    };

    fetchData();
  }, [user, updateUser]);

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
      LearningMode.WORD_CONSTRUCTION // Use Word Construction Lab for learning
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

    // If no words were learned, show a different message
    if (sessionStats.wordsLearned === 0) {
      return (
        <div className="learning-complete">
          <h2>No New Words Available</h2>

          <div className="no-words-message">
            <p>
              There are no new words available at your current level. This could be because:
            </p>
            <ul>
              <li>You've already learned all available words at your current difficulty level</li>
              <li>You need to level up to access more difficult words</li>
            </ul>
            <p>
              You can continue reviewing words you've already learned, or reset your progress
              in the Settings page to start fresh.
            </p>
          </div>

          <div className="completion-actions">
            <button className="primary-button" onClick={handleReturnToDashboard}>
              Return to Dashboard
            </button>
            <button className="secondary-button" onClick={() => navigate('/settings')}>
              Go to Settings
            </button>
          </div>
        </div>
      );
    }

    // Normal completion screen when words were learned
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
        {/* Use Word Construction Lab for learning */}
        {getLearningModeComponent(
          LearningMode.WORD_CONSTRUCTION,
          currentWord,
          handleLearningComplete
        )}
      </div>
    </div>
  );
};

export default Learn;
