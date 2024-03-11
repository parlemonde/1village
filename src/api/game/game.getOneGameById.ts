import { useQuery } from 'react-query';

import { serializeToQueryUrl } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';
// import { GameType } from 'types/game.type';

type GetOneGameByIdProps = {
  subType: number;
  id: number;
};
type DataUse = {
  data: Data;
  createDate: string;
  id: number;
  userId: number;
  villageId: number;
};
type Data = {
  game: GameItem[];
  labelPresentation: string;
  language?: string;
  monney?: string;
  radio: string;
};
type GameItem = {
  inputs: Input[];
};
type Input = {
  selectedValue: string;
  response: boolean;
};

// TODO : remove specific mimic management after mimic is standard
export async function getOneGameById({ subType, id }: GetOneGameByIdProps) {
  const path = `/standardGame/${id}${serializeToQueryUrl({
    subType,
  })}`;
  const response = await axiosRequest({
    method: 'GET',
    url: `/games${path}`,
  });
  console.log(response.data)
  return response.error ? undefined : (response.data as DataUse);
}

export function useOneGameById(subType: number, id: number) {
  return useQuery(['getOneGameById', { subType, id }], () => getOneGameById({ subType, id }));
}
