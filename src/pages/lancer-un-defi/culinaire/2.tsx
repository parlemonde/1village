import { useRouter } from 'next/router';
import React from 'react';

import { isChallenge } from 'src/activity-types/anyActivity';
import { isCooking } from 'src/activity-types/challenge.const';
import { CookingChallengeData } from 'src/activity-types/challenge.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ActivityContext } from 'src/contexts/activityContext';
import { ActivityStatus } from 'types/activity.type';

const ChallengeStep2: React.FC = () => {
  const router = useRouter();
  const { activity } = React.useContext(ActivityContext);
  const data = (activity?.data as CookingChallengeData) || null;
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/lancer-un-defi');
    } else if (activity && (!isChallenge(activity) || (isChallenge(activity) && !isCooking(activity)))) {
      router.push('/lancer-un-defi');
    }
  }, [activity, router]);

  if (data === null || !isChallenge(activity) || (isChallenge(activity) && !isCooking(activity))) {
    return <div></div>;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps steps={(isEdit ? [] : ['Démarrer']).concat(['Votre plat', 'La recette', 'Le défi', 'Prévisualisation'])} activeStep={isEdit ? 0 : 1} />
        <div className="width-900">
          <h1>Quel est le plat que vous avez choisi ?</h1>
          <div>TODO</div>
          {!isEdit && <StepsButton prev={`/lancer-un-defi/culinaire/1?edit=${activity.id}`} next="/lancer-un-defi/culinaire/3" />}
        </div>
      </div>
    </Base>
  );
};

export default ChallengeStep2;
