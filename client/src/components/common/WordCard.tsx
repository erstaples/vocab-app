import React from 'react';
import type { WordWithDetails } from '@vocab-builder/shared';
import { Badge } from './Badge';
import './WordCard.css';

interface WordCardProps {
  word: WordWithDetails;
  showDefinition?: boolean;
  showMorphemes?: boolean;
  showEtymology?: boolean;
  onClick?: () => void;
  className?: string;
}

export function WordCard({
  word,
  showDefinition = true,
  showMorphemes = false,
  showEtymology = false,
  onClick,
  className = '',
}: WordCardProps) {
  const primaryDefinition = word.definitions.find(d => d.isPrimary) || word.definitions[0];

  return (
    <div
      className={`word-card ${onClick ? 'word-card--clickable' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="word-card__header">
        <h3 className="word-card__word">{word.word}</h3>
        <div className="word-card__meta">
          <Badge variant="default" size="sm">
            {word.partOfSpeech}
          </Badge>
          <span className="word-card__difficulty">
            {'*'.repeat(word.difficulty)}
          </span>
        </div>
      </div>

      {word.pronunciation && (
        <p className="word-card__pronunciation">/{word.pronunciation}/</p>
      )}

      {showDefinition && primaryDefinition && (
        <div className="word-card__definition">
          <p>{primaryDefinition.definition}</p>
          {primaryDefinition.exampleSentence && (
            <p className="word-card__example">"{primaryDefinition.exampleSentence}"</p>
          )}
        </div>
      )}

      {showMorphemes && word.morphemes && word.morphemes.length > 0 && (
        <div className="word-card__morphemes">
          <h4>Word Parts:</h4>
          <div className="word-card__morpheme-list">
            {word.morphemes
              .sort((a, b) => a.position - b.position)
              .map(morpheme => (
                <span key={morpheme.id} className={`word-card__morpheme word-card__morpheme--${morpheme.type}`}>
                  <strong>{morpheme.morpheme}</strong>
                  <span>({morpheme.meaning})</span>
                </span>
              ))}
          </div>
        </div>
      )}

      {showEtymology && word.etymology && (
        <div className="word-card__etymology">
          <h4>Etymology:</h4>
          <p>{word.etymology}</p>
        </div>
      )}
    </div>
  );
}
