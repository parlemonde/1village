import { useQuery } from 'react-query';

import { serializeToQueryUrl } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';

type GetAbleToPlayStandardGameProps = {
  subType: number;
  villageId: number;
};

export async function getAbleToPlayStandardGame({ subType, villageId }: GetAbleToPlayStandardGameProps) {
  const path = `AbleToPlayStandardGame${serializeToQueryUrl({
    subType,
    villageId,
  })}`;
  const response = await axiosRequest({
    method: 'GET',
    url: `/games/${path}`,
  });
  return response.error ? undefined : response.data.activities;
}

export function useAbleToPlayStandardGame(subType: number, villageId: number) {
  return useQuery(['AbleToPlay', { subType, villageId }], () => getAbleToPlayStandardGame({ subType, villageId }));
}
