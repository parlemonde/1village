import { useMutation } from 'react-query';
import type { Village } from 'server/entities/village';

import { axiosRequest } from 'src/utils/axiosRequest';

export const updateVillage = async (id: number, villageData: Partial<Village>) => {
  const response = await axiosRequest({
    method: 'PUT',
    url: `/villages/${id}`,
    data: villageData,
  });

  return response.data;
};

export const useUpdateVillage = (args: { id: number; villageData: Partial<Village> }) => {
  const { id, villageData } = args;
  return useMutation({
    mutationFn: () => {
      return updateVillage(id, villageData);
    },
  });
};

export const useUpdateVillages = () => {
  return useMutation({
    mutationFn: async (village: { id: number; villageData: Partial<Village> }) => {
      return await updateVillage(village.id, village.villageData);
    },
  });
};
