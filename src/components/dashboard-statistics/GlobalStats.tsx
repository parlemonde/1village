import React from 'react';

import ClassroomsToWatchTable from './ClassroomsToWatchTable';
import { getClassrooms } from 'src/api/classroom/classroom.list';
import type { Classroom } from 'types/classroom.type';

const GlobalStats = () => {
  const [classrooms, setClassrooms] = React.useState<Classroom[]>([]);

  React.useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const data = await getClassrooms();
        setClassrooms(data);
      } catch (error) {
        console.error('Error fetching classrooms', error);
      }
    };
    fetchClassrooms();
  }, []);

  return (
    <>
      <h1>Village-monde</h1>
      <ClassroomsToWatchTable classrooms={classrooms} />
    </>
  );
};

export default GlobalStats;
