// src/components/gamification/BadgeCollection.tsx
import React, { useState } from 'react';
import { Badge } from '../../models';

interface BadgeCollectionProps {
  badges: (Omit<Badge, 'dateEarned'> & { earned: boolean; earnedDate?: Date })[];
}

const BadgeCollection: React.FC<BadgeCollectionProps> = ({ badges }) => {
  const [selectedBadge, setSelectedBadge] = useState<typeof badges[0] | null>(null);
  const [filterEarned, setFilterEarned] = useState<'all' | 'earned' | 'locked'>('all');

  // Filter badges based on selection
  const filteredBadges = badges.filter((badge: Omit<Badge, 'dateEarned'> & { earned: boolean; earnedDate?: Date }) => {
    if (filterEarned === 'all') return true;
    if (filterEarned === 'earned') return badge.earned;
    return !badge.earned; // locked
  });

  // Format date
  const formatDate = (date?: Date): string => {
    if (!date) return 'Not yet earned';

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="badge-collection">
      <div className="badge-filters">
        <button
          className={`filter-button ${filterEarned === 'all' ? 'active' : ''}`}
          onClick={() => setFilterEarned('all')}
        >
          All
        </button>
        <button
          className={`filter-button ${filterEarned === 'earned' ? 'active' : ''}`}
          onClick={() => setFilterEarned('earned')}
        >
          Earned
        </button>
        <button
          className={`filter-button ${filterEarned === 'locked' ? 'active' : ''}`}
          onClick={() => setFilterEarned('locked')}
        >
          Locked
        </button>
      </div>

      <div className="badges-grid">
        {filteredBadges.map((badge: Omit<Badge, 'dateEarned'> & { earned: boolean; earnedDate?: Date }) => (
          <div
            key={badge.id}
            className={`badge-item ${badge.earned ? 'earned' : 'locked'}`}
            onClick={() => setSelectedBadge(badge)}
          >
            <div className="badge-icon">{badge.icon}</div>
            <div className="badge-name">{badge.name}</div>
          </div>
        ))}
      </div>

      {selectedBadge && (
        <div className="badge-details">
          <div className="badge-detail-header">
            <div className="badge-detail-icon">{selectedBadge.icon}</div>
            <div className="badge-detail-info">
              <h3>{selectedBadge.name}</h3>
              <p className="badge-status">
                {selectedBadge.earned ? 'Earned on ' + formatDate(selectedBadge.earnedDate) : 'Not yet earned'}
              </p>
            </div>
            <button
              className="close-button"
              onClick={() => setSelectedBadge(null)}
            >
              ×
            </button>
          </div>

          <div className="badge-description">
            {selectedBadge.description}
          </div>

          {!selectedBadge.earned && (
            <div className="badge-hint">
              <h4>Hint</h4>
              <p>
                {selectedBadge.id === 'first_word' && "Learn your first word to earn this badge."}
                {selectedBadge.id === 'ten_words' && "Keep learning! You're on your way to 10 words."}
                {selectedBadge.id === 'fifty_words' && "A substantial vocabulary awaits. Keep going!"}
                {selectedBadge.id === 'streak_week' && "Practice every day for a week."}
                {selectedBadge.id === 'all_modes' && "Try learning with all available learning modes."}
                {selectedBadge.id === 'night_owl' && "Study between midnight and 4 AM."}
                {selectedBadge.id === 'early_bird' && "Study between 4 AM and 6 AM."}
                {selectedBadge.id === 'perfect_day' && "Get all your reviews correct in a single day."}
              </p>
            </div>
          )}
        </div>
      )}

      {filteredBadges.length === 0 && (
        <div className="no-badges">
          {filterEarned === 'earned'
            ? "You haven't earned any badges yet. Keep learning!"
            : "No badges match your current filter."}
        </div>
      )}
    </div>
  );
};

export default BadgeCollection;
