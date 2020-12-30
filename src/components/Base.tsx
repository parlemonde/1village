import React from "react";

import { Header } from "./Header";
import { Menu } from "./Menu";

interface BaseProps {
  children: React.ReactNode | React.ReactNodeArray;
}

export const Base: React.FC<BaseProps> = ({ children }: BaseProps) => {
  return (
    <div className="AppContainer">
      <Header />
      <Menu />
      <main>
        <div className="AppContent">{children}</div>
      </main>
    </div>
  );
};
