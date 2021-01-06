import className from "classnames";
import React from "react";

import { Header } from "./Header";
import { Menu } from "./Menu";

interface BaseProps {
  children: React.ReactNode | React.ReactNodeArray;
  rightNav?: React.ReactNode | React.ReactNodeArray;
  topMenu?: React.ReactNode | React.ReactNodeArray;
}

export const Base: React.FC<BaseProps> = ({ children, rightNav, topMenu }: BaseProps) => {
  return (
    <div className="AppContainer">
      <Header />
      <Menu />
      <main>
        {topMenu && <div className="TopNavigation">{topMenu}</div>}
        {rightNav && (
          <aside
            className={className("RightNavigation", {
              "RightNavigation--smaller": !!topMenu,
            })}
          >
            <div>{rightNav}</div>
          </aside>
        )}
        <div
          className={className("AppContent withShadow", {
            "AppContent--narrower": !!rightNav,
            "AppContent--smaller": !!topMenu,
          })}
        >
          {children}
        </div>
      </main>
    </div>
  );
};
