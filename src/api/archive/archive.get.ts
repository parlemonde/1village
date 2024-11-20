import axios from 'axios';
import React from 'react';
import { useQuery } from 'react-query';

import { UserType } from '../../../types/user.type';
import { UserContext } from '../../contexts/userContext';

const BASE_URL = '/api/archives';

// Récupérer la liste des années déjà archivées
export const useListArchives = () => {
  const { user } = React.useContext(UserContext);

  const hasAccess = user !== null && user.type in [UserType.ADMIN, UserType.SUPER_ADMIN, UserType.MEDIATOR];

  return useQuery(
    ['archives'],
    async () => {
      const { data } = await axios.get(`${BASE_URL}`);
      return data;
    },
    {
      enabled: hasAccess,
    },
  );
};
