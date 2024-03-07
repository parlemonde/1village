import { useQuery } from 'react-query';

import { serializeToQueryUrl } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';

type GetAllStandardGameByTypeProps = {
  subType: number;
  villageId: number | undefined;
};

export async function getAllStandardGameByType({ subType, villageId }: GetAllStandardGameByTypeProps) {
  const path = `/allStandardGame${serializeToQueryUrl({
    subType,
    villageId,
  })}`;
  const response = await axiosRequest({
    method: 'GET',
    url: `/games${path}`,
  });
  return response.error ? undefined : response.data;
}

export function useAllStandardGameByType(subType: number, villageId: number) {
  return useQuery(['allStandardGameByType', { subType, villageId }], () => getAllStandardGameByType({ subType, villageId }));
}
