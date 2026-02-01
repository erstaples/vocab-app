import React, { useState, useEffect, useCallback } from 'react';
import type { WordWithDetails } from '@vocab-builder/shared';
import { Button } from '../common/Button';
import { AnalyzePhase, InferPhase, RevealPhase, RatePhase } from './phases';
import './FlashcardMode.css';

interface FlashcardModeProps {
  words: WordWithDetails[];
  onReview: (wordId: number, rating: number, responseTimeMs: number) => Promise<void>;
  onComplete: () => void;
  mode: 'learn' | 'review';
}

type Phase = 'analyze' | 'infer' | 'reveal' | 'rate';

export function FlashcardMode({ words, onReview, onComplete, mode }: FlashcardModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('analyze');
  const [userGuess, setUserGuess] = useState<string | undefined>(undefined);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentWord = words[currentIndex];
  const progress = ((currentIndex) / words.length) * 100;
  const primaryDefinition = currentWord?.definitions.find(d => d.isPrimary) || currentWord?.definitions[0];
  const hasMorphemes = currentWord?.morphemes.length > 0;

  // Reset state when moving to a new word
  useEffect(() => {
    setStartTime(Date.now());
    setPhase('analyze');
    setUserGuess(undefined);
  }, [currentIndex]);

  // Handle phase transitions
  const handleAnalyzeContinue = useCallback(() => {
    if (hasMorphemes) {
      setPhase('infer');
    } else {
      setPhase('reveal');
    }
  }, [hasMorphemes]);

  const handleInferSubmit = useCallback((guess: string) => {
    setUserGuess(guess);
    setPhase('reveal');
  }, []);

  const handleInferSkip = useCallback(() => {
    setUserGuess(undefined);
    setPhase('reveal');
  }, []);

  const handleRevealContinue = useCallback(() => {
    setPhase('rate');
  }, []);

  const handleRating = async (rating: number) => {
    if (isSubmitting) return;

    const responseTime = Date.now() - startTime;
    setIsSubmitting(true);

    try {
      await onReview(currentWord.id, rating, responseTime);

      if (currentIndex < words.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        onComplete();
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept keys when typing in input
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) {
        return;
      }

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (phase === 'analyze') {
          handleAnalyzeContinue();
        } else if (phase === 'reveal') {
          handleRevealContinue();
        }
      } else if (phase === 'rate' && e.key >= '0' && e.key <= '5') {
        handleRating(parseInt(e.key, 10));
      } else if (e.key === 'Escape' && phase === 'infer') {
        handleInferSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, handleAnalyzeContinue, handleRevealContinue, handleInferSkip]);

  if (!currentWord) {
    return (
      <div className="flashcard-mode__empty">
        <h2>No words to {mode}</h2>
        <p>Check back later for more words to practice.</p>
        <Button onClick={onComplete}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="flashcard-mode">
      <div className="flashcard-mode__header">
        <div className="flashcard-mode__progress">
          <div className="flashcard-mode__progress-bar">
            <div
              className="flashcard-mode__progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="flashcard-mode__progress-text">
            {currentIndex + 1} / {words.length}
          </span>
        </div>

        <div className="flashcard-mode__phase-indicators">
          <span className={`flashcard-mode__phase-step ${phase === 'analyze' ? 'flashcard-mode__phase-step--active' : ''} ${['infer', 'reveal', 'rate'].includes(phase) ? 'flashcard-mode__phase-step--complete' : ''}`}>
            Analyze
          </span>
          {hasMorphemes && (
            <span className={`flashcard-mode__phase-step ${phase === 'infer' ? 'flashcard-mode__phase-step--active' : ''} ${['reveal', 'rate'].includes(phase) ? 'flashcard-mode__phase-step--complete' : ''}`}>
              Infer
            </span>
          )}
          <span className={`flashcard-mode__phase-step ${phase === 'reveal' ? 'flashcard-mode__phase-step--active' : ''} ${phase === 'rate' ? 'flashcard-mode__phase-step--complete' : ''}`}>
            Reveal
          </span>
          <span className={`flashcard-mode__phase-step ${phase === 'rate' ? 'flashcard-mode__phase-step--active' : ''}`}>
            Rate
          </span>
        </div>
      </div>

      <div className="flashcard-mode__content">
        {phase === 'analyze' && (
          <AnalyzePhase
            word={currentWord}
            onContinue={handleAnalyzeContinue}
          />
        )}

        {phase === 'infer' && (
          <InferPhase
            word={currentWord}
            onSubmitGuess={handleInferSubmit}
            onSkip={handleInferSkip}
          />
        )}

        {phase === 'reveal' && primaryDefinition && (
          <RevealPhase
            word={currentWord}
            definition={primaryDefinition}
            userGuess={userGuess}
            onContinue={handleRevealContinue}
          />
        )}

        {phase === 'rate' && (
          <RatePhase
            onRate={handleRating}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
