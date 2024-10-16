import type { ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react';
import { Card } from '@mui/material';

import { postGameDataMonneyOrExpression } from 'src/api/game/game.post';
import { GAME_FIELDS_CONFIG } from 'src/config/games/game';
import { primaryColor } from 'src/styles/variables.const';

import type { inputType, StepsTypes, GameDataMonneyOrExpression } from 'types/game.type';
import { GameType } from 'types/game.type';

type GameContextType = {
  gameConfig: Array<StepsTypes[]>;
  setGameConfig: (gameConfig: Array<StepsTypes[]>) => void;
  gameType?: GameType;
  setGameType: (gameType: GameType) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateGameConfig: (value: any, input: inputType) => void;
  inputSelectedValue?: string;
  saveDraftGrame: (data: GameDataMonneyOrExpression) => void;
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
  saveDraftGrame: (_data: GameDataMonneyOrExpression) => {},
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
  const [isGameDraftSaved, setIsGameDraftSaved] = useState(false);
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
  const saveDraftGrame = async (data: GameDataMonneyOrExpression) => {
    await postGameDataMonneyOrExpression(data);
    setIsGameDraftSaved(true);
    // Hide the popup after a timeout
    setTimeout(() => {
      setIsGameDraftSaved(false); // Hide the popup
    }, 2000); // Adjust the duration as needed
  };

  return (
    <GameContext.Provider
      value={{ saveDraftGrame, updateGameConfig, gameType, setGameType: updateGameType, gameConfig, setGameConfig, inputSelectedValue }}
    >
      {children}
      {isGameDraftSaved && (
        <div style={{ position: 'fixed', bottom: '1rem', right: '4.5rem' }}>
          <Card style={{ backgroundColor: primaryColor, color: 'white', padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center' }}>
            <p className="text text--small">Brouillon enregistré</p>
          </Card>
        </div>
      )}
    </GameContext.Provider>
  );
};
