import { axiosRequest } from 'src/utils/axiosRequest';
import type { GameDataMonneyOrExpression } from 'types/game.type';

// TODO: changer les noms du type et de la fonction une fois que Mimique sera standardisé aussi

export async function postGameDataMonneyOrExpression(data: GameDataMonneyOrExpression): Promise<number | null | undefined> {
  const response = await axiosRequest<number>({
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
