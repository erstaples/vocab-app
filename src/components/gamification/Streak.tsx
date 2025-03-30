// src/components/gamification/Streak.tsx
import React from 'react';

interface StreakProps {
  count: number;
  size?: 'small' | 'medium' | 'large';
}

const Streak: React.FC<StreakProps> = ({ count, size = 'medium' }) => {
  // Determine visual representation based on streak length
  const getStreakEmoji = (count: number): string => {
    if (count === 0) return '💤';
    if (count < 3) return '🔥';
    if (count < 7) return '🔥🔥';
    if (count < 14) return '🔥🔥🔥';
    if (count < 30) return '⚡🔥⚡';
    if (count < 60) return '🌋';
    if (count < 100) return '☄️';
    return '🏆';
  };

  // Determine streak message
  const getStreakMessage = (count: number): string => {
    if (count === 0) return 'Start your streak today!';
    if (count === 1) return 'First day!';
    if (count < 7) return 'Keep it going!';
    if (count < 14) return 'One week! Incredible!';
    if (count < 30) return 'Strong momentum!';
    if (count < 60) return 'One month! Amazing!';
    if (count < 100) return 'Unstoppable!';
    return 'Legendary streak!';
  };

  return (
    <div className={`streak-container ${size}`}>
      <div className="streak-icon">
        {getStreakEmoji(count)}
      </div>
      <div className="streak-info">
        <div className="streak-count">
          {count} {count === 1 ? 'Day' : 'Days'}
        </div>
        <div className="streak-message">
          {getStreakMessage(count)}
        </div>
      </div>
    </div>
  );
};

export default Streak;