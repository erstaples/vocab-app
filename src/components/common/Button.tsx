// src/components/common/Button.tsx
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  icon,
  onClick,
  className = '',
}) => {
  return (
    <button
      className={`
        button 
        button-${variant} 
        button-${size} 
        ${fullWidth ? 'button-full-width' : ''} 
        ${disabled ? 'button-disabled' : ''} 
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="button-icon">{icon}</span>}
      <span className="button-text">{children}</span>
    </button>
  );
};

export default Button;