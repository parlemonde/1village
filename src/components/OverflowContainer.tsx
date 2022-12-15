import React from 'react';

/**
 * Container with overflow
 * @param children JSX Element children
 * @returns
 */

interface ContainerProps {
  height?: number;
}

function OverflowContainer({ children, height }: React.PropsWithChildren<ContainerProps>) {
  return (
    <div className="scrollbar" style={{ height: height ?? '30vh', overflowY: 'scroll' }}>
      {children}
    </div>
  );
}

export default OverflowContainer;
