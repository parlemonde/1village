import { useMutation } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';

type NotificationChoice = {
  commentary: boolean;
  reaction: boolean;
  publicationFromSchool: boolean;
  publicationFromAdmin: boolean;
  creationAccountFamily: boolean;
  openingVillageStep: boolean;
};

async function putNotifications(params: { userId: number; data: NotificationChoice }) {
  const { userId, data } = params;
  return await axiosRequest({
    method: 'PUT',
    baseURL: '/api',
    url: `/notifications/suscribe/${userId}`,
    data: {
      data,
    },
  });
}

export const usePutNotifications = (args: { userId: number; data: NotificationChoice }) => {
  const { userId, data } = args;

  return useMutation({
    mutationFn: () => {
      return putNotifications({ userId, data });
    },
  });
};
