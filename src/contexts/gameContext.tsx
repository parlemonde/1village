import type { ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react';

interface GameContextType {
  userSelection: string;
  setUserSelection: (value: string) => void;
}

interface GameResponseDataToSend {
  gameId: number | string | undefined;
  userId: number | string | undefined;
  villageId: number | string | undefined;
  activityId?: number | string | undefined;
  gameType: string | number;
  data: GameData[];
  userSelection?: string;
  createDate?: Date | string;
  updateDate?: Date | string;
}

// Dans la table activity il y a comme colonne id, type, subtype, phase, status, createDate, updateDate, deleteDate, data, content, userId, villageId, responseActivityId, responseType, isPinned, displayAsUser, isVisibleToParent

interface GameData {
  gameId: number;
  media?: string;
  responses?: Response[];
}

interface Response {
  id?: number;
  value?: string;
}

export const gameResponse: GameResponseDataToSend = {
  gameId: '',
  userId: '',
  villageId: '',
  activityId: '',
  gameType: '',
  data: [
    {
      gameId: 1,
      media: '',
      responses: [
        {
          id: 1,
          value: '',
        },
        {
          id: 2,
          value: '',
        },
        {
          id: 3,
          value: '',
        },
        {
          id: 4,
          value: '',
        },
        {
          id: 5,
          value: '',
        },
      ],
    },
    {
      gameId: 2,
      media: '',
      responses: [
        {
          id: 1,
          value: '',
        },
        {
          id: 2,
          value: '',
        },
        {
          id: 3,
          value: '',
        },
        {
          id: 4,
          value: '',
        },
        {
          id: 5,
          value: '',
        },
      ],
    },
    {
      gameId: 3,
      media: '',
      responses: [
        {
          id: 1,
          value: '',
        },
        {
          id: 2,
          value: '',
        },
        {
          id: 3,
          value: '',
        },
        {
          id: 4,
          value: '',
        },
        {
          id: 5,
          value: '',
        },
      ],
    },
  ],
  userSelection: '',
};

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
