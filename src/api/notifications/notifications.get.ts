import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';

type NotificationChoice = {
  commentary: boolean;
  reaction: boolean;
  publicationFromAdmin: boolean;
  schoolPublication: boolean;
  adminPublication: boolean;
  creationAccountFamily: boolean;
  openingVillageStep: boolean;
};

async function getNotifications(userId: number): Promise<NotificationChoice> {
  const response = await axiosRequest({
    method: 'GET',
    baseURL: '/api',
    url: `/notifications/users/${userId}`,
  });
  return response.data;
}

export const useGetNotifications = (userId: number) => {
  return useQuery(['notifications', userId], () => getNotifications(userId), {
    enabled: userId > 0,
  });
};
