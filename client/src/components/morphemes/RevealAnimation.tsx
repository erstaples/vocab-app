import React from 'react';
import type { MorphemeWithRelation, Definition } from '@vocab-builder/shared';
import './RevealAnimation.css';

interface RevealAnimationProps {
  word: string;
  definition: Definition;
  morphemes: MorphemeWithRelation[];
  userGuess?: string;
}

export function RevealAnimation({ word, definition, morphemes, userGuess }: RevealAnimationProps) {
  const sortedMorphemes = [...morphemes].sort((a, b) => a.position - b.position);
  const literalMeaning = sortedMorphemes.map(m => m.meaning).join(' + ');
  const hasMorphemes = morphemes.length > 0;

  return (
    <div className="reveal-animation">
      <div className="reveal-animation__word">{word}</div>

      {hasMorphemes && (
        <div className="reveal-animation__literal">
          <span className="reveal-animation__label">Literal meaning:</span>
          <span className="reveal-animation__literal-value">{literalMeaning}</span>
        </div>
      )}

      {userGuess && (
        <div className="reveal-animation__guess">
          <span className="reveal-animation__label">Your guess:</span>
          <span className="reveal-animation__guess-value">"{userGuess}"</span>
        </div>
      )}

      <div className="reveal-animation__definition">
        <span className="reveal-animation__label">Definition:</span>
        <p className="reveal-animation__definition-text">{definition.definition}</p>
      </div>

      {definition.exampleSentence && (
        <p className="reveal-animation__example">"{definition.exampleSentence}"</p>
      )}

      {hasMorphemes && (
        <div className="reveal-animation__success">
          <span className="reveal-animation__success-icon">&#10003;</span>
          <span className="reveal-animation__success-text">
            You decoded a word using morphemes!
          </span>
        </div>
      )}
    </div>
  );
}
