import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

import type { ActivityContent } from '../../types/activity.type';

const BASE_URL = '/api/pelico-presentation';

// Mettre à jour une présentation Pelico
export const useUpdatePelicoPresentation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id, content }: { id: number; content: ActivityContent }) => {
      const { data } = await axios.put(`${BASE_URL}/${id}`, { content });
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('pelicoPresentation');
      },
    },
  );
};
