import { axiosRequest } from 'src/utils/axiosRequest';

export async function getAllActivityGames(activityId: number) {
  const path = `/getAllGamesActivity`;
  const response = await axiosRequest({
    method: 'GET',
    url: `/games${path}`,
    params: {
      activityId,
    },
  });
  return response.error ? undefined : response.data;
}
