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
