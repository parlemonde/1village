import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { ConnectionTimesStats, ContributionStats, StudentAccountsStats } from 'types/statistics.type';

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

async function getClassesExchanges(): Promise<number> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: '/statistics/classes-exchanges',
    })
  ).data;
}

export const useGetClassesExchanges = () => {
  return useQuery(['activities', 'comments'], () => getClassesExchanges());
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
