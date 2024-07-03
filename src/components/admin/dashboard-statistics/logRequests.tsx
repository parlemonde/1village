import React from 'react';
import { useDataContext, DataProvider } from './../../../contexts/statisticsContext';

const LogRequests = () => {
  const {
    contributionsLoading,
    contributionsError,
    classroomExchangesLoading,
    classroomExchangesError,
    studentAccountsLoading,
    studentAccountsError,
    connectionTimesLoading,
    connectionTimesError,
  } = useDataContext();

  return (
    <div>
      <h1>Requêtes</h1>
      {!contributionsLoading && !contributionsError && <div>Contributions logged to console.</div>}
      {!classroomExchangesLoading && !classroomExchangesError && <div>Classroom Exchanges logged to console.</div>}
      {!studentAccountsLoading && !studentAccountsError && <div>Student Accounts logged to console.</div>}
      {!connectionTimesLoading && !connectionTimesError && <div>Connection Times logged to console.</div>}
    </div>
  );
};

export default LogRequests;
