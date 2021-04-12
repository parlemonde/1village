import { useRouter } from 'next/router';
import React from 'react';

import { isChallenge } from 'src/activity-types/anyActivity';
import { isCooking, COOKING_CHALLENGES } from 'src/activity-types/challenge.const';
import { CookingChallengeData } from 'src/activity-types/challenge.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ThemeChoiceButton } from 'src/components/buttons/ThemeChoiceButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { ActivityStatus } from 'types/activity.type';

const ChallengeStep4: React.FC = () => {
  const router = useRouter();
  const { activity, updateActivity } = React.useContext(ActivityContext);

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

  const onClick = (index: number) => () => {
    if (index === -1) {
      if (!data.challenge) {
        return;
      }
      updateActivity({ data: { ...data, challengeIndex: index, challenge: data.challenge.toLowerCase() } });
    } else {
      const newData = data;
      delete newData.challenge;
      updateActivity({ data: { ...newData, challengeIndex: index } });
    }
    router.push('/lancer-un-defi/culinaire/5');
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps steps={(isEdit ? [] : ['Démarrer']).concat(['Votre plat', 'La recette', 'Le défi', 'Prévisualisation'])} activeStep={isEdit ? 2 : 3} />
        <div className="width-900">
          <h1>Quel défi voulez-vous lancer aux Pelicopains ?</h1>
          <div>
            {COOKING_CHALLENGES.map((t, index) => (
              <ThemeChoiceButton key={index} label={t.title} description={t.description} onClick={onClick(index)} />
            ))}
          </div>
          <StepsButton prev="/lancer-un-defi/culinaire/3" />
        </div>
      </div>
    </Base>
  );
};

export default ChallengeStep4;
