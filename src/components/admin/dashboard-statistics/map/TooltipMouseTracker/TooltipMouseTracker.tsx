import React from 'react';

interface MouseTrackerProps {
  children?: React.ReactNode;
  offset?: { x: number; y: number };
  isVisible: boolean;
}

const MouseTracker = ({ children, offset = { x: 0, y: 0 }, isVisible }: MouseTrackerProps) => {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
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
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        padding: '1rem 2rem',
        display: isVisible ? 'block' : 'none',
        background: 'white',
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
      }}
    >
      {children}
    </div>
  );
};

export default MouseTracker;
