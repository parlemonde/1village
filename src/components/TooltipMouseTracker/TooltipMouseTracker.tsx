import React, { useState, useEffect } from 'react';

interface MouseTrackerProps {
  children: React.ReactNode;
  offset?: { x: number; y: number };
}

const MouseTracker = ({ children, offset = { x: -750, y: -250 } }: MouseTrackerProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX + offset.x,
        y: e.clientY + offset.y,
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [offset.x, offset.y]);

  return (
    <div
      className="mouse-tracker"
      style={{
        position: 'absolute',
        padding: '2rem',
        background: 'white',
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none', // This ensures the div does not interfere with mouse events
      }}
    >
      {children}
    </div>
  );
};

export default MouseTracker;
