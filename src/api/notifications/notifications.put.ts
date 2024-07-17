import { useMutation } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';

// async function putNotifications(params: { userId: number; data: any }) {
//   const { userId, data } = params;

//   return (
//     await axiosRequest({
//       method: 'PUT',
//       baseURL: '/api',
//       url: '/notifications/' + userId,
//       data: {
//         dataNotif: data,
//       },
//     })
//   ).data;
// }

// export const usePutNotifications = () => {
//   return useQuery(['Notifications'], () => putNotifications({ userId, data }));
// };

async function putNotifications(params: { userId: number; data: any }) {
  const { userId, data } = params;
  return await axiosRequest({
    method: 'PUT',
    baseURL: '/api',
    url: `/notifications/${userId}`,
    data: {
      dataNotif: data,
    },
  });
}

export const usePutNotifications = (args: { userId: number; data: any }) => {
  const { userId, data } = args;

  return useMutation({
    mutationFn: () => {
      return putNotifications({ userId, data });
    },
  });
};
