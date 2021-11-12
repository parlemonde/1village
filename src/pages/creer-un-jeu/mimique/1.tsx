import { useRouter } from 'next/router';
import React from 'react';

import { isGame } from 'src/activity-types/anyActivity';
import { DEFAULT_MIMIC_DATA, isMimic } from 'src/activity-types/game.const';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import MimicSelector from 'src/components/selectors/MimicSelector';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { getUserDisplayName } from 'src/utils';
import { ActivityType } from 'types/activity.type';
import type { MimicData, MimicsData } from 'types/game.type';
import { GameType } from 'types/game.type';

const MimiqueStep1 = () => {
  const router = useRouter();
  const { activity, updateActivity, createNewActivity } = React.useContext(ActivityContext);
  const { user } = React.useContext(UserContext);
  const labelPresentation = user ? getUserDisplayName(user, false) : '';

  const created = React.useRef(false);
  React.useEffect(() => {
    if (!created.current) {
      created.current = true;
      if (!activity || !('edit' in router.query)) {
        createNewActivity(ActivityType.GAME, GameType.MIMIC, {
          ...DEFAULT_MIMIC_DATA,
          presentation: labelPresentation,
        });
      } else if (activity && (!isGame(activity) || !isMimic(activity))) {
        createNewActivity(ActivityType.GAME, GameType.MIMIC, {
          ...DEFAULT_MIMIC_DATA,
          presentation: labelPresentation,
        });
      }
    }
  }, [activity, labelPresentation, createNewActivity, router]);

  const data = (activity?.data as MimicsData) || null;

  const dataChange = (key: keyof MimicData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newData: MimicsData = { ...data };
    (newData.game1[key] as string) = event.target.value;
    updateActivity({ data: newData });
  };

  const videoChange = (newValue: string) => {
    const newData = { ...data };
    newData.game1.video = newValue;
    updateActivity({ data: newData });
  };

  const onNext = () => {
    router.push('/creer-un-jeu/mimique/2');
  };

  if (!user || !activity || !activity.data || !data.game1) {
    return (
      <Base>
        <div>Hello</div>
      </Base>
    );
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps steps={['1ère mimique', '2ème mimique', '3ème mimique', 'Prévisualiser']} activeStep={0} />
        <MimicSelector
          mimicNumber="1ère"
          MimicData={data.game1}
          onDataChange={dataChange}
          onNext={onNext}
          onPrev={null}
          onVideoChange={videoChange}
        />
      </div>
    </Base>
  );
};

export default MimiqueStep1;
