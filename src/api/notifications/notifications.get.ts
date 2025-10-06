import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';

type NotificationChoice = {
  commentary: boolean;
  reaction: boolean;
  publicationFromSchool: boolean;
  publicationFromAdmin: boolean;
  creationAccountFamily: boolean;
  openingVillageStep: boolean;
};

async function getNotifications(userId: number): Promise<NotificationChoice> {
  const response = await axiosRequest({
    method: 'GET',
    baseURL: '/api',
    url: `/notifications/suscribe/${userId}`,
  });
  return response.data;
}

export const useGetNotifications = (userId: number) => {
  return useQuery(['notifications', userId], () => getNotifications(userId), {
    enabled: userId > 0,
  });
};
