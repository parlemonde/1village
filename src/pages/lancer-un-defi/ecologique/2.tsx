import { useRouter } from 'next/router';
import React from 'react';

import { isDefi } from 'src/activity-types/anyActivity';
import { isEco } from 'src/activity-types/defi.constants';
import type { EcoDefiData } from 'src/activity-types/defi.types';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { ContentEditor } from 'src/components/activities/content/';
import { getErrorSteps } from 'src/components/activities/defiEcologieChecks';
import { ActivityContext } from 'src/contexts/activityContext';
import type { ActivityContent } from 'types/activity.type';

const DefiEcoStep2 = () => {
  const router = useRouter();
  const { activity, updateActivity, addContent, deleteContent, save } = React.useContext(ActivityContext);

  const data = (activity?.data as EcoDefiData) || null;

  const errorSteps = React.useMemo(() => {
    if (data !== null) {
      return getErrorSteps(data, 1);
    }
    return [];
  }, [data]);

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/lancer-un-defi');
    } else if (activity && (!isDefi(activity) || (isDefi(activity) && !isEco(activity)))) {
      router.push('/lancer-un-defi');
    }
  }, [activity, router]);

  if (data === null || activity === null || !isDefi(activity) || (isDefi(activity) && !isEco(activity))) {
    return <div></div>;
  }

  const updateContent = (content: ActivityContent[]): void => {
    updateActivity({ content: content });
  };

  const onNext = () => {
    save().catch(console.error);
    router.push('/lancer-un-defi/ecologique/3');
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={['Votre geste pour la planète', "Description de l'action", 'Le défi', 'Prévisualisation']}
          urls={['/lancer-un-defi/ecologique/1?edit', '/lancer-un-defi/ecologique/2', '/lancer-un-defi/ecologique/3', '/lancer-un-defi/ecologique/4']}
          activeStep={1}
          errorSteps={errorSteps}
        />
        <div className="width-900">
          <h1>Expliquez aux Pélicopains votre action et pourquoi vous l’avez choisie.</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            {"Pour l'illustrer, vous pouvez ajouter des photos ou tout expliquer en vidéo !"}
          </p>
          <ContentEditor content={activity.content} updateContent={updateContent} addContent={addContent} deleteContent={deleteContent} />
          <StepsButton prev={`/lancer-un-defi/ecologique/1?edit=${activity.id}`} next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default DefiEcoStep2;
