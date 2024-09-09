import { useQuery } from 'react-query';

import { serializeToQueryUrl } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';
import type { GameResponseValue } from 'types/gameResponse.type';
// import { GameType } from 'types/game.type';

type GetOneGameByIdProps = {
  value: GameResponseValue;
  id: number;
};

// TODO : remove specific mimic management after mimic is standard
export async function putUpdateGameResponse({ value, id }: GetOneGameByIdProps) {
  const path = `/standardPlay/${id}${serializeToQueryUrl({
    id,
    value,
  })}`;
  const response = await axiosRequest({
    method: 'PUT',
    url: `/games${path}`,
    data: {
      value,
      id,
    },
  });
  if (response.error) {
    return false;
  }
  return true;
}

export function useUpdateGameResponse(value: GameResponseValue, id: number) {
  return useQuery(['updateResponseGame', { value, id }], () => putUpdateGameResponse({ value, id }));
}
