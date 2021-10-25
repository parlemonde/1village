import className from 'classnames';
import React from 'react';

import { Navigation } from 'src/components/Navigation';
import { SubHeaders } from 'src/components/accueil/SubHeader';

interface BaseProps {
  rightNav?: React.ReactNode | React.ReactNodeArray;
  hideLeftNav?: boolean;
  showSubHeader?: boolean;
  style?: React.CSSProperties;
}

export const Base: React.FC<BaseProps> = ({
  children,
  rightNav,
  hideLeftNav = false,
  showSubHeader = false,
  style,
}: React.PropsWithChildren<BaseProps>) => {
  return (
    <>
      {!hideLeftNav && <Navigation />}
      <main
        className={className({
          'without-nav': hideLeftNav,
        })}
      >
        {showSubHeader && (
          <div className="sub-header">
            <SubHeaders />
          </div>
        )}
        {rightNav && (
          <aside
            className={className('right-navigation', {
              'right-navigation--smaller': showSubHeader,
            })}
          >
            <div>{rightNav}</div>
          </aside>
        )}
        <div
          className={className('app-content with-shadow', {
            'app-content--narrower': !!rightNav,
            'app-content--smaller': showSubHeader,
          })}
          style={style}
        >
          {children}
        </div>
      </main>
    </>
  );
};
