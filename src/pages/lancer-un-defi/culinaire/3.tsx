import { useRouter } from 'next/router';
import React from 'react';

import { isDefi } from 'src/activity-types/anyActivity';
import { isCooking } from 'src/activity-types/defi.constants';
import type { CookingDefiData } from 'src/activity-types/defi.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ContentEditor } from 'src/components/activities/content';
import { ActivityContext } from 'src/contexts/activityContext';
import type { ActivityContent } from 'types/activity.type';
import { ActivityStatus } from 'types/activity.type';

const DefiStep3 = () => {
  const router = useRouter();
  const { activity, updateActivity, addContent, deleteContent, save } = React.useContext(ActivityContext);

  const data = (activity?.data as CookingDefiData) || null;
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;

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
    router.push('/lancer-un-defi/culinaire/4');
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps steps={(isEdit ? [] : ['Démarrer']).concat(['Votre plat', 'La recette', 'Le défi', 'Prévisualisation'])} activeStep={isEdit ? 1 : 2} />
        <div className="width-900">
          <h1>Écrivez la recette</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            À vous de montrer aux Pelicopains comment cuisiner ce plat ! Pensez à présenter les ingrédients, les étapes, et donnez vos astuces de
            chef.
          </p>
          <ContentEditor content={activity.content} updateContent={updateContent} addContent={addContent} deleteContent={deleteContent} save={save} />
          <StepsButton prev="/lancer-un-defi/culinaire/2" next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default DefiStep3;
