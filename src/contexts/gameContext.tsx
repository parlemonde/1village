import type { ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react';

import type { inputType, StepsTypes } from 'src/config/games/game';
import { GAME_FIELDS_CONFIG } from 'src/config/games/game';
import { GameType } from 'types/game.type';

type GameContextType = {
  gameConfig: Array<StepsTypes[]>;
  setGameConfig: (gameConfig: Array<StepsTypes[]>) => void;
  gameType?: GameType;
  setGameType: (gameType: GameType) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateGameConfig: (value: any, input: inputType) => void;
  inputSelectedValue?: string;
};

export const GameContext = createContext<GameContextType>({
  gameConfig: [],
  setGameConfig: () => {},
  gameType: GameType.MIMIC,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setGameType: (_gameType: GameType) => {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  updateGameConfig: (_value: any, _input: inputType) => {},
  inputSelectedValue: '',
});

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const saveGameResponseInSessionStorage = (gameConfig: any) => {
  localStorage.setItem('gameConfig', JSON.stringify(gameConfig));
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider = ({ children }: GameProviderProps) => {
  const [gameType, setGameType] = useState<GameType>(GameType.MIMIC);
  const [gameConfig, setGameConfig] = useState<Array<StepsTypes[]>>(GAME_FIELDS_CONFIG[gameType].steps);
  const inputSelectedValue = gameConfig[0]?.[0]?.inputs?.[0]?.selectedValue;

  const updateGameType = (type: GameType) => {
    setGameType(type);
    setGameConfig(GAME_FIELDS_CONFIG[type].steps);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateGameConfig = (value: any, input: inputType) => {
    let inputToCompare: inputType = {} as inputType;
    const configCopy = [...gameConfig];

    configCopy.map((page) =>
      page.map((step) =>
        step.inputs?.map((inp) => {
          if (inp.id === input.id) {
            inputToCompare = inp;
            inputToCompare.selectedValue = value;
          }
        }),
      ),
    );
    setGameConfig(configCopy);
    saveGameResponseInSessionStorage(configCopy);
  };

  return (
    <GameContext.Provider value={{ updateGameConfig, gameType, setGameType: updateGameType, gameConfig, setGameConfig, inputSelectedValue }}>
      {children}
    </GameContext.Provider>
  );
};
