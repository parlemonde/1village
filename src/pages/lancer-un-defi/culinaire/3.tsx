import { useRouter } from 'next/router';
import React from 'react';

import { isDefi } from 'src/activity-types/anyActivity';
import { isLanguage } from 'src/activity-types/defi.const';
import { LanguageDefiData } from 'src/activity-types/defi.types';
import { EditorContent } from 'src/activity-types/extendedActivity.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ContentEditor } from 'src/components/activities/content';
import { ActivityContext } from 'src/contexts/activityContext';
import { ActivityStatus } from 'types/activity.type';

const DefiStep3: React.FC = () => {
  const router = useRouter();
  const { activity, updateActivity, addContent, deleteContent, save } = React.useContext(ActivityContext);

  const data = (activity?.data as LanguageDefiData) || null;
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/lancer-un-defi');
    } else if (activity && (!isDefi(activity) || (isDefi(activity) && !isLanguage(activity)))) {
      router.push('/lancer-un-defi');
    }
  }, [activity, router]);

  if (data === null || !isDefi(activity) || (isDefi(activity) && !isLanguage(activity))) {
    return <div></div>;
  }

  const updateContent = (content: EditorContent[]): void => {
    updateActivity({ processedContent: content });
  };

  const onNext = () => {
    save().catch(console.error);
    router.push('/lancer-un-defi/linguistique/5');
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps steps={(isEdit ? [] : ['Démarrer']).concat(['Votre plat', 'La recette', 'Le défi', 'Prévisualisation'])} activeStep={isEdit ? 2 : 3} />
        <div className="width-900">
          <h1>Écrivez la recette</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            À vous de montrer aux Pelicopains comment cuisiner ce plat ! Pensez à présenter les ingrédients, les étapes, et donnez vos astuces de
            chef.
          </p>
          <ContentEditor
            content={activity.processedContent}
            updateContent={updateContent}
            addContent={addContent}
            deleteContent={deleteContent}
            save={save}
          />
          <StepsButton prev="/lancer-un-defi/linguistique/3" next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default DefiStep3;
