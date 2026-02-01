import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../stores/progressStore';
import { useAuthStore } from '../stores/authStore';
import { FlashcardMode } from '../components/learning-modes';
import { LoadingOverlay, Button, Card } from '../components/common';
import { XPNotification } from '../components/gamification';
import './Learn.css';

export default function Learn() {
  const navigate = useNavigate();
  const { newWords, fetchNewWords, learnWord, isLoading } = useProgressStore();
  const { fetchStats } = useAuthStore();
  const [earnedXp, setEarnedXp] = useState<number | null>(null);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionStats, setSessionStats] = useState({ wordsLearned: 0, totalXp: 0 });

  useEffect(() => {
    fetchNewWords(10);
  }, [fetchNewWords]);

  const handleReview = async (wordId: number, rating: number, responseTimeMs: number) => {
    await learnWord(wordId);
    const xp = 15; // Base XP for learning a new word
    setEarnedXp(xp);
    setSessionStats(prev => ({
      wordsLearned: prev.wordsLearned + 1,
      totalXp: prev.totalXp + xp,
    }));
  };

  const handleComplete = () => {
    setSessionComplete(true);
    fetchStats();
  };

  const handleXpComplete = () => {
    setEarnedXp(null);
  };

  if (isLoading) {
    return <LoadingOverlay message="Loading new words..." />;
  }

  if (sessionComplete) {
    return (
      <div className="learn-complete">
        <Card className="learn-complete__card">
          <div className="learn-complete__icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2>Session Complete!</h2>
          <div className="learn-complete__stats">
            <div className="learn-complete__stat">
              <span className="learn-complete__stat-value">{sessionStats.wordsLearned}</span>
              <span className="learn-complete__stat-label">Words Learned</span>
            </div>
            <div className="learn-complete__stat">
              <span className="learn-complete__stat-value">+{sessionStats.totalXp}</span>
              <span className="learn-complete__stat-label">XP Earned</span>
            </div>
          </div>
          <div className="learn-complete__actions">
            <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
            <Button variant="secondary" onClick={() => {
              setSessionComplete(false);
              setSessionStats({ wordsLearned: 0, totalXp: 0 });
              fetchNewWords(10);
            }}>
              Learn More
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="learn-page">
      <header className="learn-page__header">
        <h1>Learn New Words</h1>
        <p>Expand your vocabulary with new words</p>
      </header>

      {earnedXp !== null && (
        <XPNotification xp={earnedXp} onComplete={handleXpComplete} />
      )}

      <FlashcardMode
        words={newWords}
        onReview={handleReview}
        onComplete={handleComplete}
        mode="learn"
      />
    </div>
  );
}
