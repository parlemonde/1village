import { useRouter } from 'next/router';
import React from 'react';

import { isPresentation } from 'src/activity-types/anyActivity';
import { EditorContent } from 'src/activity-types/extendedActivity.types';
import { isThematique, PRESENTATION_THEMATIQUE } from 'src/activity-types/presentation.const';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ContentEditor } from 'src/components/activities/content';
import { ActivityContext } from 'src/contexts/activityContext';
import { ActivityStatus } from 'types/activity.type';

const PresentationStep3: React.FC = () => {
  const router = useRouter();
  const { activity, updateActivity, addContent, deleteContent, save } = React.useContext(ActivityContext);

  const data = activity?.data || null;
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/se-presenter');
    } else if (activity && (!isPresentation(activity) || !isThematique(activity))) {
      router.push('/se-presenter');
    }
  }, [activity, router]);

  const updateContent = (content: EditorContent[]): void => {
    updateActivity({ processedContent: content });
  };

  const onNext = () => {
    save().catch(console.error);
    router.push('/se-presenter/thematique/4');
  };

  if (data === null || !('theme' in data) || data.theme === -1) {
    return <div></div>;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps steps={(isEdit ? [] : ['Démarrer']).concat(['Choix du thème', 'Présentation', 'Prévisualisation'])} activeStep={isEdit ? 1 : 2} />
        <div className="width-900">
          <h1>{PRESENTATION_THEMATIQUE[data.theme].title}</h1>
          <ContentEditor
            content={activity.processedContent}
            updateContent={updateContent}
            addContent={addContent}
            deleteContent={deleteContent}
            save={save}
          />
          <StepsButton prev="/se-presenter/thematique/2" next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default PresentationStep3;
