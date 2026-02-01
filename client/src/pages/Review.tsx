import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../stores/progressStore';
import { useAuthStore } from '../stores/authStore';
import { FlashcardMode } from '../components/learning-modes';
import { LoadingOverlay, Button, Card } from '../components/common';
import { XPNotification } from '../components/gamification';
import './Review.css';

export default function Review() {
  const navigate = useNavigate();
  const { dueWords, fetchDueWords, submitReview, isLoading } = useProgressStore();
  const { fetchStats } = useAuthStore();
  const [earnedXp, setEarnedXp] = useState<number | null>(null);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionStats, setSessionStats] = useState({ wordsReviewed: 0, totalXp: 0 });

  useEffect(() => {
    fetchDueWords();
  }, [fetchDueWords]);

  const handleReview = async (wordId: number, rating: number, responseTimeMs: number) => {
    const result = await submitReview({
      wordId,
      rating,
      responseTimeMs,
      learningMode: 'flashcard',
    });

    setEarnedXp(result.xpEarned);
    setSessionStats(prev => ({
      wordsReviewed: prev.wordsReviewed + 1,
      totalXp: prev.totalXp + result.xpEarned,
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
    return <LoadingOverlay message="Loading words to review..." />;
  }

  if (sessionComplete) {
    return (
      <div className="review-complete">
        <Card className="review-complete__card">
          <div className="review-complete__icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <h2>Review Complete!</h2>
          <div className="review-complete__stats">
            <div className="review-complete__stat">
              <span className="review-complete__stat-value">{sessionStats.wordsReviewed}</span>
              <span className="review-complete__stat-label">Words Reviewed</span>
            </div>
            <div className="review-complete__stat">
              <span className="review-complete__stat-value">+{sessionStats.totalXp}</span>
              <span className="review-complete__stat-label">XP Earned</span>
            </div>
          </div>
          <div className="review-complete__actions">
            <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
            <Button variant="secondary" onClick={() => {
              setSessionComplete(false);
              setSessionStats({ wordsReviewed: 0, totalXp: 0 });
              fetchDueWords();
            }}>
              Review More
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="review-page">
      <header className="review-page__header">
        <h1>Review</h1>
        <p>Practice words you've already learned</p>
      </header>

      {earnedXp !== null && (
        <XPNotification xp={earnedXp} onComplete={handleXpComplete} />
      )}

      <FlashcardMode
        words={dueWords}
        onReview={handleReview}
        onComplete={handleComplete}
        mode="review"
      />
    </div>
  );
}
