import { useQuery } from 'react-query';

import type { GameDataMonneyOrExpression } from '../../../types/game.type';
import { serializeToQueryUrl } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';

type GET_GameDataMonneyOrExpression = GameDataMonneyOrExpression;
export async function getlatestStandard({ type, subType }) {
  const response = await axiosRequest({
    method: 'GET',
    url: `/games/latestStandard${serializeToQueryUrl({
      type,
      subType,
    })}`,
  });
  return response.error ? undefined : response.data;
}

export function useLatestStandard({ type, subType }) {
  return useQuery(['weather', { type, subType }], () => getlatestStandard({ type, subType }));
}
