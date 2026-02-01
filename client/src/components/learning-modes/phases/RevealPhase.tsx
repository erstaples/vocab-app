import React from 'react';
import type { WordWithDetails, Definition } from '@vocab-builder/shared';
import { RevealAnimation } from '../../morphemes';
import './phases.css';

interface RevealPhaseProps {
  word: WordWithDetails;
  definition: Definition;
  userGuess?: string;
  onContinue: () => void;
}

export function RevealPhase({ word, definition, userGuess, onContinue }: RevealPhaseProps) {
  return (
    <div className="phase phase--reveal">
      <div className="phase__indicator">
        <span className="phase__indicator-dot phase__indicator-dot--reveal" />
        <span className="phase__indicator-text">Reveal</span>
      </div>

      <div className="phase__content">
        <RevealAnimation
          word={word.word}
          definition={definition}
          morphemes={word.morphemes}
          userGuess={userGuess}
        />
      </div>

      <button
        className="phase__continue-btn"
        onClick={onContinue}
      >
        Rate Your Knowledge
        <span className="phase__continue-hint">(Space)</span>
      </button>
    </div>
  );
}
