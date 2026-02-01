import React from 'react';
import type { WordWithDetails } from '@vocab-builder/shared';
import { LiteralMeaningPrompt } from '../../morphemes';
import './phases.css';

interface InferPhaseProps {
  word: WordWithDetails;
  onSubmitGuess: (guess: string) => void;
  onSkip: () => void;
}

export function InferPhase({ word, onSubmitGuess, onSkip }: InferPhaseProps) {
  return (
    <div className="phase phase--infer">
      <div className="phase__indicator">
        <span className="phase__indicator-dot phase__indicator-dot--infer" />
        <span className="phase__indicator-text">Infer</span>
      </div>

      <div className="phase__content">
        <h2 className="phase__word phase__word--small">{word.word}</h2>
        <LiteralMeaningPrompt
          morphemes={word.morphemes}
          onSubmit={onSubmitGuess}
          onSkip={onSkip}
        />
      </div>
    </div>
  );
}
