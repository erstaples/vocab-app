import React, { useState } from 'react';
import type { WordFamily } from '@vocab-builder/shared';
import './WordFamilyCard.css';

interface WordFamilyCardProps {
  family: WordFamily;
  onWordClick?: (wordId: number) => void;
  expanded?: boolean;
}

export function WordFamilyCard({ family, onWordClick, expanded = false }: WordFamilyCardProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);

  return (
    <div className={`word-family-card ${isExpanded ? 'word-family-card--expanded' : ''}`}>
      <button
        className="word-family-card__header"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <div className="word-family-card__root">
          <span className="word-family-card__root-morpheme">{family.root.morpheme}</span>
          <span className="word-family-card__root-meaning">"{family.root.meaning}"</span>
        </div>
        <div className="word-family-card__meta">
          <span className="word-family-card__count">{family.wordCount} words</span>
          <span className="word-family-card__origin">{family.root.origin}</span>
        </div>
        <span className={`word-family-card__chevron ${isExpanded ? 'word-family-card__chevron--up' : ''}`}>
          &#9662;
        </span>
      </button>

      {isExpanded && (
        <div className="word-family-card__words">
          <div className="word-family-card__tree">
            <div className="word-family-card__tree-root">
              <span className="word-family-card__tree-node word-family-card__tree-node--root">
                {family.root.morpheme}
              </span>
            </div>
            <div className="word-family-card__tree-branches">
              {family.words.map((word) => (
                <button
                  key={word.id}
                  className="word-family-card__word"
                  onClick={() => onWordClick?.(word.id)}
                >
                  <span className="word-family-card__word-term">{word.word}</span>
                  <span className="word-family-card__word-pos">{word.partOfSpeech}</span>
                  <span className="word-family-card__word-def">{word.definition}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
