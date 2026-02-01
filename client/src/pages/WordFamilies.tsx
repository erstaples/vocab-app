import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WordFamiliesList } from '../components/word-families';
import { Button } from '../components/common/Button';
import './WordFamilies.css';

export default function WordFamilies() {
  const navigate = useNavigate();

  const handleWordClick = (wordId: number) => {
    // Navigate to word detail or open modal
    console.log('Word clicked:', wordId);
  };

  const handleStartLearning = () => {
    navigate('/learn-by-root');
  };

  return (
    <div className="word-families-page">
      <header className="word-families-page__header">
        <h1>Word Families</h1>
        <p>Discover how words connect through shared roots</p>
        <Button onClick={handleStartLearning} className="word-families-page__start-btn">
          Start Learning by Root
        </Button>
      </header>

      <div className="word-families-page__content">
        <WordFamiliesList onWordClick={handleWordClick} />
      </div>

      <div className="word-families-page__tip">
        <div className="word-families-page__tip-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
        </div>
        <div className="word-families-page__tip-content">
          <strong>Pro Tip:</strong> When you learn a root like <em>spec</em> (to look),
          you can decode words like <em>inspect</em>, <em>spectacle</em>, and <em>perspective</em> -
          even if you've never seen them before!
        </div>
      </div>
    </div>
  );
}
