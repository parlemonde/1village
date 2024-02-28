import { useQuery } from 'react-query';

import { serializeToQueryUrl } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';
import { GameType } from 'types/game.type';

type GetCountAllStandardGameProps = {
  subType: number;
  villageId: number;
};

// TODO : remove specific mimic management after mimic is standard
export async function getCountAllStandardGame({ subType, villageId }: GetCountAllStandardGameProps) {
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
  return response.error ? undefined : (response.data.length as number);
}

export function useCountAllStandardGame(subType: number, villageId: number) {
  return useQuery(['allGames', { subType, villageId }], () => getCountAllStandardGame({ subType, villageId }));
}
