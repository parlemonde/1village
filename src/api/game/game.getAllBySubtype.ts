import { useQuery } from 'react-query';

import { serializeToQueryUrl } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';
import { GameType } from 'types/game.type';

type GetAllStandardGameByTypeProps = {
  subType: number;
  villageId: number;
};

// TODO : remove specific mimic management after mimic is standard
export async function getAllStandardGameByType({ subType, villageId }: GetAllStandardGameByTypeProps) {
  const path =
    subType === GameType.MIMIC
      ? `${serializeToQueryUrl({
          type: subType,
          villageId,
        })}`
      : `/allStandardGame${serializeToQueryUrl({
          subType,
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
