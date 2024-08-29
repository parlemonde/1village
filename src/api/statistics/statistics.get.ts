// import { useQuery } from 'react-query';

// import { mockClassroomsStats, mockConnectionsStats } from 'src/components/admin/dashboard-statistics/mocks/mocks';
// import { axiosRequest } from 'src/utils/axiosRequest';
// import type { ClassroomsStats, ConnectionsStats } from 'types/statistics.type';

// const isDevelopment = process.env.NODE_ENV === 'development';

// async function getClassroomsStats(): Promise<ClassroomsStats[]> {
//   if (isDevelopment) {
//     // retourne mocks
//     return new Promise((resolve) => {
//       setTimeout(() => resolve(mockClassroomsStats), 500);
//     });
//   }

//   return (
//     await axiosRequest({
//       method: 'GET',
//       baseURL: '/api',
//       url: '/statistics/classrooms',
//     })
//   ).data;
// }

// export const useGetClassroomsStats = () => {
//   return useQuery(['classrooms-stats'], getClassroomsStats);
// };

// async function getConnectionsStats(): Promise<ConnectionsStats> {
//   if (isDevelopment) {
//     return new Promise((resolve) => {
//       setTimeout(() => resolve(mockConnectionsStats), 500);
//     });
//   }

//   return (
//     await axiosRequest({
//       method: 'GET',
//       baseURL: '/api',
//       url: '/statistics/connections',
//     })
//   ).data;
// }

// export const useGetConnectionsStats = () => {
//   return useQuery(['connections-stats'], getConnectionsStats);
// };

import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { ClassroomsStats, SessionsStats } from 'types/statistics.type';

async function getSessionsStats(): Promise<SessionsStats> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: '/statistics/sessions',
    })
  ).data;
}

export const useGetSessionsStats = () => {
  return useQuery(['sessions-stats'], () => getSessionsStats());
};

async function getClassroomsStats(): Promise<ClassroomsStats[]> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: '/statistics/classrooms',
    })
  ).data;
}

export const useGetClassroomsStats = () => {
  return useQuery(['classrooms-stats'], () => getClassroomsStats());
};
