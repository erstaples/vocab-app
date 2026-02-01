import React, { useState, useRef, useEffect } from 'react';
import type { MorphemeWithRelation } from '@vocab-builder/shared';
import { Button } from '../common/Button';
import './LiteralMeaningPrompt.css';

interface LiteralMeaningPromptProps {
  morphemes: MorphemeWithRelation[];
  onSubmit: (guess: string) => void;
  onSkip: () => void;
}

export function LiteralMeaningPrompt({ morphemes, onSubmit, onSkip }: LiteralMeaningPromptProps) {
  const [guess, setGuess] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sortedMorphemes = [...morphemes].sort((a, b) => a.position - b.position);
  const literalHint = sortedMorphemes.map(m => m.meaning).join(' + ');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(guess.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (guess.trim()) {
        onSubmit(guess.trim());
      } else {
        onSkip();
      }
    } else if (e.key === 'Escape') {
      onSkip();
    }
  };

  return (
    <div className="literal-meaning-prompt">
      <div className="literal-meaning-prompt__hint">
        <span className="literal-meaning-prompt__hint-label">Word parts suggest:</span>
        <span className="literal-meaning-prompt__hint-value">{literalHint}</span>
      </div>

      <form className="literal-meaning-prompt__form" onSubmit={handleSubmit}>
        <label className="literal-meaning-prompt__label" htmlFor="meaning-guess">
          What do you think this word means?
        </label>
        <textarea
          ref={inputRef}
          id="meaning-guess"
          className="literal-meaning-prompt__input"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your guess..."
          rows={2}
        />
        <div className="literal-meaning-prompt__actions">
          <Button
            type="button"
            variant="secondary"
            onClick={onSkip}
          >
            Skip
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!guess.trim()}
          >
            Check
          </Button>
        </div>
      </form>

      <p className="literal-meaning-prompt__keyboard-hint">
        Press Enter to submit or Esc to skip
      </p>
    </div>
  );
}
