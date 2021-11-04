import { useRouter } from 'next/router';
import React from 'react';

import { isGame } from 'src/activity-types/anyActivity';
import { isMimic } from 'src/activity-types/game.const';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import MimicSelector from 'src/components/selectors/MimicSelector';
import { ActivityContext } from 'src/contexts/activityContext';
import type { MimicData, MimicsData } from 'types/game.type';

const MimiqueStep2 = () => {
  const router = useRouter();
  const { activity, updateActivity } = React.useContext(ActivityContext);

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/creer-un-jeu');
    } else if (activity && (!isGame(activity) || !isMimic(activity))) {
      router.push('/creer-un-jeu');
    }
  }, [activity, router]);

  const data = (activity?.data as MimicsData) || null;

  const dataChange = (key: keyof MimicData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newData = { ...data };
    (newData.game2[key] as string) = event.target.value;
    updateActivity({ data: newData });
  };

  const videoChange = (newValue: string) => {
    const newData = { ...data };
    newData.game2.video = newValue;
    updateActivity({ data: newData });
  };

  const onNext = () => {
    router.push('/creer-un-jeu/mimique/3');
  };

  const onPrev = () => {
    router.push(`/creer-un-jeu/mimique/1?edit=${activity?.id}`);
  };

  if (!activity || data === null) {
    return (
      <Base>
        <div></div>
      </Base>
    );
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps steps={['1ère mimique', '2ème mimique', '3ème mimique', 'Prévisualiser']} activeStep={1} />
        <MimicSelector
          mimicNumber="2ème"
          MimicData={data.game2}
          onDataChange={dataChange}
          onNext={onNext}
          onPrev={onPrev}
          onVideoChange={videoChange}
        />
      </div>
    </Base>
  );
};

export default MimiqueStep2;
