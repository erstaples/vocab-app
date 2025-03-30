// src/components/gamification/Achievements.tsx
import React from 'react';
import Badge from '../common/Badge';

interface AchievementsProps {
  badges: (Omit<import('../../models').Badge, 'dateEarned'> & {
    earned: boolean;
    earnedDate?: Date
  })[];
  onViewAllClick?: () => void;
  limit?: number;
}

const Achievements: React.FC<AchievementsProps> = ({
  badges,
  onViewAllClick,
  limit = 3
}) => {
  // Sort badges: recently earned first, then unearned
  const sortedBadges = [...badges].sort((a, b) => {
    // Earned badges come first
    if (a.earned && !b.earned) return -1;
    if (!a.earned && b.earned) return 1;

    // If both earned, sort by earned date (most recent first)
    if (a.earned && b.earned) {
      if (!a.earnedDate || !b.earnedDate) return 0;
      return b.earnedDate.getTime() - a.earnedDate.getTime();
    }

    // If neither earned, keep original order
    return 0;
  });

  // Take limited number of badges
  const displayBadges = sortedBadges.slice(0, limit);

  return (
    <div className="achievements-panel">
      <div className="achievements-header">
        <h3>Recent Achievements</h3>
        {onViewAllClick && (
          <button
            className="view-all-button"
            onClick={onViewAllClick}
          >
            View All
          </button>
        )}
      </div>

      <div className="achievements-grid">
        {displayBadges.map(badge => (
          <Badge
            key={badge.id}
            badge={badge}
            size="medium"
            showTooltip
          />
        ))}

        {badges.length === 0 && (
          <div className="no-badges-message">
            No achievements yet. Complete activities to earn badges!
          </div>
        )}
      </div>

      <div className="achievements-summary">
        <span>{badges.filter(b => b.earned).length} of {badges.length} achievements earned</span>
      </div>
    </div>
  );
};

export default Achievements;