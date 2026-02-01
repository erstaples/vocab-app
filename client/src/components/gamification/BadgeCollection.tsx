import React from 'react';
import type { Badge, UserBadge } from '@vocab-builder/shared';
import { AchievementBadge } from '../common/Badge';
import './BadgeCollection.css';

interface BadgeCollectionProps {
  badges: Badge[];
  earnedBadges: UserBadge[];
  showUnearned?: boolean;
}

export function BadgeCollection({
  badges,
  earnedBadges,
  showUnearned = true,
}: BadgeCollectionProps) {
  const earnedBadgeIds = new Set(earnedBadges.map(eb => eb.badgeId));

  const earnedBadgeMap = new Map(
    earnedBadges.map(eb => [eb.badgeId, eb.earnedAt])
  );

  const displayBadges = showUnearned
    ? badges
    : badges.filter(b => earnedBadgeIds.has(b.id));

  const earnedCount = earnedBadges.length;
  const totalCount = badges.length;

  return (
    <div className="badge-collection">
      <div className="badge-collection__header">
        <h3 className="badge-collection__title">Badges</h3>
        <span className="badge-collection__count">
          {earnedCount} / {totalCount} earned
        </span>
      </div>
      <div className="badge-collection__grid">
        {displayBadges.map(badge => (
          <AchievementBadge
            key={badge.id}
            name={badge.name}
            description={badge.description}
            iconUrl={badge.iconUrl}
            earned={earnedBadgeIds.has(badge.id)}
            earnedAt={earnedBadgeMap.get(badge.id)}
          />
        ))}
      </div>
      {displayBadges.length === 0 && (
        <p className="badge-collection__empty">No badges earned yet. Keep learning!</p>
      )}
    </div>
  );
}
