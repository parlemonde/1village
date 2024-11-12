import { axiosRequest } from 'src/utils/axiosRequest';

export async function getAllActivityGames(activityId: number) {
  const path = `/getGamesActivity`;
  const response = await axiosRequest({
    method: 'GET',
    url: `/games${path}`,
    data: activityId,
  });
  return response.error ? undefined : response.data;
}
