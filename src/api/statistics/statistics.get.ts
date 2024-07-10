import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type {
  ClassroomExchangesStats,
  ClassroomsStats,
  ConnectionCountsStats,
  ConnectionTimesStats,
  ContributionStats,
  StudentAccountsStats,
} from 'types/statistics.type';

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

async function getConnectionsStats(): Promise<ClassroomsStats[]> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: '/statistics/connections',
    })
  ).data;
}

export const useGetConnectionsStats = () => {
  return useQuery(['connections-stats'], () => getConnectionsStats());
};

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
  return useQuery(['contributions'], () => getContributions());
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
  return useQuery(['classroom_exchanges'], () => getClassroomExchanges());
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
  return useQuery(['student_accounts'], () => getStudentAccounts());
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
  return useQuery(['connection_times'], () => getConnectionTimes());
};

async function getConnectionCounts(): Promise<ConnectionCountsStats> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: '/statistics/connection-counts',
    })
  ).data;
}

export const useGetConnectionCounts = () => {
  return useQuery(['connection_counts'], () => getConnectionCounts());
};
