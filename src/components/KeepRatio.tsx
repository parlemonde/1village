import React from 'react';

interface KeepRatioProps {
  ratio: number;
  width?: string | number;
  maxWidth?: string | number;
  minHeight?: string | number;
  className?: string;
}

export const KeepRatio: React.FC<KeepRatioProps> = ({
  width = '100%',
  maxWidth = '100%',
  minHeight = 0,
  ratio,
  className = '',
  children,
}: React.PropsWithChildren<KeepRatioProps>) => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width, maxWidth }}>
        <div style={{ width: '100%', paddingBottom: `${ratio * 100}%`, minHeight, position: 'relative' }}>
          <div className={className} style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
