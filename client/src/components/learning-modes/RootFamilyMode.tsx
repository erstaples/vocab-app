import React, { useState, useEffect, useCallback } from 'react';
import type { WordFamily, WordFamilyMember } from '@vocab-builder/shared';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import './RootFamilyMode.css';

interface RootFamilyModeProps {
  families: WordFamily[];
  onComplete: () => void;
  onWordLearned?: (wordId: number) => void;
}

type Phase = 'intro' | 'word' | 'guess' | 'reveal' | 'summary';

export function RootFamilyMode({ families, onComplete, onWordLearned }: RootFamilyModeProps) {
  const [familyIndex, setFamilyIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('intro');
  const [userGuess, setUserGuess] = useState('');
  const [familyProgress, setFamilyProgress] = useState<Map<number, number[]>>(new Map());

  const currentFamily = families[familyIndex];
  const currentWord = currentFamily?.words[wordIndex];
  const totalFamilies = families.length;
  const wordsInFamily = currentFamily?.words.length || 0;

  // Reset when moving to new family
  useEffect(() => {
    setWordIndex(0);
    setPhase('intro');
    setUserGuess('');
  }, [familyIndex]);

  const handleIntroComplete = useCallback(() => {
    setPhase('word');
  }, []);

  const handleWordContinue = useCallback(() => {
    setPhase('guess');
  }, []);

  const handleGuessSubmit = useCallback(() => {
    setPhase('reveal');
  }, []);

  const handleGuessSkip = useCallback(() => {
    setUserGuess('');
    setPhase('reveal');
  }, []);

  const handleRevealContinue = useCallback(() => {
    // Mark word as learned
    if (currentWord && onWordLearned) {
      onWordLearned(currentWord.id);
    }

    // Track progress
    setFamilyProgress(prev => {
      const newProgress = new Map(prev);
      const familyWords = newProgress.get(currentFamily.root.id) || [];
      if (!familyWords.includes(currentWord.id)) {
        newProgress.set(currentFamily.root.id, [...familyWords, currentWord.id]);
      }
      return newProgress;
    });

    // Move to next word or summary
    if (wordIndex < wordsInFamily - 1) {
      setWordIndex(prev => prev + 1);
      setPhase('word');
      setUserGuess('');
    } else {
      setPhase('summary');
    }
  }, [currentWord, currentFamily, wordIndex, wordsInFamily, onWordLearned]);

  const handleFamilyComplete = useCallback(() => {
    if (familyIndex < totalFamilies - 1) {
      setFamilyIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  }, [familyIndex, totalFamilies, onComplete]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) {
        if (e.key === 'Enter' && !e.shiftKey && phase === 'guess') {
          e.preventDefault();
          if (userGuess.trim()) {
            handleGuessSubmit();
          } else {
            handleGuessSkip();
          }
        }
        return;
      }

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (phase === 'intro') handleIntroComplete();
        else if (phase === 'word') handleWordContinue();
        else if (phase === 'reveal') handleRevealContinue();
        else if (phase === 'summary') handleFamilyComplete();
      } else if (e.key === 'Escape' && phase === 'guess') {
        handleGuessSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, userGuess, handleIntroComplete, handleWordContinue, handleGuessSubmit, handleGuessSkip, handleRevealContinue, handleFamilyComplete]);

  if (!currentFamily) {
    return (
      <div className="root-family-mode__empty">
        <h2>No word families available</h2>
        <p>Add more words with shared roots to use this mode.</p>
        <Button onClick={onComplete}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="root-family-mode">
      {/* Progress header */}
      <div className="root-family-mode__header">
        <div className="root-family-mode__progress">
          <div className="root-family-mode__progress-bar">
            <div
              className="root-family-mode__progress-fill"
              style={{ width: `${((familyIndex * 100) + (wordIndex / wordsInFamily * 100)) / totalFamilies}%` }}
            />
          </div>
          <span className="root-family-mode__progress-text">
            Family {familyIndex + 1} / {totalFamilies}
          </span>
        </div>
      </div>

      {/* Intro Phase - Introduce the root */}
      {phase === 'intro' && (
        <div className="root-family-mode__phase root-family-mode__intro">
          <div className="root-family-mode__phase-badge">
            <Badge variant="primary">New Root</Badge>
          </div>

          <div className="root-family-mode__root-card">
            <div className="root-family-mode__root-morpheme">
              {currentFamily.root.morpheme}
            </div>
            <div className="root-family-mode__root-meaning">
              "{currentFamily.root.meaning}"
            </div>
            {currentFamily.root.origin && (
              <div className="root-family-mode__root-origin">
                {currentFamily.root.origin}
              </div>
            )}
          </div>

          <div className="root-family-mode__intro-info">
            <p>This root appears in <strong>{currentFamily.wordCount} words</strong> in your vocabulary.</p>
            <p>Learn the root, unlock the family!</p>
          </div>

          <Button onClick={handleIntroComplete} size="lg">
            Explore Words
            <span className="root-family-mode__hint">(Space)</span>
          </Button>
        </div>
      )}

      {/* Word Phase - Show the word with root highlighted */}
      {phase === 'word' && currentWord && (
        <div className="root-family-mode__phase root-family-mode__word">
          <div className="root-family-mode__word-counter">
            Word {wordIndex + 1} of {wordsInFamily}
          </div>

          <div className="root-family-mode__root-reminder">
            <span className="root-family-mode__root-chip">{currentFamily.root.morpheme}</span>
            <span>= "{currentFamily.root.meaning}"</span>
          </div>

          <div className="root-family-mode__word-display">
            <h2 className="root-family-mode__word-text">
              {highlightRoot(currentWord.word, currentFamily.root.morpheme)}
            </h2>
            <Badge variant="default">{currentWord.partOfSpeech}</Badge>
          </div>

          <p className="root-family-mode__word-prompt">
            Can you see the root <strong>{currentFamily.root.morpheme}</strong> in this word?
          </p>

          <Button onClick={handleWordContinue} size="lg">
            Guess Meaning
            <span className="root-family-mode__hint">(Space)</span>
          </Button>
        </div>
      )}

      {/* Guess Phase - User guesses meaning */}
      {phase === 'guess' && currentWord && (
        <div className="root-family-mode__phase root-family-mode__guess">
          <h2 className="root-family-mode__word-text root-family-mode__word-text--small">
            {currentWord.word}
          </h2>

          {/* Show ALL morphemes with meanings */}
          {currentWord.morphemes && currentWord.morphemes.length > 0 && (
            <div className="root-family-mode__morpheme-breakdown">
              <div className="root-family-mode__morpheme-parts">
                {currentWord.morphemes.map((m, i) => (
                  <div
                    key={i}
                    className={`root-family-mode__morpheme-part root-family-mode__morpheme-part--${m.type} ${m.morpheme === currentFamily.root.morpheme ? 'root-family-mode__morpheme-part--focus' : ''}`}
                  >
                    <span className="root-family-mode__morpheme-text">{m.morpheme}</span>
                    <span className="root-family-mode__morpheme-meaning">{m.meaning}</span>
                  </div>
                ))}
              </div>
              <div className="root-family-mode__literal-hint">
                <span className="root-family-mode__label">Literal:</span>
                <span>{currentWord.morphemes.map(m => m.meaning).join(' + ')}</span>
              </div>
            </div>
          )}

          <div className="root-family-mode__guess-form">
            <label htmlFor="meaning-guess">
              Combine the parts. What do you think <strong>{currentWord.word}</strong> means?
            </label>
            <textarea
              id="meaning-guess"
              value={userGuess}
              onChange={(e) => setUserGuess(e.target.value)}
              placeholder="Type your guess..."
              rows={2}
              autoFocus
            />
            <div className="root-family-mode__guess-actions">
              <Button variant="secondary" onClick={handleGuessSkip}>
                Skip
              </Button>
              <Button onClick={handleGuessSubmit} disabled={!userGuess.trim()}>
                Check
              </Button>
            </div>
          </div>

          <p className="root-family-mode__keyboard-hint">
            Press Enter to submit or Esc to skip
          </p>
        </div>
      )}

      {/* Reveal Phase - Show definition */}
      {phase === 'reveal' && currentWord && (
        <div className="root-family-mode__phase root-family-mode__reveal">
          <h2 className="root-family-mode__word-text root-family-mode__word-text--small">
            {highlightRoot(currentWord.word, currentFamily.root.morpheme)}
          </h2>

          {userGuess && (
            <div className="root-family-mode__user-guess">
              <span className="root-family-mode__label">Your guess:</span>
              <p>"{userGuess}"</p>
            </div>
          )}

          <div className="root-family-mode__definition">
            <span className="root-family-mode__label">Definition:</span>
            <p>{currentWord.definition}</p>
          </div>

          <div className="root-family-mode__connection">
            <span className="root-family-mode__label">Root Connection:</span>
            <p>
              The root <strong>{currentFamily.root.morpheme}</strong> ("{currentFamily.root.meaning}")
              helps you understand that <strong>{currentWord.word}</strong> relates to {currentFamily.root.meaning}.
            </p>
          </div>

          <Button onClick={handleRevealContinue} size="lg">
            {wordIndex < wordsInFamily - 1 ? 'Next Word' : 'See Summary'}
            <span className="root-family-mode__hint">(Space)</span>
          </Button>
        </div>
      )}

      {/* Summary Phase - Family complete */}
      {phase === 'summary' && (
        <div className="root-family-mode__phase root-family-mode__summary">
          <div className="root-family-mode__summary-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>

          <h2>Root Family Complete!</h2>

          <div className="root-family-mode__summary-root">
            <span className="root-family-mode__root-chip root-family-mode__root-chip--large">
              {currentFamily.root.morpheme}
            </span>
            <span>"{currentFamily.root.meaning}"</span>
          </div>

          <div className="root-family-mode__summary-words">
            <p>You learned {currentFamily.wordCount} words from this family:</p>
            <div className="root-family-mode__word-list">
              {currentFamily.words.map(word => (
                <span key={word.id} className="root-family-mode__word-tag">
                  {word.word}
                </span>
              ))}
            </div>
          </div>

          <div className="root-family-mode__summary-insight">
            <p>
              Now whenever you see a word with <strong>{currentFamily.root.morpheme}</strong>,
              you'll know it relates to "{currentFamily.root.meaning}"!
            </p>
          </div>

          <Button onClick={handleFamilyComplete} size="lg">
            {familyIndex < totalFamilies - 1 ? 'Next Family' : 'Finish Session'}
            <span className="root-family-mode__hint">(Space)</span>
          </Button>
        </div>
      )}
    </div>
  );
}

// Helper to highlight the root in a word
function highlightRoot(word: string, root: string): React.ReactNode {
  const rootClean = root.replace(/[-]/g, '');
  const lowerWord = word.toLowerCase();
  const lowerRoot = rootClean.toLowerCase();

  const index = lowerWord.indexOf(lowerRoot);
  if (index === -1) {
    return word;
  }

  const before = word.slice(0, index);
  const match = word.slice(index, index + rootClean.length);
  const after = word.slice(index + rootClean.length);

  return (
    <>
      {before}
      <span className="root-family-mode__root-highlight">{match}</span>
      {after}
    </>
  );
}
