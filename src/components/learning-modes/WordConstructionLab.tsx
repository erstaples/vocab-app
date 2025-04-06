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

  const renderMeaningConstruction = () => {
    const sortedMorphemes = [...morphemes].sort((a, b) => a.position - b.position);
    return (
      <div className="meaning-construction" key="meaning-construction">
        <h3>Meaning Construction</h3>
        <div className="meaning-layers">
          {/* Layer 1: Morphemes */}
          <div className="layer morpheme-layer">
            {sortedMorphemes.map((morpheme, index) => (
              <React.Fragment key={`morpheme-layer-${morpheme.id}`}>
                <span
                  className="morpheme-item"
                  style={{
                    backgroundColor: MORPHEME_COLORS[morpheme.type] || MORPHEME_COLORS.bound
                  }}
                >
                  {morpheme.value}
                </span>
                {index < sortedMorphemes.length - 1 && (
                  <span className="layer-separator">+</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Arrows */}
          <div className="arrows-layer">
            {sortedMorphemes.map((morpheme, index) => (
              <div key={`arrow-${morpheme.id}`} className="arrow">↓</div>
            ))}
          </div>

          {/* Layer 2: Meanings */}
          <div className="layer meaning-layer">
            {sortedMorphemes.map((morpheme, index) => (
              <React.Fragment key={`meaning-layer-${morpheme.id}`}>
                <span className="meaning-item">
                  {morpheme.meaning}
                </span>
                {index < sortedMorphemes.length - 1 && (
                  <span className="layer-separator">+</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Final Arrow */}
          <div className="final-arrow">↓</div>

          {/* Layer 3: Definition */}
          <div className="layer definition-layer">
            <span className="definition-item">"{word.definition}"</span>
          </div>
        </div>
      </div>
    );
  };

  const renderVisualBreakdown = () => {
    const sortedMorphemes = [...morphemes].sort((a, b) => a.position - b.position);
    return (
      <div className="visual-breakdown" key="visual-breakdown">
        <div className="visual-breakdown-header">
          <h3>Visual Breakdown</h3>
          <button
            className="copy-button"
            onClick={() => {
              const text = sortedMorphemes.map(m => m.value).join(' + ');
              navigator.clipboard.writeText(text);
            }}
          >
            Copy
          </button>
        </div>
        <div className="morpheme-breakdown">
          {sortedMorphemes.map((morpheme, index) => (
            <React.Fragment key={`morpheme-${morpheme.id}`}>
              <div
                className="morpheme-block"
                style={{
                  backgroundColor: MORPHEME_COLORS[morpheme.type] || MORPHEME_COLORS.bound
                }}
              >
                {morpheme.value}
              </div>
              {index < sortedMorphemes.length - 1 && (
                <div className="morpheme-separator">+</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderMorphemeTable = () => {
    const sortedMorphemes = [...morphemes].sort((a, b) => a.position - b.position);
    return (
      <div className="morpheme-table-container" key="morpheme-table">
        <h3>Morpheme Analysis</h3>
        <table className="morpheme-table">
          <thead>
            <tr>
              <th>Morpheme</th>
              <th>Type</th>
              <th>Meaning</th>
              <th>Example Words</th>
            </tr>
          </thead>
          <tbody>
            {sortedMorphemes.map((morpheme) => (
              <tr key={`table-row-${morpheme.id}`}>
                <td>
                  <span
                    className="morpheme-cell"
                    style={{
                      backgroundColor: MORPHEME_COLORS[morpheme.type] || MORPHEME_COLORS.bound
                    }}
                  >
                    {morpheme.value}
                  </span>
                </td>
                <td>
                  <span className="type-badge" style={{
                    backgroundColor: MORPHEME_COLORS[morpheme.type] || MORPHEME_COLORS.bound
                  }}>
                    {morpheme.type}
                  </span>
                </td>
                <td>{morpheme.meaning}</td>
                <td>
                  <div className="example-words">
                    {(morpheme.examples || []).map((example, i) => (
                      <span key={`example-${i}`} className="example-item">
                        {example}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
        {renderVisualBreakdown()}
        {renderMorphemeTable()}
        {renderMeaningConstruction()}
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