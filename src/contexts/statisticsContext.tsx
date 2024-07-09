import React, { createContext, useContext, useMemo } from 'react';

import {
  useGetContributions,
  useGetClassroomExchanges,
  useGetStudentAccounts,
  useGetConnectionTimes,
} from './../api/statistics/statisticscopy.get.ts';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { data: contributions, error: contributionsError, isLoading: contributionsLoading } = useGetContributions();
  const { data: classroomExchanges, error: classroomExchangesError, isLoading: classroomExchangesLoading } = useGetClassroomExchanges();
  const { data: studentAccounts, error: studentAccountsError, isLoading: studentAccountsLoading } = useGetStudentAccounts();
  const { data: connectionTimes, error: connectionTimesError, isLoading: connectionTimesLoading } = useGetConnectionTimes();

  useMemo(() => {
    if (!contributionsLoading && !contributionsError) {
      console.log('Contributions:', contributions);
    }
    if (!classroomExchangesLoading && !classroomExchangesError) {
      console.log('Exchanges:', classroomExchanges);
    }
    if (!studentAccountsLoading && !studentAccountsError) {
      console.log('Student accounts:', studentAccounts);
    }
    if (!connectionTimesLoading && !connectionTimesError) {
      console.log('Connection times:', connectionTimes);
    }
  }, [
    contributions,
    contributionsError,
    contributionsLoading,
    classroomExchanges,
    classroomExchangesError,
    classroomExchangesLoading,
    studentAccounts,
    studentAccountsError,
    studentAccountsLoading,
    connectionTimes,
    connectionTimesError,
    connectionTimesLoading,
  ]);

  const value = {
    contributions,
    contributionsError,
    contributionsLoading,
    classroomExchanges,
    classroomExchangesError,
    classroomExchangesLoading,
    studentAccounts,
    studentAccountsError,
    studentAccountsLoading,
    connectionTimes,
    connectionTimesError,
    connectionTimesLoading,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useDataContext = () => useContext(DataContext);
