import React, { useEffect, useState } from 'react';
import './XPNotification.css';

interface XPNotificationProps {
  xp: number;
  onComplete?: () => void;
}

export function XPNotification({ xp, onComplete }: XPNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="xp-notification">
      <span className="xp-notification__text">+{xp} XP</span>
    </div>
  );
}
