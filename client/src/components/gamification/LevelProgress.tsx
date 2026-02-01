import React from 'react';
import { LEVEL_THRESHOLDS } from '@vocab-builder/shared';
import { ProgressBar } from '../common/ProgressBar';
import './LevelProgress.css';

interface LevelProgressProps {
  level: number;
  totalXp: number;
  showDetails?: boolean;
}

export function LevelProgress({ level, totalXp, showDetails = true }: LevelProgressProps) {
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const xpInCurrentLevel = totalXp - currentThreshold;
  const xpNeededForLevel = nextThreshold - currentThreshold;
  const progress = Math.min(100, (xpInCurrentLevel / xpNeededForLevel) * 100);

  const isMaxLevel = level >= LEVEL_THRESHOLDS.length;

  return (
    <div className="level-progress">
      <div className="level-progress__header">
        <div className="level-progress__badge">
          <span className="level-progress__level">{level}</span>
        </div>
        {showDetails && (
          <div className="level-progress__info">
            <span className="level-progress__title">Level {level}</span>
            {!isMaxLevel && (
              <span className="level-progress__xp">
                {xpInCurrentLevel.toLocaleString()} / {xpNeededForLevel.toLocaleString()} XP
              </span>
            )}
            {isMaxLevel && <span className="level-progress__xp">Max Level!</span>}
          </div>
        )}
      </div>
      {!isMaxLevel && (
        <div className="level-progress__bar">
          <ProgressBar value={progress} max={100} variant="primary" size="md" />
        </div>
      )}
    </div>
  );
}
