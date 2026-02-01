import React from 'react';
import './Badge.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}: BadgeProps) {
  const classes = ['badge', `badge--${variant}`, `badge--${size}`, className]
    .filter(Boolean)
    .join(' ');

  return <span className={classes}>{children}</span>;
}

interface AchievementBadgeProps {
  name: string;
  description: string;
  iconUrl?: string;
  earned?: boolean;
  earnedAt?: Date;
  className?: string;
}

export function AchievementBadge({
  name,
  description,
  iconUrl,
  earned = false,
  earnedAt,
  className = '',
}: AchievementBadgeProps) {
  const classes = ['achievement-badge', earned && 'achievement-badge--earned', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <div className="achievement-badge__icon">
        {iconUrl ? (
          <img src={iconUrl} alt={name} />
        ) : (
          <span className="achievement-badge__icon-placeholder">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="achievement-badge__content">
        <h4 className="achievement-badge__name">{name}</h4>
        <p className="achievement-badge__description">{description}</p>
        {earned && earnedAt && (
          <span className="achievement-badge__date">
            Earned {new Date(earnedAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}
