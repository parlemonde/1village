import React from 'react';

/**
 * Container to handle overflow
 * @param children JSX Element children
 * @returns
 */

interface ContainerProps {
  style?: React.CSSProperties;
}

function OverflowContainer({ children, style }: React.PropsWithChildren<ContainerProps>) {
  return (
    <div className="scrollbar" style={{ ...style }}>
      {children}
    </div>
  );
}

export default OverflowContainer;
