import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Card } from '../components/common';
import { LevelProgress, Streak, BadgeCollection } from '../components/gamification';
import { api } from '../api/client';
import type { Badge, UserBadge } from '@vocab-builder/shared';
import './Profile.css';

export default function Profile() {
  const { user, stats } = useAuthStore();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<UserBadge[]>([]);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const [badgesRes, earnedRes] = await Promise.all([
          api.get<Badge[]>('/badges'),
          api.get<UserBadge[]>('/users/badges'),
        ]);
        setBadges(badgesRes.data);
        setEarnedBadges(earnedRes.data);
      } catch (error) {
        console.error('Failed to fetch badges:', error);
      }
    };

    fetchBadges();
  }, []);

  if (!user || !stats) {
    return <div className="loading-screen">Loading...</div>;
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="profile">
      <header className="profile__header">
        <div className="profile__avatar">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div className="profile__info">
          <h1>{user.username}</h1>
          <p>{user.email}</p>
          <span className="profile__member-since">Member since {memberSince}</span>
        </div>
      </header>

      <div className="profile__grid">
        <Card className="profile__card">
          <h2>Level Progress</h2>
          <LevelProgress level={stats.level} totalXp={stats.totalXp} />
        </Card>

        <Card className="profile__card">
          <h2>Streak</h2>
          <Streak
            currentStreak={stats.currentStreak}
            longestStreak={stats.longestStreak}
          />
        </Card>

        <Card className="profile__card profile__card--stats">
          <h2>Statistics</h2>
          <div className="profile__stats">
            <div className="profile__stat">
              <span className="profile__stat-value">{stats.wordsLearned}</span>
              <span className="profile__stat-label">Words Learned</span>
            </div>
            <div className="profile__stat">
              <span className="profile__stat-value">{stats.wordsMastered}</span>
              <span className="profile__stat-label">Words Mastered</span>
            </div>
            <div className="profile__stat">
              <span className="profile__stat-value">{stats.totalReviews}</span>
              <span className="profile__stat-label">Total Reviews</span>
            </div>
            <div className="profile__stat">
              <span className="profile__stat-value">{stats.totalXp.toLocaleString()}</span>
              <span className="profile__stat-label">Total XP</span>
            </div>
          </div>
        </Card>

        <Card className="profile__card profile__card--badges">
          <BadgeCollection badges={badges} earnedBadges={earnedBadges} />
        </Card>
      </div>
    </div>
  );
}
