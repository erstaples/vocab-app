// src/components/common/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className = '',
  onClick,
  hoverable = false,
  footer
}) => {
  return (
    <div
      className={`
        card 
        ${hoverable ? 'card-hoverable' : ''} 
        ${onClick ? 'card-clickable' : ''} 
        ${className}
      `}
      onClick={onClick}
    >
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <div className="card-subtitle">{subtitle}</div>}
        </div>
      )}

      <div className="card-content">
        {children}
      </div>

      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;