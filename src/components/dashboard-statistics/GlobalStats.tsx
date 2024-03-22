import React from 'react';

import { useGetContributions } from 'src/api/statistics/statistics.get';

const GlobalStats = () => {
  const contributions = useGetContributions();
  if (contributions.isError) return <p>Error!</p>;
  if (contributions.isLoading || contributions.isIdle) return <p>Loading...</p>;

  return contributions.data.map((contribution) => (
    <div key={contribution.phase}>{`Phase: ${contribution.phase}, nombre de classes ayant contribué : ${contribution.activeClassrooms}`}</div>
  ));
};

export default GlobalStats;
