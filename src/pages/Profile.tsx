// src/pages/Profile.tsx
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { Badge, UserStats } from '../models';
import { UserProgressService } from '../services/user-progress-service';
import LevelProgress from '../components/gamification/LevelProgress';
import BadgeCollection from '../components/gamification/BadgeCollection';

// Create an instance of the service
const userProgressService = new UserProgressService();

const Profile: React.FC = () => {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState<UserStats | null>(null);
  const [badges, setBadges] = useState<(Omit<Badge, 'dateEarned'> & { earned: boolean, earnedDate?: Date })[]>([]);
  const [activeTab, setActiveTab] = useState<'stats' | 'badges' | 'history'>('stats');

  useEffect(() => {
    if (user) {
      // Load user stats
      const userStats = userProgressService.getUserStats();
      setStats(userStats);

      // Load badges
      const availableBadges = userProgressService.getBadges();
      setBadges(availableBadges);
    }
  }, [user]);

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (!user || !stats) {
    return <div className="loading">Loading profile...</div>;
  }

  // Format date for display
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="profile-page">
      <header className="profile-header">
        <button className="back-button" onClick={handleBack}>Back</button>
        <h1>Your Profile</h1>
      </header>

      <div className="profile-hero">
        <div className="profile-avatar">
          {/* Simple letter avatar based on username */}
          {user.username.charAt(0).toUpperCase()}
        </div>

        <div className="profile-info">
          <h2>{user.username}</h2>
          <div className="profile-meta">
            <span className="level-badge">Level {stats.level}</span>
            <span className="streak-badge">🔥 {stats.currentStreak} day streak</span>
            <span className="member-since">Member since {formatDate(new Date(user.progress.lastActivity))}</span>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Statistics
        </button>
        <button
          className={`tab-button ${activeTab === 'badges' ? 'active' : ''}`}
          onClick={() => setActiveTab('badges')}
        >
          Badges
        </button>
        <button
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'stats' && (
          <div className="stats-tab">
            <section className="level-section">
              <h3>Level Progress</h3>
              <LevelProgress
                level={stats.level}
                currentXP={stats.totalExperience}
                nextLevelXP={stats.experienceToNextLevel + stats.totalExperience}
              />
              <div className="xp-info">
                <span>{stats.experienceToNextLevel} XP to Level {stats.level + 1}</span>
              </div>
            </section>

            <section className="stats-grid-section">
              <h3>Learning Statistics</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{stats.wordsLearned}</div>
                  <div className="stat-label">Words Mastered</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.wordsReviewed}</div>
                  <div className="stat-label">Words in Progress</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.currentStreak}</div>
                  <div className="stat-label">Current Streak</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.longestStreak}</div>
                  <div className="stat-label">Longest Streak</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.averageScore.toFixed(1)}</div>
                  <div className="stat-label">Average Score</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.totalTimeSpent}</div>
                  <div className="stat-label">Total Minutes</div>
                </div>
              </div>
            </section>

            <section className="achievement-section">
              <h3>Achievements Snapshot</h3>
              <div className="achievement-summary">
                <div className="achievement-item">
                  <span className="achievement-label">Total Badges:</span>
                  <span className="achievement-value">
                    {badges.filter(b => b.earned).length} of {badges.length}
                  </span>
                </div>
                <div className="achievement-item">
                  <span className="achievement-label">Latest Badge:</span>
                  <span className="achievement-value">
                    {badges.filter(b => b.earned).length > 0
                      ? badges
                        .filter(b => b.earned)
                        .sort((a, b) => {
                          return b.earnedDate && a.earnedDate
                            ? b.earnedDate.getTime() - a.earnedDate.getTime()
                            : 0;
                        })[0].name
                      : 'None yet'}
                  </span>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="badges-tab">
            <h3>Your Achievements</h3>
            <p className="badges-intro">
              Earn badges by reaching milestones and completing challenges.
            </p>

            <BadgeCollection badges={badges} />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-tab">
            <h3>Learning History</h3>

            <div className="history-chart">
              {/* In a real app, this would be a chart showing learning activity */}
              <div className="placeholder-chart">
                <p>Activity heatmap would go here</p>
                <div className="fake-heatmap">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div
                      key={i}
                      className="heatmap-day"
                      style={{
                        opacity: Math.random() * 0.8 + 0.2,
                        backgroundColor: '#4caf50'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <h3>Recent Activity</h3>
            <div className="activity-list">
              {/* In a real app, this would show actual activity */}
              <div className="activity-item">
                <div className="activity-date">Today</div>
                <div className="activity-details">
                  <div className="activity-title">Reviewed 8 words</div>
                  <div className="activity-meta">Average score: 4.2</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-date">Yesterday</div>
                <div className="activity-details">
                  <div className="activity-title">Learned 5 new words</div>
                  <div className="activity-meta">ephemeral, mellifluous, serendipity...</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-date">2 days ago</div>
                <div className="activity-details">
                  <div className="activity-title">Reviewed 12 words</div>
                  <div className="activity-meta">Average score: 3.8</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-date">3 days ago</div>
                <div className="activity-details">
                  <div className="activity-title">Earned "Weekly Warrior" badge</div>
                  <div className="activity-meta">Maintained a 7-day streak</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-date">5 days ago</div>
                <div className="activity-details">
                  <div className="activity-title">Learned 3 new words</div>
                  <div className="activity-meta">ubiquitous, sycophant, ineffable</div>
                </div>
              </div>
            </div>

            <button className="secondary-button">
              View Complete History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
