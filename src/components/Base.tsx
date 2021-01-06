import className from "classnames";
import React from "react";

import { Header } from "./Header";
import { Navigation } from "./Navigation";

interface BaseProps {
  children: React.ReactNode | React.ReactNodeArray;
  rightNav?: React.ReactNode | React.ReactNodeArray;
  subHeader?: React.ReactNode | React.ReactNodeArray;
}

export const Base: React.FC<BaseProps> = ({ children, rightNav, subHeader }: BaseProps) => {
  return (
    <div className="app-container">
      <Header />
      <Navigation />
      <main>
        {subHeader && <div className="sub-header">{subHeader}</div>}
        {rightNav && (
          <aside
            className={className("right-navigation", {
              "right-navigation--smaller": !!subHeader,
            })}
          >
            <div>{rightNav}</div>
          </aside>
        )}
        <div
          className={className("app-content with-shadow", {
            "app-content--narrower": !!rightNav,
            "app-content--smaller": !!subHeader,
          })}
        >
          {children}
        </div>
      </main>
    </div>
  );
};
