import React from 'react';

interface MouseTrackerProps {
  children: React.ReactNode;
  offset?: { x: number; y: number };
  isVisible: boolean;
}

const MouseTracker = ({ children, offset = { x: 15, y: 15 }, isVisible }: MouseTrackerProps) => {
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
        position: 'fixed',
        top: 0,
        left: 0,
        padding: '0.5rem 1rem',
        display: isVisible ? 'block' : 'none',
        background: 'white',
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        zIndex: 1000,
        borderRadius: '4px',
        fontSize: '0.875rem',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </div>
  );
};

export default MouseTracker;
