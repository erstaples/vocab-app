// src/components/common/Badge.tsx
import React from 'react';
import { Badge as BadgeModel } from '../../models';

interface BadgeProps {
  badge: Omit<BadgeModel, 'dateEarned'> & { earned?: boolean };
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  showTooltip?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  badge,
  size = 'medium',
  onClick,
  showTooltip = false
}) => {
  const { name, description, icon, earned = false } = badge;

  return (
    <div
      className={`
        badge-display 
        badge-${size} 
        ${earned ? 'badge-earned' : 'badge-locked'}
        ${onClick ? 'badge-clickable' : ''}
      `}
      onClick={onClick}
    >
      <div className="badge-icon">
        {icon}
      </div>

      {size !== 'small' && (
        <div className="badge-name">
          {name}
        </div>
      )}

      {showTooltip && (
        <div className="badge-tooltip">
          <div className="badge-tooltip-content">
            <h4>{name}</h4>
            <p>{description}</p>
            <p className="badge-status">
              {earned ? 'Earned' : 'Not yet earned'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Badge;