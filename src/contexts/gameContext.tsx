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
  deleteDate?: Date | string;
  status?: string | number;
}

interface GameData {
  gameId: number;
  media?: string;
  responses?: Response[];
}

interface Response {
  id?: number;
  value?: string;
  response?: boolean;
}

export const gameResponse: GameResponseDataToSend = {
  userId: '',
  villageId: '',
  activityId: '',
  gameType: '',
  radioSelection: '',
  status: 1,
  createDate: '',
  updateDate: '',
  deleteDate: '',
  data: [
    {
      gameId: 1,
      media: '',
      responses: [
        {
          id: 1,
          value: 'Une guitare',
        },
        {
          id: 2,
          value: 'Premiers prix : 1',
          response: true,
        },
        {
          id: 3,
          value: 'Sert a rien',
        },
        {
          id: 4,
          value: 'Deuxieme prix : 10',
          response: false,
        },
        {
          id: 5,
          value: 'derniers prix : 100',
          response: false,
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
          value: 'Premiers prix : 2',
        },
        {
          id: 3,
          value: '',
        },
        {
          id: 4,
          value: 'Deuxieme prix : 20',
        },
        {
          id: 5,
          value: 'derniers prix : 200',
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
          value: 'Premiers prix : 3',
        },
        {
          id: 3,
          value: '',
        },
        {
          id: 4,
          value: 'Deuxième prix : 30',
        },
        {
          id: 5,
          value: 'derniers prix : 300',
        },
      ],
    },
  ],
  userSelection: '',
};

export const GameContext = createContext<GameContextType | undefined>(undefined);

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

export function saveGameResponseInSessionStorage(gameResponse: GameResponseDataToSend) {
  sessionStorage.setItem('gameResponse', JSON.stringify(gameResponse));
}

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider = ({ children }: GameProviderProps) => {
  const [userSelection, setUserSelection] = useState<string>('');

  return <GameContext.Provider value={{ userSelection, setUserSelection }}>{children}</GameContext.Provider>;
};
