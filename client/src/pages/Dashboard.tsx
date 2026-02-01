import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useProgressStore } from '../stores/progressStore';
import { Card, Button, ProgressBar } from '../components/common';
import { LevelProgress, Streak } from '../components/gamification';
import './Dashboard.css';

export default function Dashboard() {
  const { user, stats } = useAuthStore();
  const { totalDue, fetchDueWords } = useProgressStore();

  useEffect(() => {
    fetchDueWords();
  }, [fetchDueWords]);

  if (!stats) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1>Welcome back, {user?.username}!</h1>
        <p>Keep up the great work on your vocabulary journey.</p>
      </header>

      <div className="dashboard__grid">
        {/* Level Progress */}
        <Card className="dashboard__card dashboard__card--level">
          <LevelProgress level={stats.level} totalXp={stats.totalXp} />
        </Card>

        {/* Streak */}
        <Card className="dashboard__card dashboard__card--streak">
          <Streak
            currentStreak={stats.currentStreak}
            longestStreak={stats.longestStreak}
          />
        </Card>

        {/* Quick Stats */}
        <Card className="dashboard__card dashboard__card--stats">
          <h3>Your Progress</h3>
          <div className="dashboard__stats-grid">
            <div className="dashboard__stat">
              <span className="dashboard__stat-value">{stats.wordsLearned}</span>
              <span className="dashboard__stat-label">Words Learned</span>
            </div>
            <div className="dashboard__stat">
              <span className="dashboard__stat-value">{stats.wordsMastered}</span>
              <span className="dashboard__stat-label">Words Mastered</span>
            </div>
            <div className="dashboard__stat">
              <span className="dashboard__stat-value">{stats.totalReviews}</span>
              <span className="dashboard__stat-label">Total Reviews</span>
            </div>
            <div className="dashboard__stat">
              <span className="dashboard__stat-value">{stats.totalXp}</span>
              <span className="dashboard__stat-label">Total XP</span>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="dashboard__card dashboard__card--actions">
          <h3>Quick Actions</h3>
          <div className="dashboard__actions">
            <Link to="/learn" className="dashboard__action">
              <div className="dashboard__action-icon dashboard__action-icon--learn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <div className="dashboard__action-content">
                <span className="dashboard__action-title">Learn New Words</span>
                <span className="dashboard__action-desc">Discover new vocabulary</span>
              </div>
            </Link>

            <Link to="/review" className="dashboard__action">
              <div className="dashboard__action-icon dashboard__action-icon--review">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 4 23 10 17 10" />
                  <polyline points="1 20 1 14 7 14" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
              </div>
              <div className="dashboard__action-content">
                <span className="dashboard__action-title">Review</span>
                <span className="dashboard__action-desc">
                  {totalDue > 0 ? `${totalDue} words due` : 'All caught up!'}
                </span>
              </div>
              {totalDue > 0 && (
                <span className="dashboard__action-badge">{totalDue}</span>
              )}
            </Link>
          </div>
        </Card>

        {/* Daily Goal */}
        <Card className="dashboard__card dashboard__card--goal">
          <h3>Daily Goal</h3>
          <div className="dashboard__goal">
            <ProgressBar
              value={stats.totalReviews % 10}
              max={10}
              label="Reviews today"
              showValue
              variant="secondary"
            />
            <p className="dashboard__goal-text">
              Complete 10 reviews daily to maintain your streak!
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
