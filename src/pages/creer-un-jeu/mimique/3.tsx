import { useRouter } from 'next/router';
import React from 'react';

import { isGame } from 'src/activity-types/anyActivity';
import { isMimic } from 'src/activity-types/game.constants';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import MimicSelector from 'src/components/selectors/MimicSelector';
import { ActivityContext } from 'src/contexts/activityContext';
import type { MimicData, MimicsData } from 'types/game.type';

const MimiqueStep3 = () => {
  const router = useRouter();
  const { activity, updateActivity } = React.useContext(ActivityContext);

  const data = (activity?.data as MimicsData) || null;

  const isValid = React.useMemo(() => {
    if (activity !== null && activity.content.filter((c) => c.value.length > 0 && c.value !== '<p></p>\n').length === 0) {
      return false;
    }
    return true;
  }, [activity]);

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/creer-un-jeu');
    } else if (activity && (!isGame(activity) || !isMimic(activity))) {
      router.push('/creer-un-jeu');
    }
  }, [activity, router]);

  const dataChange = (key: keyof MimicData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newData = { ...data };
    (newData.game3[key] as string) = event.target.value;
    updateActivity({ data: newData });
  };

  const videoChange = (newValue: string) => {
    const newData = { ...data };
    newData.game3.video = newValue;
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
        <Steps
          steps={['1ère mimique', '2ème mimique', '3ème mimique', 'Prévisualiser']}
          urls={['/creer-un-jeu/mimique/1?edit', '/creer-un-jeu/mimique/2', '/creer-un-jeu/mimique/3', '/creer-un-jeu/mimique/4']}
          activeStep={2}
          errorSteps={isValid ? [] : [0, 1]}
        />

        <MimicSelector
          mimicNumber="3ème"
          MimicData={data.game3}
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
