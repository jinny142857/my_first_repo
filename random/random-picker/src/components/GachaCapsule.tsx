import React, { useMemo } from 'react';
import confetti from 'canvas-confetti';
import styles from './GachaCapsule.module.css';

interface GachaCapsuleProps {
  id: string;
  name: string;
  isOpened: boolean;
  onOpen: (id: string) => void;
  delayIndex: number;
}

const COLORS = [
  { top: '#ef4444', bottom: '#b91c1c' }, // Red
  { top: '#3b82f6', bottom: '#1d4ed8' }, // Blue
  { top: '#10b981', bottom: '#047857' }, // Green
  { top: '#f59e0b', bottom: '#b45309' }, // Yellow
  { top: '#8b5cf6', bottom: '#5b21b6' }, // Purple
  { top: '#ec4899', bottom: '#be185d' }, // Pink
];

export const GachaCapsule: React.FC<GachaCapsuleProps> = ({ id, name, isOpened, onOpen, delayIndex }) => {
  // Randomly assign a color to the capsule
  const colors = useMemo(() => COLORS[Math.floor(Math.random() * COLORS.length)], []);

  const customStyle = {
    '--capsule-color-top': colors.top,
    '--capsule-color-bottom': colors.bottom,
    animationDelay: `${delayIndex * 0.15}s`
  } as React.CSSProperties;

  return (
    <div 
      className={`${styles['capsule-container']} ${isOpened ? styles['is-opened'] : ''}`}
      style={customStyle}
      onClick={(e) => {
        if (!isOpened) {
          onOpen(id);
          
          // Get coordinates of the click to burst confetti from that spot
          const rect = e.currentTarget.getBoundingClientRect();
          const x = (rect.left + rect.width / 2) / window.innerWidth;
          const y = (rect.top + rect.height / 2) / window.innerHeight;
          
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { x, y },
            colors: [colors.top, colors.bottom, '#ffffff', '#f43f5e']
          });
        }
      }}
    >
      <div className={styles['capsule-inner']}>
        <div className={styles['capsule-front']}>
          {/* Front face with ? */}
        </div>
        <div className={styles['capsule-back']}>
          {/* Back face with Name */}
          {isOpened && (
            <div 
              className={styles['result-name']}
              style={{ fontSize: name.length > 3 ? '1.2rem' : '1.5rem' }}
            >
              {name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
