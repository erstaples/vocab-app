import React, { useState, useEffect } from 'react';
import { Word } from '../../models/Word';
import '../../styles/word-construction-lab.css';
import { Morpheme, WordMorpheme, WordFamily } from '../../models/Morpheme';
import morphemeService from '../../services/morpheme-service';

interface WordConstructionLabProps {
  word: Word;
  onComplete: (score: 0 | 1 | 2 | 3 | 4 | 5, timeSpent: number) => void;
}

/**
 * Color mapping for different morpheme types
 */
const MORPHEME_COLORS = {
  prefix: '#4299e1', // blue
  root: '#48bb78',   // green
  suffix: '#9f7aea', // purple
  free: '#f6ad55',   // orange
  infix: '#ed64a6',  // pink
  bound: '#a0aec0'   // gray
};

export const WordConstructionLab: React.FC<WordConstructionLabProps> = ({ word, onComplete }) => {
  const [morphemes, setMorphemes] = useState<WordMorpheme[]>([]);
  const [wordFamilies, setWordFamilies] = useState<WordFamily[]>([]);
  const [selectedMorpheme, setSelectedMorpheme] = useState<number | null>(null);
  const [startTime] = useState(Date.now());
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Load morphemes and word families when word changes
    const loadWordData = async () => {
      try {
        const [wordMorphemes, families] = await Promise.all([
          morphemeService.getMorphemesForWord(word.id),
          morphemeService.getWordFamilies(word.id)
        ]);
        console.log('Loaded morphemes:', JSON.stringify(wordMorphemes, null, 2));
        console.log('Loaded families:', JSON.stringify(families, null, 2));
        setMorphemes(wordMorphemes);
        setWordFamilies(families);
      } catch (error) {
        console.error('Error loading word data:', error);
      }
    };

    loadWordData();
    setIsComplete(false);
    setSelectedMorpheme(null);
  }, [word]);

  const handleMorphemeClick = (morphemeId: number) => {
    console.log('Clicked morpheme:', morphemeId);
    console.log('Current morphemes:', JSON.stringify(morphemes, null, 2));
    const morpheme = morphemes.find(m => m.id === morphemeId);
    console.log('Selected morpheme data:', JSON.stringify(morpheme, null, 2));
    setSelectedMorpheme(prevId => prevId === morphemeId ? null : morphemeId);
  };

  const handleComplete = (score: 0 | 1 | 2 | 3 | 4 | 5) => {
    const timeSpent = Date.now() - startTime;
    setIsComplete(true);
    onComplete(score, timeSpent);
  };

  const renderMorphemeBlocks = () => {
    const sortedMorphemes = [...morphemes].sort((a, b) => a.position - b.position);
    return (
      <div className="morpheme-blocks-container" key="morpheme-blocks">
        {sortedMorphemes.map((morpheme) => {
          console.log('Rendering morpheme block:', morpheme);
          const isSelected = selectedMorpheme === morpheme.id;
          return (
            <div key={`morpheme-${morpheme.id}`} className="morpheme-block-wrapper">
              <button
                type="button"
                className={`morpheme-block ${isSelected ? 'selected' : ''}`}
                style={{
                  backgroundColor: MORPHEME_COLORS[morpheme.type] || MORPHEME_COLORS.bound,
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.75rem 1.25rem',
                  margin: '0.5rem',
                  borderRadius: '0.5rem',
                  display: 'inline-block',
                  transition: 'all 0.3s ease',
                  boxShadow: isSelected ? '0 0 0 3px rgba(66, 153, 225, 0.5)' : '0 2px 4px rgba(0,0,0,0.1)',
                  transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                  color: 'white',
                  fontWeight: '500',
                  fontSize: '1rem',
                  outline: 'none'
                }}
                onClick={() => {
                  console.log('Morpheme block clicked:', morpheme);
                  handleMorphemeClick(morpheme.id);
                }}
              >
                {morpheme.value}
              </button>
              {isSelected && (
                <div className="morpheme-tooltip">
                  {morpheme.meaning}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderWordFamilies = () => {
    return wordFamilies.length > 0 ? (
      <div className="word-families" key="word-families-section">
        <h3>Word Family</h3>
        <div className="word-family-list">
          {wordFamilies.map((family, index) => {
            const familyId = family.relatedWordId || `temp-${index}`;
            return (
              <div
                key={`family-${familyId}`}
                className="word-family-item"
                style={{
                  padding: '0.5rem',
                  margin: '0.25rem',
                  backgroundColor: '#f7fafc',
                  borderRadius: '0.25rem'
                }}
              >
                <div className="family-item-content" key={`content-${familyId}`}>
                  <span className="related-word">{family.value}</span>
                  <span className="relationship-type">({family.relationshipType})</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ) : null;
  };

  const renderEtymology = () => {
    if (!word.etymology) return null;

    return (
      <div className="etymology-section">
        <h3>Etymology</h3>
        <div className="etymology-content">
          <p><strong>Origin:</strong> {word.etymology.origin}</p>
          <p><strong>Period:</strong> {word.etymology.period}</p>
          {word.etymology.development && word.etymology.development.length > 0 && (
            <div key="etymology-development">
              <p key="development-title"><strong>Development:</strong></p>
              <ul key="development-list">
                {word.etymology.development.map((step, index) => (
                  <li key={`etymology-step-${index}`}>{step}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="word-construction-lab">
      <div className="word-header">
        <h2>{word.value}</h2>
        <p className="definition">{word.definition}</p>
      </div>

      <div className="morpheme-section">
        <h3>Morpheme Analysis</h3>
        <div className="morpheme-blocks" key="morpheme-section">
          {renderMorphemeBlocks()}
        </div>
      </div>

      {selectedMorpheme && (() => {
        console.log('Rendering details for morpheme:', selectedMorpheme);
        const selectedMorphemeData = morphemes.find(m => m.id === selectedMorpheme);
        console.log('Selected morpheme data for render:', JSON.stringify(selectedMorphemeData, null, 2));
        
        if (!selectedMorphemeData) {
          console.log('No morpheme data found for id:', selectedMorpheme);
          return null;
        }
        
        return (
          <div key={`details-${selectedMorpheme}`} className="morpheme-details">
            <h3>Morpheme Details</h3>
            <div className="morpheme-info">
              <div className="morpheme-info-grid">
                <p key="type">
                  <strong>Type:</strong>
                  <span className="type-badge" style={{
                    backgroundColor: MORPHEME_COLORS[selectedMorphemeData.type] || MORPHEME_COLORS.bound
                  }}>
                    {selectedMorphemeData.type || 'unknown'}
                  </span>
                </p>
                <p key="meaning">
                  <strong>Meaning:</strong>
                  <span>{selectedMorphemeData.meaning || 'Not available'}</span>
                </p>
                <p key="origin">
                  <strong>Origin:</strong>
                  <span>{selectedMorphemeData.languageOrigin || 'Not available'}</span>
                </p>
                <div key="examples" className="examples-section">
                  <strong>Examples:</strong>
                  <div className="examples-list">
                    {(selectedMorphemeData.examples || []).map((ex, i) => (
                      <span key={`example-${i}`} className="example-item">
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {renderWordFamilies()}
      {renderEtymology()}

      {!isComplete && (
        <div className="score-section">
          <h3>Rate your understanding:</h3>
          <div className="score-buttons">
            {[
              { score: 0, label: 'Not at all (0)' } as const,
              { score: 1, label: 'Barely (1)' } as const,
              { score: 2, label: 'Somewhat (2)' } as const,
              { score: 3, label: 'Well (3)' } as const,
              { score: 4, label: 'Very well (4)' } as const,
              { score: 5, label: 'Perfectly (5)' } as const
            ].map(({ score, label }) => (
              <button key={`score-${score}`} onClick={() => handleComplete(score)}>
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};