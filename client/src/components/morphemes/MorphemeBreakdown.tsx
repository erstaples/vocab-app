import React from 'react';
import type { MorphemeWithRelation } from '@vocab-builder/shared';
import './MorphemeBreakdown.css';

interface MorphemeBreakdownProps {
  word: string;
  morphemes: MorphemeWithRelation[];
  animate?: boolean;
}

export function MorphemeBreakdown({ word, morphemes, animate = true }: MorphemeBreakdownProps) {
  if (morphemes.length === 0) {
    return null;
  }

  // Sort morphemes by position
  const sortedMorphemes = [...morphemes].sort((a, b) => a.position - b.position);

  return (
    <div className="morpheme-breakdown">
      <div className="morpheme-breakdown__word">{word}</div>
      <div className="morpheme-breakdown__parts">
        {sortedMorphemes.map((morpheme, index) => (
          <div
            key={morpheme.id}
            className={`morpheme-part morpheme-part--${morpheme.type}${animate ? ' morpheme-part--animate' : ''}`}
            style={{ animationDelay: animate ? `${index * 150}ms` : undefined }}
          >
            <span className="morpheme-part__morpheme">{morpheme.morpheme}</span>
            <span className="morpheme-part__meaning">{morpheme.meaning}</span>
          </div>
        ))}
      </div>
      <div className="morpheme-breakdown__literal">
        <span className="morpheme-breakdown__literal-label">Literal:</span>
        <span className="morpheme-breakdown__literal-value">
          {sortedMorphemes.map(m => m.meaning).join(' + ')}
        </span>
      </div>
    </div>
  );
}
