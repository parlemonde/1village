import type { ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react';

interface GameContextType {
  userSelection: string;
  setUserSelection: (value: string) => void;
}

interface GameResponseDataToSend {
  userId: number | string | undefined;
  villageId: number | string | undefined;
  activityId?: number | string | undefined;
  gameType: string | number;
  data: GameData[];
  userSelection?: string | null;
  radioSelection?: string | null;
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
  userId: '',
  villageId: '',
  activityId: '',
  gameType: '',
  radioSelection: '',
  data: [
    {
      gameId: 1,
      media: '',
      responses: [
        {
          id: 1,
          value: 'test',
        },
        {
          id: 2,
          value: 'id2',
        },
        {
          id: 3,
          value: 'id3',
        },
        {
          id: 4,
          value: 'id4',
        },
        {
          id: 5,
          value: 'id5',
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
