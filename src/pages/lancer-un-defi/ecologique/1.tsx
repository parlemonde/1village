import { useRouter } from 'next/router';
import React from 'react';

import { isDefi } from 'src/activity-types/anyActivity';
import { isEco, DEFI, ECO_ACTIONS } from 'src/activity-types/defi.constants';
import type { EcoDefiData } from 'src/activity-types/defi.types';
import { Base } from 'src/components/Base';
import { PageLayout } from 'src/components/PageLayout';
import { Steps } from 'src/components/Steps';
import { BackButton } from 'src/components/buttons/BackButton';
import { ThemeChoiceButton } from 'src/components/buttons/ThemeChoiceButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { VillageContext } from 'src/contexts/villageContext';
import { ActivityStatus, ActivityType } from 'types/activity.type';

const DefiEcoStep1 = () => {
  const router = useRouter();
  const { activity, createNewActivity, updateActivity } = React.useContext(ActivityContext);
  const { selectedPhase } = React.useContext(VillageContext);
  const data = (activity?.data as EcoDefiData) || null;
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;

  const onNext = (index: number) => () => {
    updateActivity({ data: { ...data, type: index } });
    router.push('/lancer-un-defi/ecologique/2');
  };

  const created = React.useRef(false);
  React.useEffect(() => {
    if (!created.current) {
      if (!('edit' in router.query)) {
        created.current = true;
        createNewActivity(ActivityType.DEFI, selectedPhase, DEFI.ECO, {
          type: null,
          defiIndex: null,
        });
      } else if (activity && (!isDefi(activity) || (isDefi(activity) && !isEco(activity)))) {
        created.current = true;
        createNewActivity(ActivityType.DEFI, selectedPhase, DEFI.ECO, {
          type: null,
          defiIndex: null,
        });
      }
    }
  }, [activity, createNewActivity, router, selectedPhase]);

  if (data === null || activity === null || !isDefi(activity) || (isDefi(activity) && !isEco(activity))) {
    return <div></div>;
  }

  return (
    <Base>
      <PageLayout>
        {!isEdit && <BackButton href="/lancer-un-defi" />}
        <Steps
          steps={['Votre geste pour la planète', "Description de l'action", 'Le défi', 'Prévisualisation']}
          urls={['/lancer-un-defi/ecologique/1?edit', '/lancer-un-defi/ecologique/2', '/lancer-un-defi/ecologique/3', '/lancer-un-defi/ecologique/4']}
          activeStep={0}
        />
        <div className="width-900">
          <h1>Quel geste pour la planète souhaitez-vous presenter ?</h1>
          <div style={{ marginTop: '1rem' }}>
            {ECO_ACTIONS.map((t, index) => (
              <ThemeChoiceButton key={index} label={t} description="" onClick={onNext(index)} />
            ))}
          </div>
        </div>
      </PageLayout>
    </Base>
  );
};

export default DefiEcoStep1;
