import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

interface MouseTrackerProps {
  children: ReactNode;
  isVisible: boolean;
}

const MouseTracker = ({ children, isVisible }: MouseTrackerProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        padding: '1rem 2rem',
        display: isVisible ? 'block' : 'none',
        background: 'white',
        boxShadow: 'rgba(101, 106, 110, 0.2) 0px 8px 24px',
        transform: `translate(${position.x}px, ${position.y + 150}px)`,
        pointerEvents: 'none',
        borderRadius: '.25rem',
      }}
    >
      {children}
    </div>
  );
};

export default MouseTracker;
