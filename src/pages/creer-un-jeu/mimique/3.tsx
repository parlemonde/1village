import { useRouter } from 'next/router';
import React from 'react';

import { isGame } from 'src/activity-types/anyActivity';
import { isMimique } from 'src/activity-types/game.const';
import { MimiqueData, MimiquesData } from 'types/game.types';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { BackButton } from 'src/components/buttons/BackButton';
import { ActivityContext } from 'src/contexts/activityContext';
import MimiqueSelector from 'src/components/selectors/MimiqueSelector';
import { ActivityStatus } from 'types/activity.type';

const MimiqueStep3: React.FC = () => {
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
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;

  const dataChange = (key: keyof MimiqueData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newData = { ...data };
    (newData.mimique3[key] as string) = event.target.value;
    updateActivity({ data: newData });
  };

  const videoChange = (newValue: string) => {
    const newData = { ...data };
    newData.mimique3.video = newValue;
    updateActivity({ data: newData });
  };

  const onNext = () => {
    router.push('/creer-un-jeu/mimique/4');
  };

  const onPrev = () => {
    router.push('/creer-un-jeu/mimique/2');
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
        <Steps steps={['1ère mimique', '2ème mimique', '3ème mimique', 'Prévisualiser']} activeStep={2} />
        <MimiqueSelector
          mimiqueNumber="3ème"
          mimiqueData={data.mimique3}
          onDataChange={dataChange}
          onNext={onNext}
          onPrev={onPrev}
          onVideoChange={videoChange}
        />
      </div>
    </Base>
  );
};

export default MimiqueStep3;
