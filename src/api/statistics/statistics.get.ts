import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { ClassroomExchangesStats, ConnectionTimesStats, ContributionStats, StudentAccountsStats } from 'types/statistics.type';

async function getContributions(): Promise<ContributionStats[]> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: '/statistics/contributions',
    })
  ).data;
}

export const useGetContributions = () => {
  return useQuery(['activities'], () => getContributions());
};

async function getClassroomExchanges(): Promise<ClassroomExchangesStats> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: '/statistics/classroom-exchanges',
    })
  ).data;
}

export const useGetClassroomExchanges = () => {
  return useQuery(['activities', 'comments'], () => getClassroomExchanges());
};

async function getStudentAccounts(): Promise<StudentAccountsStats> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: '/statistics/student-accounts',
    })
  ).data;
}

export const useGetStudentAccounts = () => {
  return useQuery(['student'], () => getStudentAccounts());
};

async function getConnectionTimes(): Promise<ConnectionTimesStats> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: '/statistics/connection-times',
    })
  ).data;
}

export const useGetConnectionTimes = () => {
  return useQuery(['analytic_sesssion'], () => getConnectionTimes());
};
