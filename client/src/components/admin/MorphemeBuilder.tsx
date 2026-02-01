import React, { useState, useEffect } from 'react';
import { Badge, Button, Input } from '../common';
import type { Morpheme, MorphemeType } from '@vocab-builder/shared';
import './MorphemeBuilder.css';

interface MorphemeWithPosition {
  id: number;
  morpheme: string;
  type: MorphemeType;
  meaning: string;
  position: number;
}

interface MorphemeBuilderProps {
  word: string;
  selectedMorphemes: MorphemeWithPosition[];
  availableMorphemes: Morpheme[];
  onChange: (morphemes: MorphemeWithPosition[]) => void;
  isLoading?: boolean;
}

export function MorphemeBuilder({
  word,
  selectedMorphemes,
  availableMorphemes,
  onChange,
  isLoading = false,
}: MorphemeBuilderProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<MorphemeType | 'all'>('all');

  const filteredMorphemes = availableMorphemes.filter(m => {
    const matchesSearch = m.morpheme.toLowerCase().includes(search.toLowerCase()) ||
                         m.meaning.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || m.type === typeFilter;
    const notSelected = !selectedMorphemes.some(sm => sm.id === m.id);
    return matchesSearch && matchesType && notSelected;
  });

  const handleAddMorpheme = (morpheme: Morpheme) => {
    const newPosition = selectedMorphemes.length;
    onChange([
      ...selectedMorphemes,
      { ...morpheme, position: newPosition },
    ]);
  };

  const handleRemoveMorpheme = (id: number) => {
    const updated = selectedMorphemes
      .filter(m => m.id !== id)
      .map((m, index) => ({ ...m, position: index }));
    onChange(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...selectedMorphemes];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    onChange(updated.map((m, i) => ({ ...m, position: i })));
  };

  const handleMoveDown = (index: number) => {
    if (index === selectedMorphemes.length - 1) return;
    const updated = [...selectedMorphemes];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    onChange(updated.map((m, i) => ({ ...m, position: i })));
  };

  const getTypeColor = (type: MorphemeType): 'primary' | 'secondary' | 'success' => {
    switch (type) {
      case 'prefix': return 'primary';
      case 'root': return 'success';
      case 'suffix': return 'secondary';
    }
  };

  return (
    <div className="morpheme-builder">
      <div className="morpheme-builder__word">
        <span className="morpheme-builder__label">Word:</span>
        <span className="morpheme-builder__word-text">{word}</span>
      </div>

      <div className="morpheme-builder__selected">
        <span className="morpheme-builder__label">Morpheme Breakdown:</span>
        <div className="morpheme-builder__selected-list">
          {selectedMorphemes.length === 0 ? (
            <span className="morpheme-builder__empty">No morphemes selected. Add morphemes from the list below.</span>
          ) : (
            selectedMorphemes
              .sort((a, b) => a.position - b.position)
              .map((morpheme, index) => (
                <div key={morpheme.id} className="morpheme-builder__selected-item">
                  <div className="morpheme-builder__selected-content">
                    <Badge variant={getTypeColor(morpheme.type)} size="sm">
                      {morpheme.type}
                    </Badge>
                    <span className="morpheme-builder__selected-text">{morpheme.morpheme}</span>
                    <span className="morpheme-builder__selected-meaning">({morpheme.meaning})</span>
                  </div>
                  <div className="morpheme-builder__selected-actions">
                    <button
                      type="button"
                      className="morpheme-builder__move-btn"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      title="Move up"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 15l-6-6-6 6" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="morpheme-builder__move-btn"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === selectedMorphemes.length - 1}
                      title="Move down"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="morpheme-builder__remove-btn"
                      onClick={() => handleRemoveMorpheme(morpheme.id)}
                      title="Remove"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      <div className="morpheme-builder__preview">
        <span className="morpheme-builder__label">Preview:</span>
        <div className="morpheme-builder__preview-display">
          {selectedMorphemes.length === 0 ? (
            <span className="morpheme-builder__preview-empty">{word}</span>
          ) : (
            selectedMorphemes
              .sort((a, b) => a.position - b.position)
              .map((m, index) => (
                <span
                  key={m.id}
                  className={`morpheme-builder__preview-part morpheme-builder__preview-part--${m.type}`}
                >
                  {m.morpheme}
                  {index < selectedMorphemes.length - 1 && (
                    <span className="morpheme-builder__preview-separator">-</span>
                  )}
                </span>
              ))
          )}
        </div>
      </div>

      <div className="morpheme-builder__picker">
        <span className="morpheme-builder__label">Add Morphemes:</span>
        <div className="morpheme-builder__filters">
          <Input
            placeholder="Search morphemes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="morpheme-builder__type-filters">
            {(['all', 'prefix', 'root', 'suffix'] as const).map(type => (
              <button
                key={type}
                type="button"
                className={`morpheme-builder__type-btn ${typeFilter === type ? 'morpheme-builder__type-btn--active' : ''}`}
                onClick={() => setTypeFilter(type)}
              >
                {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="morpheme-builder__available-list">
          {isLoading ? (
            <span className="morpheme-builder__loading">Loading morphemes...</span>
          ) : filteredMorphemes.length === 0 ? (
            <span className="morpheme-builder__no-results">No morphemes found</span>
          ) : (
            filteredMorphemes.slice(0, 20).map(morpheme => (
              <button
                key={morpheme.id}
                type="button"
                className="morpheme-builder__available-item"
                onClick={() => handleAddMorpheme(morpheme)}
              >
                <Badge variant={getTypeColor(morpheme.type)} size="sm">
                  {morpheme.type}
                </Badge>
                <span className="morpheme-builder__available-text">{morpheme.morpheme}</span>
                <span className="morpheme-builder__available-meaning">{morpheme.meaning}</span>
              </button>
            ))
          )}
          {filteredMorphemes.length > 20 && (
            <span className="morpheme-builder__more">
              +{filteredMorphemes.length - 20} more. Refine your search to see them.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
