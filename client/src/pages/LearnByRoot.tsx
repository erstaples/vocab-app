import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { WordFamily } from '@vocab-builder/shared';
import { api } from '../api/client';
import { RootFamilyMode } from '../components/learning-modes/RootFamilyMode';
import { LoadingSpinner, Button, Card } from '../components/common';
import './LearnByRoot.css';

export default function LearnByRoot() {
  const navigate = useNavigate();
  const [families, setFamilies] = useState<WordFamily[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [wordsLearned, setWordsLearned] = useState<number[]>([]);

  useEffect(() => {
    async function fetchFamilies() {
      try {
        const response = await api.get<WordFamily[]>('/morphemes/families?minWords=2');
        setFamilies(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load word families');
      } finally {
        setIsLoading(false);
      }
    }

    fetchFamilies();
  }, []);

  const handleWordLearned = (wordId: number) => {
    setWordsLearned(prev => [...prev, wordId]);
  };

  const handleComplete = () => {
    setSessionComplete(true);
  };

  const handleRestart = () => {
    setSessionComplete(false);
    setWordsLearned([]);
  };

  if (isLoading) {
    return (
      <div className="learn-by-root__loading">
        <LoadingSpinner />
        <p>Loading word families...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="learn-by-root__error">
        <p>{error}</p>
        <Button onClick={() => navigate('/dashboard')}>Go Back</Button>
      </div>
    );
  }

  if (sessionComplete) {
    const totalWords = wordsLearned.length;
    const familiesCompleted = families.length;

    return (
      <div className="learn-by-root__complete">
        <Card className="learn-by-root__complete-card">
          <div className="learn-by-root__complete-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2>Root Learning Complete!</h2>
          <div className="learn-by-root__complete-stats">
            <div className="learn-by-root__complete-stat">
              <span className="learn-by-root__complete-stat-value">{familiesCompleted}</span>
              <span className="learn-by-root__complete-stat-label">Root Families</span>
            </div>
            <div className="learn-by-root__complete-stat">
              <span className="learn-by-root__complete-stat-value">{totalWords}</span>
              <span className="learn-by-root__complete-stat-label">Words Learned</span>
            </div>
          </div>
          <p className="learn-by-root__complete-message">
            You now have the power to decode unfamiliar words using these roots!
          </p>
          <div className="learn-by-root__complete-actions">
            <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
            <Button variant="secondary" onClick={handleRestart}>
              Learn Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="learn-by-root">
      <header className="learn-by-root__header">
        <h1>Learn by Root</h1>
        <p>Master word families through their shared roots</p>
      </header>

      <RootFamilyMode
        families={families}
        onComplete={handleComplete}
        onWordLearned={handleWordLearned}
      />
    </div>
  );
}
