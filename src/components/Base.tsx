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

export const Base = ({ children, rightNav, hideLeftNav = false, showSubHeader = false, style }: React.PropsWithChildren<BaseProps>) => {
  return (
    <>
      {!hideLeftNav && <Navigation />}
      <main
        className={className({
          'without-nav': hideLeftNav,
        })}
      >
        <div className={className('app-content', { 'app-content--with-subheader': showSubHeader })} style={style}>
          {showSubHeader && (
            <div className="app-content__sub-header">
              <SubHeaders />
            </div>
          )}
          <div className="app-content__card with-shadow">{children}</div>
        </div>
        {rightNav && <aside className="right-navigation">{rightNav}</aside>}
      </main>
    </>
  );
};
