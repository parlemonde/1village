// import React, { useEffect } from 'react';

// import {
//   useGetContributions,
//   useGetClassroomExchanges,
//   useGetStudentAccounts,
//   useGetConnectionTimes,
// } from './../../../api/statistics/statistics.get.ts';

// const LogRequests = () => {
//   const { data: contributions, error: contributionsError, isLoading: contributionsLoading } = useGetContributions();
//   const { data: classroomExchanges, error: classroomExchangesError, isLoading: classroomExchangesLoading } = useGetClassroomExchanges();
//   const { data: studentAccounts, error: studentAccountsError, isLoading: studentAccountsLoading } = useGetStudentAccounts();
//   const { data: connectionTimes, error: connectionTimesError, isLoading: connectionTimesLoading } = useGetConnectionTimes();

//   useEffect(() => {
//     if (!contributionsLoading && !contributionsError) {
//       console.log('Contributions:', contributions);
//     }
//   }, [contributions, contributionsLoading, contributionsError]);

//   useEffect(() => {
//     if (!classroomExchangesLoading & !classroomExchangesError) {
//       console.log('Exchanges:', classroomExchanges);
//     }
//   }, [classroomExchanges, classroomExchangesLoading, classroomExchangesError]);

//   useEffect(() => {
//     if (!studentAccountsLoading & !studentAccountsError) {
//       console.log('student accounts:', studentAccounts);
//     }
//   }, [studentAccounts, studentAccountsLoading, studentAccountsError]);

//   useEffect(() => {
//     if (!connectionTimesLoading & !connectionTimesError) {
//       console.log('connection times:', connectionTimes);
//     }
//   }, [connectionTimes, connectionTimesLoading, connectionTimesError]);

//   return <h1>Requêtes</h1>;
// };

// export default LogRequests;
