import React from 'react';
import { Card, Badge, Button } from '../common';
import type {
  MorphemeBreakdown,
  WordSuggestion,
  DefinitionData,
  WordFamilyData,
  MorphemeType,
} from '@vocab-builder/shared';
import './AIPreviewCard.css';

interface AIPreviewCardProps {
  type: 'morpheme-breakdown' | 'word-suggestions' | 'definition' | 'word-family';
  data: MorphemeBreakdown | WordSuggestion[] | DefinitionData | WordFamilyData;
  onApply: () => void;
  onCancel: () => void;
  isApplying?: boolean;
  selectedItems?: Set<number>; // For word suggestions/family - track selected words
  onToggleItem?: (index: number) => void;
}

function getTypeColor(type: MorphemeType): 'primary' | 'secondary' | 'success' {
  switch (type) {
    case 'prefix': return 'primary';
    case 'root': return 'success';
    case 'suffix': return 'secondary';
  }
}

export function AIPreviewCard({
  type,
  data,
  onApply,
  onCancel,
  isApplying = false,
  selectedItems,
  onToggleItem,
}: AIPreviewCardProps) {
  const renderMorphemeBreakdown = (breakdown: MorphemeBreakdown) => (
    <div className="ai-preview__content">
      <div className="ai-preview__section">
        <h4 className="ai-preview__section-title">Word Analysis: {breakdown.word}</h4>
        <div className="ai-preview__morphemes">
          {breakdown.morphemes.map((m, index) => (
            <div key={index} className="ai-preview__morpheme">
              <Badge variant={getTypeColor(m.type)} size="sm">{m.type}</Badge>
              <span className="ai-preview__morpheme-text">{m.text}</span>
              <span className="ai-preview__morpheme-meaning">"{m.meaning}"</span>
              {m.origin && <span className="ai-preview__morpheme-origin">({m.origin})</span>}
              {m.existingId && (
                <Badge variant="default" size="sm">In DB</Badge>
              )}
            </div>
          ))}
        </div>
      </div>
      {breakdown.etymology && (
        <div className="ai-preview__section">
          <h4 className="ai-preview__section-title">Etymology</h4>
          <p className="ai-preview__text">{breakdown.etymology}</p>
        </div>
      )}
    </div>
  );

  const renderWordSuggestions = (suggestions: WordSuggestion[]) => (
    <div className="ai-preview__content">
      <div className="ai-preview__section">
        <h4 className="ai-preview__section-title">Suggested Words ({suggestions.length})</h4>
        <div className="ai-preview__suggestions">
          {suggestions.map((word, index) => (
            <label
              key={index}
              className={`ai-preview__suggestion ${word.exists ? 'ai-preview__suggestion--exists' : ''}`}
            >
              {onToggleItem && (
                <input
                  type="checkbox"
                  checked={selectedItems?.has(index) ?? !word.exists}
                  onChange={() => onToggleItem(index)}
                  disabled={word.exists}
                />
              )}
              <div className="ai-preview__suggestion-content">
                <div className="ai-preview__suggestion-header">
                  <span className="ai-preview__suggestion-word">{word.word}</span>
                  <Badge variant="default" size="sm">{word.partOfSpeech}</Badge>
                  {word.exists && <Badge variant="warning" size="sm">Already Exists</Badge>}
                </div>
                <p className="ai-preview__suggestion-def">{word.definition}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDefinition = (def: DefinitionData) => (
    <div className="ai-preview__content">
      <div className="ai-preview__section">
        <h4 className="ai-preview__section-title">Definition</h4>
        <p className="ai-preview__text">{def.definition}</p>
      </div>
      <div className="ai-preview__section">
        <h4 className="ai-preview__section-title">Example Sentence</h4>
        <p className="ai-preview__text ai-preview__text--italic">{def.exampleSentence}</p>
      </div>
      <div className="ai-preview__section">
        <h4 className="ai-preview__section-title">Etymology</h4>
        <p className="ai-preview__text">{def.etymology}</p>
      </div>
    </div>
  );

  const renderWordFamily = (family: WordFamilyData) => (
    <div className="ai-preview__content">
      <div className="ai-preview__section">
        <h4 className="ai-preview__section-title">Root Morpheme</h4>
        <div className="ai-preview__root">
          <span className="ai-preview__root-text">{family.root.morpheme}</span>
          <span className="ai-preview__root-meaning">"{family.root.meaning}"</span>
          <Badge variant="default" size="sm">{family.root.origin}</Badge>
        </div>
      </div>
      <div className="ai-preview__section">
        <h4 className="ai-preview__section-title">Word Family ({family.words.length} words)</h4>
        <div className="ai-preview__family-words">
          {family.words.map((word, index) => (
            <label
              key={index}
              className={`ai-preview__family-word ${word.exists ? 'ai-preview__family-word--exists' : ''}`}
            >
              {onToggleItem && (
                <input
                  type="checkbox"
                  checked={selectedItems?.has(index) ?? !word.exists}
                  onChange={() => onToggleItem(index)}
                  disabled={word.exists}
                />
              )}
              <div className="ai-preview__family-word-content">
                <div className="ai-preview__family-word-header">
                  <span className="ai-preview__family-word-text">{word.word}</span>
                  <Badge variant="default" size="sm">{word.partOfSpeech}</Badge>
                  {word.exists && <Badge variant="warning" size="sm">Exists</Badge>}
                </div>
                <p className="ai-preview__family-word-def">{word.definition}</p>
                <div className="ai-preview__family-word-morphemes">
                  {word.morphemes.map((m, i) => (
                    <span key={i} className="ai-preview__family-word-morpheme">{m}</span>
                  ))}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="ai-preview-card">
      <div className="ai-preview__header">
        <h3 className="ai-preview__title">
          {type === 'morpheme-breakdown' && 'Morpheme Analysis Preview'}
          {type === 'word-suggestions' && 'Word Suggestions Preview'}
          {type === 'definition' && 'Generated Definition Preview'}
          {type === 'word-family' && 'Word Family Preview'}
        </h3>
        <Badge variant="primary">AI Generated</Badge>
      </div>

      {type === 'morpheme-breakdown' && renderMorphemeBreakdown(data as MorphemeBreakdown)}
      {type === 'word-suggestions' && renderWordSuggestions(data as WordSuggestion[])}
      {type === 'definition' && renderDefinition(data as DefinitionData)}
      {type === 'word-family' && renderWordFamily(data as WordFamilyData)}

      <div className="ai-preview__actions">
        <Button variant="ghost" onClick={onCancel} disabled={isApplying}>
          Cancel
        </Button>
        <Button onClick={onApply} isLoading={isApplying}>
          Apply to Database
        </Button>
      </div>
    </Card>
  );
}
