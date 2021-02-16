import { useRouter } from 'next/router';
import React from 'react';

import { Base } from 'src/components/Base';
import { ActivityContext } from 'src/contexts/activityContext';
import { ActivityType } from 'types/activity.type';


const MascotteStep0: React.FC = () => {
  const router = useRouter();
  const { createNewActivity } = React.useContext(ActivityContext);

  React.useEffect(() => {
    createNewActivity(ActivityType.PRESENTATION);
    router.push('/se-presenter/mascotte/1');
  })

  return (
    <Base>
    </Base>
  );
};

export default MascotteStep0;
