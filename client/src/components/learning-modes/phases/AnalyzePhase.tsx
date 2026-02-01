import React from 'react';
import type { WordWithDetails } from '@vocab-builder/shared';
import { Badge } from '../../common/Badge';
import { MorphemeBreakdown } from '../../morphemes';
import './phases.css';

interface AnalyzePhaseProps {
  word: WordWithDetails;
  onContinue: () => void;
}

export function AnalyzePhase({ word, onContinue }: AnalyzePhaseProps) {
  const hasMorphemes = word.morphemes.length > 0;

  return (
    <div className="phase phase--analyze">
      <div className="phase__indicator">
        <span className="phase__indicator-dot phase__indicator-dot--analyze" />
        <span className="phase__indicator-text">Analyze</span>
      </div>

      <div className="phase__content">
        {hasMorphemes ? (
          <MorphemeBreakdown
            word={word.word}
            morphemes={word.morphemes}
            animate={true}
          />
        ) : (
          <div className="phase__word-display">
            <h2 className="phase__word">{word.word}</h2>
            {word.pronunciation && (
              <p className="phase__pronunciation">/{word.pronunciation}/</p>
            )}
          </div>
        )}

        <div className="phase__meta">
          <Badge variant="default">{word.partOfSpeech}</Badge>
        </div>
      </div>

      <button
        className="phase__continue-btn"
        onClick={onContinue}
      >
        {hasMorphemes ? 'Guess Meaning' : 'Reveal Definition'}
        <span className="phase__continue-hint">(Space)</span>
      </button>
    </div>
  );
}
