import { useRouter } from 'next/router';
import React from 'react';

import { isGame } from 'src/activity-types/anyActivity';
import { isMimic, isMimicValid } from 'src/activity-types/game.constants';
import { Base } from 'src/components/Base';
import { PageLayout } from 'src/components/PageLayout';
import { Steps } from 'src/components/Steps';
import MimicSelector from 'src/components/selectors/MimicSelector';
import { ActivityContext } from 'src/contexts/activityContext';
import type { MimicData, MimicsData } from 'types/game.type';

const MimiqueStep3 = () => {
  const router = useRouter();
  const { activity, updateActivity } = React.useContext(ActivityContext);

  const data = (activity?.data as MimicsData) || null;

  const errorSteps = React.useMemo(() => {
    const errors: number[] = [];
    if (data === undefined || data === null) return; //when you came from ma-classe.tsx
    if (!isMimicValid(data.game1)) errors.push(0); // step of mimic 1
    if (!isMimicValid(data.game2)) errors.push(1); // step of mimic 2
    return errors;
  }, [data]);

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
      <PageLayout>
        <Steps
          steps={['1ère mimique', '2ème mimique', '3ème mimique', 'Prévisualiser']}
          urls={['/creer-un-jeu/mimique/1?edit', '/creer-un-jeu/mimique/2', '/creer-un-jeu/mimique/3', '/creer-un-jeu/mimique/4']}
          activeStep={2}
          errorSteps={errorSteps}
        />

        <MimicSelector
          mimicNumber="3ème"
          MimicData={data.game3}
          onDataChange={dataChange}
          onNext={onNext}
          onPrev={onPrev}
          onVideoChange={videoChange}
        />
      </PageLayout>
    </Base>
  );
};

export default MimiqueStep3;
