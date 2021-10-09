import className from 'classnames';
import React from 'react';

interface BaseProps {
  rightNav?: React.ReactNode | React.ReactNodeArray;
  subHeader?: React.ReactNode | React.ReactNodeArray;
  style?: React.CSSProperties;
}

export const Base: React.FC<BaseProps> = ({ children, rightNav, subHeader, style }: React.PropsWithChildren<BaseProps>) => {
  return (
    <main>
      {subHeader && <div className="sub-header">{subHeader}</div>}
      {rightNav && (
        <aside
          className={className('right-navigation', {
            'right-navigation--smaller': !!subHeader,
          })}
        >
          <div>{rightNav}</div>
        </aside>
      )}
      <div
        className={className('app-content with-shadow', {
          'app-content--narrower': !!rightNav,
          'app-content--smaller': !!subHeader,
        })}
        style={style}
      >
        {children}
      </div>
    </main>
  );
};
