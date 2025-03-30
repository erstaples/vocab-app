// src/components/gamification/LevelProgress.tsx
import React from 'react';

interface LevelProgressProps {
  level: number;
  currentXP: number;
  nextLevelXP: number;
}

const LevelProgress: React.FC<LevelProgressProps> = ({
  level,
  currentXP,
  nextLevelXP
}) => {
  // Calculate progress percentage
  const progress = Math.min(100, (currentXP / nextLevelXP) * 100);

  return (
    <div className="level-progress">
      <div className="level-info">
        <div className="level-badge">
          <span className="level-number">{level}</span>
        </div>
        <div className="level-text">
          <span className="level-label">Level {level}</span>
          <span className="xp-text">
            {currentXP} / {nextLevelXP} XP
          </span>
        </div>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default LevelProgress;