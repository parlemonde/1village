import axios from 'axios';
import { useQuery } from 'react-query';

const BASE_URL = '/api/archives';

// Récupérer la liste des années déjà archivées
export const useListArchives = () => {
  return useQuery(['archives'], async () => {
    const { data } = await axios.get(`${BASE_URL}`);
    return data;
  });
};
