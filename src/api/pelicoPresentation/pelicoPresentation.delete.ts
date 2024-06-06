import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

const BASE_URL = '/api/pelico-presentation';

// Supprimer une présentation Pelico
export const useDeletePelicoPresentation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (id: number) => {
      await axios.delete(`${BASE_URL}/${id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('pelicoPresentation');
      },
    },
  );
};
