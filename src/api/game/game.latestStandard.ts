import { useQuery } from 'react-query';

import { serializeToQueryUrl } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';

type GET_SUBTYPE = {
  subType: number;
};

export async function getType({ subType }: GET_SUBTYPE) {
  const response = await axiosRequest({
    method: 'GET',
    url: `/games/latestStandard${serializeToQueryUrl({
      subType,
    })}`,
  });
  return response.error ? undefined : response.data;
}

export function useType({ subType }: GET_SUBTYPE) {
  return useQuery(['getLatest', { subType }], () => getType({ subType }));
}
