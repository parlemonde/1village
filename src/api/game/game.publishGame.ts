import { axiosRequest } from 'src/utils/axiosRequest';

export async function publishCreatedGames(activityId: number | null): Promise<string> {
  const path = `/publishGame`;
  const response = await axiosRequest<string>({
    method: 'PUT',
    url: `/games${path}`,
    data: { activityId },
  });
  if (response.error) {
    throw new Error('Erreur lors de la publication du jeu. Veuillez réessayer.');
  }
  return response.data;
}
