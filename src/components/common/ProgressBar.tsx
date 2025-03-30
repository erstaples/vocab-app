// src/components/common/ProgressBar.tsx
import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  labelPosition?: 'inside' | 'outside';
  labelFormat?: (progress: number) => string;
  animated?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  variant = 'primary',
  size = 'medium',
  showLabel = false,
  labelPosition = 'outside',
  labelFormat,
  animated = false,
  className = ''
}) => {
  // Normalize progress to be between 0 and 100
  const normalizedProgress = Math.min(100, Math.max(0, progress));

  // Format label
  const getLabel = () => {
    if (labelFormat) {
      return labelFormat(normalizedProgress);
    }
    return `${Math.round(normalizedProgress)}%`;
  };

  return (
    <div className={`progress-container progress-${size} ${className}`}>
      {showLabel && labelPosition === 'outside' && (
        <div className="progress-label progress-label-outside">
          {getLabel()}
        </div>
      )}

      <div className={`progress-bar-container progress-${variant}`}>
        <div
          className={`progress-bar-fill ${animated ? 'progress-animated' : ''}`}
          style={{ width: `${normalizedProgress}%` }}
        >
          {showLabel && labelPosition === 'inside' && (
            <div className="progress-label progress-label-inside">
              {getLabel()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;