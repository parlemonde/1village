import { useCallback, useContext } from 'react';

import { VillageContext } from 'src/contexts/villageContext';
import { serializeToQueryUrl } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';
import type { Game, GameType } from 'types/game.type';
import type { GameResponse } from 'types/gameResponse.type';

export const useGameRequests = () => {
  const { village } = useContext(VillageContext);

  /**
   * Return all games by type or games by type and user id from village
   *
   * @param type - type of game
   * @param villageId - id of village
   * @param userId - indicate self to retrieve all games from user by type - optional
   *
   * @returns games
   *
   */
  const getUserCreatedGamesCount = useCallback(
    async (type: GameType, userId?: 'self') => {
      if (!village) {
        return 0;
      }
      const response = await axiosRequest({
        method: 'GET',
        url: `/games${serializeToQueryUrl({
          type,
          villageId: village.id,
          userId,
        })}`,
      });
      if (response.error) {
        return 0;
      }
      return (response.data as Array<Game>).length;
    },
    [village],
  );

  /**
   * Return all games by type
   *
   * @param type - type of game
   *
   * @returns Array<Game>
   *
   */

  const getAllGamesByType = useCallback(
    async (type: GameType) => {
      if (!village) {
        return [] as Array<Game>;
      }
      const response = await axiosRequest({
        method: 'GET',
        url: `/games${serializeToQueryUrl({
          type,
          villageId: village.id,
        })}`,
      });
      if (response.error) {
        return [] as Array<Game>;
      }
      return response.data as Array<Game>;
    },
    [village],
  );

  /**
   * Return number of games available to play
   *
   * @param type - type of game
   * @param villageId - id of village
   *
   * @returns count
   *
   */

  const getAvailableGamesCount = useCallback(
    async (type: GameType) => {
      if (!village) {
        return 0;
      }
      const response = await axiosRequest({
        method: 'GET',
        url: `/games/ableToPlayStandardGame${serializeToQueryUrl({
          villageId: village.id,
          type,
        })}`,
      });
      if (response.error) {
        return 0;
      }
      return response.data.games.length as number;
    },
    [village],
  );

  /**
   * Return number of games available to play
   *
   * @param type - type of game
   * @param villageId - id of village
   *
   * @returns response
   *
   */
  const getAvailableGames = useCallback(
    async (type: GameType) => {
      if (!village) {
        return [] as Array<Game>;
      }
      const response = await axiosRequest({
        method: 'GET',
        url: `/games/ableToPlayStandardGame${serializeToQueryUrl({
          subType: type,
          villageId: village.id,
        })}`,
      });
      if (response.error) {
        return [] as Array<Game>;
      }
      return response.data.activities as Array<Game>;
    },
    [village],
  );

  /**
   * Return of a random game
   *
   * @param type - type of game
   * @param villageId - id of village
   *
   * @returns Game
   *
   */

  const getRandomGame = useCallback(
    async (type: GameType) => {
      if (!village) {
        return undefined;
      }

      const response = await axiosRequest({
        method: 'GET',
        url: `/games/playStandard${serializeToQueryUrl({
          villageId: village.id,
          type,
        })}`,
      });

      if (response.error) {
        return undefined;
      }
      return response.data as Game;
    },
    [village],
  );

  /**
   * Send a response for game
   *
   * @param id - id of game
   * @param value - value of the response
   *
   * @returns boolean
   *
   */

  const sendNewGameResponse = useCallback(async (id: number, value: string, villageId: number) => {
    const response = await axiosRequest({
      method: 'PUT',
      url: `/games/play/${id}`,
      data: { value, villageId },
    });
    if (response.error) {
      return false;
    }
    return true;
  }, []);

  /**
   * Update isOldGame column when all games are played
   *
   * @returns boolean
   */

  const resetGamesPlayedForUser = async () => {
    const response = await axiosRequest({
      method: 'PUT',
      url: `/games/resetResponses`,
    });
    if (response.error) {
      return false;
    }
    return true;
  };

  /**
   * Return stats game
   *
   * @param id - id type of game
   *
   * @returns GameResponse[]
   *
   */
  const getGameStats = useCallback(async (id: number) => {
    const response = await axiosRequest({
      method: 'GET',
      url: `/games/stats/${id}`,
    });
    if (response.error) {
      return [];
    }
    return response.data as GameResponse[];
  }, []);

  return {
    getUserCreatedGamesCount,
    getAllGamesByType,
    getAvailableGamesCount,
    getAvailableGames,
    getRandomGame,
    sendNewGameResponse,
    resetGamesPlayedForUser: resetGamesPlayedForUser,
    getGameStats,
  };
};
