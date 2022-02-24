import React from 'react';

import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { serializeToQueryUrl } from 'src/utils';
import type { Game, GameType } from 'types/game.type';
import type { GameResponse } from 'types/gameResponse.type';

export const useGameRequests = () => {
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);

  const getIsGameCreateBeforePlaying = React.useCallback(
    async (type: GameType) => {
      if (!village) {
        return 0;
      }
      const response = await axiosLoggedRequest({
        method: 'GET',
        url: `/games/isGameCreateBeforePlaying${serializeToQueryUrl({
          villageId: village.id,
          type,
        })}`,
      });
      if (response.error) {
        return 0;
      }
      return response.data.game as number;
    },
    [axiosLoggedRequest, village],
  );

  const getAvailableGamesCount = React.useCallback(
    async (type: GameType) => {
      if (!village) {
        return 0;
      }
      const response = await axiosLoggedRequest({
        method: 'GET',
        url: `/games/ableToPlay${serializeToQueryUrl({
          villageId: village.id,
          type,
        })}`,
      });
      if (response.error) {
        return 0;
      }
      return response.data.count as number;
    },
    [axiosLoggedRequest, village],
  );

  const getRandomGame = React.useCallback(
    async (type: GameType) => {
      if (!village) {
        return undefined;
      }
      const response = await axiosLoggedRequest({
        method: 'GET',
        url: `/games/play${serializeToQueryUrl({
          villageId: village.id,
          type,
        })}`,
      });
      if (response.error) {
        return undefined;
      }
      return response.data as Game;
    },
    [axiosLoggedRequest, village],
  );

  const sendNewGameResponse = React.useCallback(
    async (id: number, value: string) => {
      const response = await axiosLoggedRequest({
        method: 'PUT',
        url: `/games/play/${id}`,
        data: { value },
      });
      if (response.error) {
        return false;
      }
      return true;
    },
    [axiosLoggedRequest],
  );

  const getGameStats = React.useCallback(
    async (id: number) => {
      const response = await axiosLoggedRequest({
        method: 'GET',
        url: `/games/stats/${id}`,
      });
      if (response.error) {
        return [];
      }
      return response.data as GameResponse[];
    },
    [axiosLoggedRequest],
  );

  return { getIsGameCreateBeforePlaying, getAvailableGamesCount, getRandomGame, sendNewGameResponse, getGameStats };
};
