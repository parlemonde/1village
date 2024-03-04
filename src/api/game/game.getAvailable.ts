import { useQuery } from 'react-query';

import { serializeToQueryUrl } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';
import { GameType } from 'types/game.type';

type GetCountAbleToPlayStandardGameProps = {
  subType: number;
  villageId: number;
};

// TODO : remove specific mimic management after mimic is standard
export async function getCountAbleToPlayStandardGame({ subType, villageId }: GetCountAbleToPlayStandardGameProps) {
  const isMimic = subType === GameType.MIMIC;
  const path = isMimic
    ? `ableToPlay${serializeToQueryUrl({
        type: subType,
        villageId,
      })}`
    : `countAbleToPlayStandardGame${serializeToQueryUrl({
        subType,
      })}`;
  const response = await axiosRequest({
    method: 'GET',
    url: `/games/${path}`,
  });
  return response.error ? undefined : isMimic ? response.data.games.length : response.data.count;
}

export function useCountAbleToPlayStandardGame(subType: number, villageId: number) {
  return useQuery(['countAbleToPlay', { subType, villageId }], () => getCountAbleToPlayStandardGame({ subType, villageId }));
}
