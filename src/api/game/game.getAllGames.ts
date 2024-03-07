import { useQuery } from 'react-query';

import { serializeToQueryUrl } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';

type GetCountAllStandardGameProps = {
  subType: number;
  villageId: number;
};

export async function getCountAllStandardGame({ subType, villageId }: GetCountAllStandardGameProps) {
  const path = `/allStandardGame${serializeToQueryUrl({
    subType,
    villageId,
  })}`;
  const response = await axiosRequest({
    method: 'GET',
    url: `/games${path}`,
  });
  return response.error ? undefined : (response.data.length as number);
}

export function useCountAllStandardGame(subType: number, villageId: number) {
  return useQuery(['allGames', { subType, villageId }], () => getCountAllStandardGame({ subType, villageId }));
}
