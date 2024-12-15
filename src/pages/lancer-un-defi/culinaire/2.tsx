import { useRouter } from 'next/router';
import React from 'react';

import { isDefi } from 'src/activity-types/anyActivity';
import { isCooking } from 'src/activity-types/defi.constants';
import type { CookingDefiData } from 'src/activity-types/defi.types';
import { Base } from 'src/components/Base';
import { PageLayout } from 'src/components/PageLayout';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { ContentEditor } from 'src/components/activities/content';
import { getErrorSteps } from 'src/components/activities/defiChecksCooking';
import { ActivityContext } from 'src/contexts/activityContext';
import type { ActivityContent } from 'types/activity.type';

const DefiStep2 = () => {
  const router = useRouter();
  const { activity, updateActivity, addContent, deleteContent, save } = React.useContext(ActivityContext);

  const data = (activity?.data as CookingDefiData) || null;

  const errorSteps = React.useMemo(() => {
    if (data !== null) {
      return getErrorSteps(data, 1);
    }
    return [];
  }, [data]);

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/lancer-un-defi');
    } else if (activity && (!isDefi(activity) || (isDefi(activity) && !isCooking(activity)))) {
      router.push('/lancer-un-defi');
    }
  }, [activity, router]);

  if (data === null || activity === null || !isDefi(activity) || (isDefi(activity) && !isCooking(activity))) {
    return <div></div>;
  }

  const updateContent = (content: ActivityContent[]): void => {
    updateActivity({ content: content });
  };

  const onNext = () => {
    save().catch(console.error);
    router.push('/lancer-un-defi/culinaire/3');
  };

  return (
    <Base>
      <PageLayout>
        <Steps
          steps={['Votre plat', 'La recette', 'Le défi', 'Prévisualisation']}
          urls={['/lancer-un-defi/culinaire/1?edit', '/lancer-un-defi/culinaire/2', '/lancer-un-defi/culinaire/3', '/lancer-un-defi/culinaire/4']}
          activeStep={1}
          errorSteps={errorSteps}
        />
        <div className="width-900">
          <h1>Écrivez la recette</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            À vous de montrer aux pélicopains comment cuisiner ce plat ! Pensez à présenter les ingrédients, les étapes, et donnez vos astuces de
            chef.
          </p>
          <ContentEditor content={activity.content} updateContent={updateContent} addContent={addContent} deleteContent={deleteContent} />
          <StepsButton prev={`/lancer-un-defi/culinaire/1?edit=${activity.id}`} next={onNext} />
        </div>
      </PageLayout>
    </Base>
  );
};

export default DefiStep2;
