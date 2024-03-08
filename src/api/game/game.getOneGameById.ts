import { useQuery } from 'react-query';

import { serializeToQueryUrl } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';
import { GameType } from 'types/game.type';

type GetOneGameByIdProps = {
  subType: number;
  id: number;
};

// TODO : remove specific mimic management after mimic is standard
export async function getOneGameById({ subType, id }: GetOneGameByIdProps) {
  const path = `/standardGame/${id}${serializeToQueryUrl({
    subType,
  })}`;
  const response = await axiosRequest({
    method: 'GET',
    url: `/games${path}`,
  });
  return response.error ? undefined : response.data;
}

export function useOneGameById(subType: number, id: number) {
  return useQuery(['getOneGameById', { subType, id }], () => getOneGameById({ subType, id }));
}
