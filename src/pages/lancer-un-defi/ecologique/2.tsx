import { useRouter } from 'next/router';
import React from 'react';

import { isDefi } from 'src/activity-types/anyActivity';
import { ECO_ACTIONS, isEco } from 'src/activity-types/defi.const';
import { EcoDefiData } from 'src/activity-types/defi.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ThemeChoiceButton } from 'src/components/buttons/ThemeChoiceButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { ActivityStatus } from 'types/activity.type';

const DefiEcoStep2: React.FC = () => {
  const router = useRouter();
  const { activity, updateActivity } = React.useContext(ActivityContext);
  const data = (activity?.data as EcoDefiData) || null;
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/lancer-un-defi');
    } else if (activity && (!isDefi(activity) || (isDefi(activity) && !isEco(activity)))) {
      router.push('/lancer-un-defi');
    }
  }, [activity, router]);

  if (data === null || !isDefi(activity) || (isDefi(activity) && !isEco(activity))) {
    return <div></div>;
  }

  const onNext = (index: number) => () => {
    updateActivity({ data: { ...data, type: index } });
    router.push('/lancer-un-defi/ecologique/3');
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={(isEdit ? [] : ['Démarrer']).concat(['Votre geste pour la planète', "Description de l'action", 'Le défi', 'Prévisualisation'])}
          activeStep={isEdit ? 0 : 1}
        />
        <div className="width-900">
          <h1>Quel geste pour la planète souhaitez-vous presenter ?</h1>
          <div style={{ marginTop: '1rem' }}>
            {ECO_ACTIONS.map((t, index) => (
              <ThemeChoiceButton key={index} label={t} description="" onClick={onNext(index)} />
            ))}
          </div>
          {!isEdit && <StepsButton prev={`/lancer-un-defi/ecologique/1?edit=${activity.id}`} />}
        </div>
      </div>
    </Base>
  );
};

export default DefiEcoStep2;
