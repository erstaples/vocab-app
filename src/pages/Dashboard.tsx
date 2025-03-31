// src/pages/Dashboard.tsx
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { UserStats, Word } from '../models';
import { UserProgressService } from '../services/user-progress-service';
import wordService from '../services/word-service';
import LevelProgress from '../components/gamification/LevelProgress';
import Streak from '../components/gamification/Streak';
import WordCard from '../components/common/WordCard';

// Create an instance of the service
const userProgressService = new UserProgressService();

const Dashboard: React.FC = () => {
  const { user, dueCount, refreshWords } = useContext(AppContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentWords, setRecentWords] = useState<{ progress: any; word: Word }[]>([]);
  const [wordOfTheDay, setWordOfTheDay] = useState<Word | null>(null);

  // Effect for loading user stats and recent words
  useEffect(() => {
    const loadData = async () => {
      // Load user stats
      const userStats = await userProgressService.getUserStats();
      setStats(userStats);

      // Load recent words
      const recent = await userProgressService.getRecentlyReviewedWords(5);
      setRecentWords(recent);

      // Refresh due words count
      refreshWords();
    };
    
    loadData();
  }, [refreshWords]);

  // Separate effect for word of the day that only runs once
  useEffect(() => {
    // Set word of the day
    const newWords = wordService.getNewWords(1);
    if (newWords.length > 0) {
      setWordOfTheDay(newWords[0]);
    }
  }, []);

  // Handle starting a review session
  const handleStartReview = () => {
    navigate('/review');
  };

  // Handle starting a learning session
  const handleStartLearning = () => {
    navigate('/learn');
  };

  if (!user || !stats) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome, {user.username}!</h1>
        <div className="user-progress">
          <LevelProgress level={stats.level} currentXP={stats.totalExperience} nextLevelXP={stats.experienceToNextLevel} />
          <Streak count={stats.currentStreak} />
        </div>
      </header>

      <div className="dashboard-content">
        <section className="review-section">
          <h2>Reviews</h2>
          <div className="review-count">
            <span className="count">{dueCount}</span>
            <span className="label">words due for review</span>
          </div>
          {dueCount > 0 ? (
            <button className="primary-button" onClick={handleStartReview}>
              Start Review Session
            </button>
          ) : (
            <div className="completed-message">All caught up! Check back later.</div>
          )}
        </section>

        <section className="learning-section">
          <h2>Learn New Words</h2>
          <p>You've set a goal of {user.preferences.newWordsPerDay} new words per day.</p>
          <button className="secondary-button" onClick={handleStartLearning}>
            Learn New Words
          </button>
        </section>

        <section className="word-of-the-day">
          <h2>Word of the Day</h2>
          {wordOfTheDay ? (
            <WordCard word={wordOfTheDay} showDefinition />
          ) : (
            <div className="no-word">No word of the day available.</div>
          )}
        </section>

        <section className="stats-section">
          <h2>Your Progress</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{stats.wordsLearned}</span>
              <span className="stat-label">Words Learned</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.wordsReviewed}</span>
              <span className="stat-label">Words Reviewed</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.currentStreak}</span>
              <span className="stat-label">Day Streak</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.averageScore.toFixed(1)}</span>
              <span className="stat-label">Avg. Score</span>
            </div>
          </div>
        </section>

        <section className="recent-section">
          <h2>Recently Reviewed Words</h2>
          <div className="recent-words">
            {recentWords.length > 0 ? (
              recentWords.map(({ word }) => (
                <WordCard key={word.id} word={word} showDefinition={false} />
              ))
            ) : (
              <div className="no-words">No recently reviewed words.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
