import { useRouter } from 'next/router';
import React from 'react';

import { MimiqueData, MimiquesData } from 'types/game.types';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { BackButton } from 'src/components/buttons/BackButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { isMimique } from 'src/activity-types/game.const';
import { isGame } from 'src/activity-types/anyActivity';
import MimiqueSelector from 'src/components/selectors/MimiqueSelector';

const MimiqueStep2: React.FC = () => {
  const router = useRouter();
  const { activity, updateActivity } = React.useContext(ActivityContext);

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/creer-un-jeu');
    } else if (activity && (!isGame(activity) || !isMimique(activity))) {
      router.push('/creer-un-jeu');
    }
  }, [activity, router]);

  const data = (activity?.data as MimiquesData) || null;

  const dataChange = (key: keyof MimiqueData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newData = { ...data };
    (newData.mimique2[key] as string) = event.target.value;
    updateActivity({ data: newData });
  };

  const videoChange = (newValue: string) => {
    const newData = { ...data };
    newData.mimique2.video = newValue;
    updateActivity({ data: newData });
  };

  const onNext = () => {
    router.push('/creer-un-jeu/mimique/3');
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
        {<BackButton href="/creer-un-jeu/mimique/1" />}
        <Steps steps={['1ère mimique', '2ème mimique', '3ème mimique', 'Prévisualiser']} activeStep={1} />
        <MimiqueSelector mimiqueNumber="2ème" mimiqueData={data.mimique2} onDataChange={dataChange} onNext={onNext} onVideoChange={videoChange} />
      </div>
    </Base>
  );
};

export default MimiqueStep2;
