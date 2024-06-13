import axios from 'axios';
import { useQuery } from 'react-query';

const BASE_URL = '/api/pelico-presentation';

// Récupérer une présentation Pelico spécifique
export const usePelicoPresentation = (id: number) => {
  return useQuery(['pelicoPresentation', id], async () => {
    const { data } = await axios.get(`${BASE_URL}/${id}`);
    return data;
  });
};

// Récupérer toutes les présentations Pelico
export const usePelicoPresentatations = () => {
  return useQuery('pelicoPresentatation', async () => {
    const { data } = await axios.get(BASE_URL);
    return data;
  });
};

// async function getPelicoPresentation(id: number) {
//   const { data } = await axios.get(`${BASE_URL}/${id}`);
//     return data;
// }

// export const useGetPelicoPresentation = (id: number) => {
//   return useQuery(['pelico-presentation'], getPelicoPresentation(id));
// };

// async function getPelicoPresentations() {
//   const { data } = await axios.get(`${BASE_URL}`);
//     return data;
// }

// export const useGetPelicoPresentations = () => {
//   return useQuery(['pelico-presentation'], getPelicoPresentations);
// };
