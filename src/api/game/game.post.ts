import { axiosRequest } from 'src/utils/axiosRequest';
import type { GameDataMonneyOrExpression, GameData } from 'types/game.type';

export interface PostGameResponse {
  activityId: number;
  games: Array<GameData>;
}
export async function postGameDataMonneyOrExpression(data: GameDataMonneyOrExpression): Promise<PostGameResponse> {
  const response = await axiosRequest<PostGameResponse>({
    method: 'POST',
    url: '/games/standardGame',
    data,
  });
  if (response.error) {
    throw new Error('Erreur lors de la création du jeu. Veuillez réessayer.');
  }
  // inviladate le cache de la liste des jeux
  return response.data;
}
