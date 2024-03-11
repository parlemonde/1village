import { useQuery } from 'react-query';

import { serializeToQueryUrl } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';

type GetCountAbleToPlayStandardGameProps = {
  subType: number;
  villageId: number;
};

export async function getCountAbleToPlayStandardGame({ subType, villageId }: GetCountAbleToPlayStandardGameProps) {
  const path = `countAbleToPlayStandardGame${serializeToQueryUrl({
    subType,
    villageId,
  })}`;
  const response = await axiosRequest({
    method: 'GET',
    url: `/games/${path}`,
  });
  return response.error ? undefined : response.data.count;
}

export function useCountAbleToPlayStandardGame(subType: number, villageId: number) {
  return useQuery(['countAbleToPlay', { subType, villageId }], () => getCountAbleToPlayStandardGame({ subType, villageId }));
}
