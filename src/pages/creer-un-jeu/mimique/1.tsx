import { useRouter } from 'next/router';
import React from 'react';

import { isGame } from 'src/activity-types/anyActivity';
import { DEFAULT_MIMIQUE_DATA, isMimique } from 'src/activity-types/game.const';
import { MimiqueData, MimiquesData, GameType } from 'types/game.types';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { getUserDisplayName } from 'src/utils';
import { ActivityType } from 'types/activity.type';
import MimiqueSelector from 'src/components/selectors/MimiqueSelector';

const MimiqueStep1: React.FC = () => {
  const router = useRouter();
  const { activity, updateActivity, createNewActivity } = React.useContext(ActivityContext);
  const { user } = React.useContext(UserContext);
  const labelPresentation = getUserDisplayName(user, false);

  const created = React.useRef(false);
  React.useEffect(() => {
    if (!created.current) {
      created.current = true;
      if (!activity || !('edit' in router.query)) {
        createNewActivity(ActivityType.GAME, GameType.MIMIQUE, {
          ...DEFAULT_MIMIQUE_DATA,
          presentation: labelPresentation,
        });
      } else if (activity && (!isGame(activity) || !isMimique(activity))) {
        createNewActivity(ActivityType.GAME, GameType.MIMIQUE, {
          ...DEFAULT_MIMIQUE_DATA,
          presentation: labelPresentation,
        });
      }
    }
  }, [activity, labelPresentation, createNewActivity, router]);

  const data = (activity?.data as MimiquesData) || null;

  const dataChange = (key: keyof MimiqueData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newData: MimiquesData = { ...data };
    (newData.mimique1[key] as string) = event.target.value;
    updateActivity({ data: newData });
  };

  const videoChange = (newValue: string) => {
    const newData = { ...data };
    newData.mimique1.video = newValue;
    updateActivity({ data: newData });
  };

  const onNext = () => {
    router.push('/creer-un-jeu/mimique/2');
  };

  if (!user || !activity || !activity.data || !data.mimique1) {
    return (
      <Base>
        <div></div>
      </Base>
    );
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps steps={['1ère mimique', 'toto mimique', '3ème mimique', 'Prévisualiser']} activeStep={0} />
        <MimiqueSelector
          mimiqueNumber="1ère"
          mimiqueData={data.mimique1}
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
