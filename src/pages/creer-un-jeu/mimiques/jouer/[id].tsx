import { useRouter } from 'next/router';
import React from 'react';
import { useQuery } from 'react-query';

import { useAllStandardGameByType, getAllStandardGameByType } from 'src/api/game/game.getAllBySubtype';
import { Base } from 'src/components/Base';

const DisplayPlayId = () => {
  const router = useRouter();
  const { id } = router.query;
  return <Base></Base>;
};

export default DisplayPlayId;
