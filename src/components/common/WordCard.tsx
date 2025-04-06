// src/components/common/WordCard.tsx
import React, { useState } from 'react';
import { Word } from '../../models';

interface WordCardProps {
  word: Word;
  showDefinition: boolean;
  compact?: boolean;
  onClick?: () => void;
}

const WordCard: React.FC<WordCardProps> = ({
  word,
  showDefinition,
  compact = false,
  onClick
}) => {
  const [expanded, setExpanded] = useState(showDefinition);

  const handleToggle = () => {
    if (onClick) {
      onClick();
    } else {
      setExpanded(!expanded);
    }
  };

  return (
    <div
      className={`word-card ${expanded ? 'expanded' : ''} ${compact ? 'compact' : ''}`}
      onClick={handleToggle}
    >
      <div className="word-header">
        <h3 className="word-value">{word.value}</h3>
        <span className="part-of-speech">{word.partOfSpeech}</span>
        {!compact && (
          <span className="pronunciation">{word.pronunciation}</span>
        )}
      </div>

      {(expanded || showDefinition) && (
        <div className="word-details">
          <p className="definition">{word.definition}</p>

          {!compact && (
            <>
              <div className="example-container">
                <h4>Example:</h4>
                <p className="example">{word.example}</p>
              </div>

              <div className="synonyms-container">
                <h4>Synonyms:</h4>
                <p className="synonyms">{word.synonyms.join(', ')}</p>
              </div>

              {word.etymology && (
                <div className="etymology-container">
                  <h4>Etymology:</h4>
                  <p><strong>Origin:</strong> {word.etymology.origin}</p>
                  <p><strong>Period:</strong> {word.etymology.period}</p>
                  {word.etymology.development && word.etymology.development.length > 0 && (
                    <>
                      <p><strong>Development:</strong></p>
                      <ul>
                        {word.etymology.development.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {!showDefinition && !compact && (
        <div className="card-footer">
          <button
            className="toggle-button"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {expanded ? 'Show Less' : 'Show More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default WordCard;