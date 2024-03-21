import React from 'react';

import { getGlobalContribution } from 'src/api/statistics/statistics.get';

const GlobalStats = () => {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await getGlobalContribution();
      setData(data);
    };
    fetchData();
    console.log(data);
  }, []);

  return <h1>1Village</h1>;
};

export default GlobalStats;
