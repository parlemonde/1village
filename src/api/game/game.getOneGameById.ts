import { useQuery } from 'react-query';

import { serializeToQueryUrl } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';

type Input = {
  selectedValue: string;
  response: boolean;
  type: number;
};

type GameItem = {
  inputs?: Input[];
  video?: string;
  origine?: string;
  signification?: string;
  fakeSignification1?: string;
  fakeSignification2?: string;
};

type Data = {
  game: GameItem[];
  labelPresentation: string;
  language?: string;
  monney?: string;
  radio: string;
  type?: string;
};

export type DataUse = {
  phase: number;
  type: number;
  content: Data;
  createDate: string;
  id: number;
  userId: number;
  villageId: number;
  subType: number;
};

type GetOneGameByIdProps = {
  subType: number;
  id: number;
};

export async function getGameByActivityId({ subType, id }: GetOneGameByIdProps) {
  const path = `/standardGame/${id}${serializeToQueryUrl({
    subType,
  })}`;
  const response = await axiosRequest({
    method: 'GET',
    url: `/games${path}`,
  });
  return response.error ? undefined : (response.data as DataUse);
}

export function useGameByActivityId(subType: number, id: number) {
  return useQuery(['getGameByActivityId', { subType, id }], () => getGameByActivityId({ subType, id }));
}
