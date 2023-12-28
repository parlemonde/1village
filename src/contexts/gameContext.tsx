import type { ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react';

interface GameContextType {
  userSelection: string;
  setUserSelection: (message: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider = ({ children }: GameProviderProps) => {
  const [userSelection, setUserSelection] = useState<string>('');

  return <GameContext.Provider value={{ userSelection, setUserSelection }}>{children}</GameContext.Provider>;
};
