import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

import type { PelicoPresentationContent } from 'types/pelicoPresentation.type';

const BASE_URL = '/api/pelico-presentation';

// Créer une nouvelle présentation Pelico
export const useCreatePelicoPresentation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (content: PelicoPresentationContent[]) => {
      const { data } = await axios.post(BASE_URL, { content });
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('pelicoPresentation');
      },
    },
  );
};
