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

const MimiqueStep2 = () => {
  const router = useRouter();
  const { activity, updateActivity } = React.useContext(ActivityContext);

  const data = (activity?.data as MimicsData) || null;

  const isStep1Valid = React.useMemo(() => {
    if (data !== null) {
      return isMimicValid(data.game1);
    }
    return false;
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
      <PageLayout>
        <Steps
          steps={['1ère mimique', '2ème mimique', '3ème mimique', 'Prévisualiser']}
          urls={['/creer-un-jeu/mimique/1?edit', '/creer-un-jeu/mimique/2', '/creer-un-jeu/mimique/3', '/creer-un-jeu/mimique/4']}
          activeStep={1}
          errorSteps={isStep1Valid ? [] : [0]}
        />

        <MimicSelector
          mimicNumber="2ème"
          MimicData={data.game2}
          onDataChange={dataChange}
          onNext={onNext}
          onPrev={onPrev}
          onVideoChange={videoChange}
        />
      </PageLayout>
    </Base>
  );
};

export default MimiqueStep2;
