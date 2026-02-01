import React, { useEffect, useState } from 'react';
import type { WordFamily } from '@vocab-builder/shared';
import { api } from '../../api/client';
import { WordFamilyCard } from './WordFamilyCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import './WordFamiliesList.css';

interface WordFamiliesListProps {
  onWordClick?: (wordId: number) => void;
}

export function WordFamiliesList({ onWordClick }: WordFamiliesListProps) {
  const [families, setFamilies] = useState<WordFamily[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFamilies() {
      try {
        const response = await api.get<WordFamily[]>('/morphemes/families');
        setFamilies(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load word families');
      } finally {
        setIsLoading(false);
      }
    }

    fetchFamilies();
  }, []);

  if (isLoading) {
    return (
      <div className="word-families-list__loading">
        <LoadingSpinner />
        <p>Loading word families...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="word-families-list__error">
        <p>{error}</p>
      </div>
    );
  }

  if (families.length === 0) {
    return (
      <div className="word-families-list__empty">
        <p>No word families found.</p>
      </div>
    );
  }

  // Calculate total words across all families
  const totalWords = families.reduce((sum, f) => sum + f.wordCount, 0);

  return (
    <div className="word-families-list">
      <div className="word-families-list__header">
        <div className="word-families-list__stats">
          <div className="word-families-list__stat">
            <span className="word-families-list__stat-value">{families.length}</span>
            <span className="word-families-list__stat-label">Root Families</span>
          </div>
          <div className="word-families-list__stat">
            <span className="word-families-list__stat-value">{totalWords}</span>
            <span className="word-families-list__stat-label">Connected Words</span>
          </div>
        </div>
        <p className="word-families-list__intro">
          Words that share a root are part of the same family. Learning one root unlocks understanding of many words.
        </p>
      </div>

      <div className="word-families-list__grid">
        {families.map((family) => (
          <WordFamilyCard
            key={family.root.id}
            family={family}
            onWordClick={onWordClick}
          />
        ))}
      </div>
    </div>
  );
}
