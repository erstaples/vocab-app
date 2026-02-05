import React, { useState, useRef } from 'react';
import { Badge } from '../common';
import type { Morpheme } from '@vocab-builder/shared';
import './MorphemeChip.css';

interface MorphemeChipProps {
  morpheme: Morpheme;
  allMorphemes: Morpheme[]; // To look up canonical morpheme for variants
  size?: 'sm' | 'md' | 'lg';
  showMeaning?: boolean;
  onClick?: () => void;
  children?: React.ReactNode; // For action buttons
}

export function MorphemeChip({
  morpheme,
  allMorphemes,
  size = 'sm',
  showMeaning = false,
  onClick,
  children,
}: MorphemeChipProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const chipRef = useRef<HTMLDivElement>(null);

  const isVariant = morpheme.canonicalId != null;
  const canonicalMorpheme = isVariant
    ? allMorphemes.find(m => m.id === morpheme.canonicalId)
    : null;

  // Variants get 'warning' (amber), otherwise use type-based colors
  const getBadgeVariant = (): 'primary' | 'success' | 'secondary' | 'warning' => {
    if (isVariant) return 'warning';
    switch (morpheme.type) {
      case 'prefix': return 'primary';
      case 'root': return 'success';
      case 'suffix': return 'secondary';
    }
  };

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowTooltip(false);
  };

  return (
    <div
      ref={chipRef}
      className={`morpheme-chip ${onClick ? 'morpheme-chip--clickable' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <Badge variant={getBadgeVariant()} size={size}>
        {morpheme.morpheme}
      </Badge>
      {showMeaning && (
        <span className="morpheme-chip__meaning">"{morpheme.meaning}"</span>
      )}
      {children}

      {showTooltip && (
        <div className="morpheme-chip__tooltip">
          <div className="morpheme-chip__tooltip-header">
            <span className="morpheme-chip__tooltip-morpheme">{morpheme.morpheme}</span>
            <span className="morpheme-chip__tooltip-type">{morpheme.type}</span>
          </div>
          <div className="morpheme-chip__tooltip-meaning">"{morpheme.meaning}"</div>
          {morpheme.origin && (
            <div className="morpheme-chip__tooltip-origin">Origin: {morpheme.origin}</div>
          )}
          {isVariant && canonicalMorpheme && (
            <div className="morpheme-chip__tooltip-variant">
              <em>Variant of</em> <strong>{canonicalMorpheme.morpheme}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
