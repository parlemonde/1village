import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';

import { isDefi } from 'src/activity-types/anyActivity';
import { isLanguage, LANGUAGE_OBJECTS } from 'src/activity-types/defi.constants';
import type { LanguageDefiData } from 'src/activity-types/defi.types';
import type { EditorContent, EditorTypes } from 'src/activity-types/extendedActivity.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ContentEditor } from 'src/components/activities/content';
import { ActivityContext } from 'src/contexts/activityContext';
import { ActivityStatus } from 'types/activity.type';

const DefiStep4 = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { activity, updateActivity, addContent, deleteContent, save } = React.useContext(ActivityContext);

  const data = (activity?.data as LanguageDefiData) || null;
  const explanationContentIndex = Math.max(data?.explanationContentIndex ?? 0, 0);
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;

  const contentAdded = React.useRef(false);
  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/lancer-un-defi');
    } else if (activity && (!isDefi(activity) || (isDefi(activity) && !isLanguage(activity)))) {
      router.push('/lancer-un-defi');
    }

    if (activity && isDefi(activity) && isLanguage(activity)) {
      if ((activity.data.explanationContentIndex ?? 0) > activity.processedContent.length) {
        updateActivity({
          data: {
            ...activity.data,
            explanationContentIndex: activity.processedContent.length,
          },
        });
      }
      if ((activity.data.explanationContentIndex ?? 0) === activity.processedContent.length && !contentAdded.current) {
        contentAdded.current = true;
        addContent('text');
      }
    }
  }, [activity, router, updateActivity, addContent]);

  if (data === null || !isDefi(activity) || (isDefi(activity) && !isLanguage(activity))) {
    return <div></div>;
  }

  const updateContent = (content: EditorContent[]): void => {
    updateActivity({ processedContent: [...activity.processedContent.slice(0, explanationContentIndex), ...content] });
  };
  const addIndiceContent = (type: EditorTypes, value?: string) => {
    contentAdded.current = true;
    addContent(type, value);
  };
  const deleteIndiceContent = (index: number) => {
    contentAdded.current = true; // delete means there were content already
    deleteContent(explanationContentIndex + index);
  };

  const onNext = () => {
    if (explanationContentIndex === activity.processedContent.length) {
      enqueueSnackbar('Il faut au moins un bloc de texte, image, son ou vidéo avant de continuer.', {
        variant: 'error',
      });
      return;
    }
    save().catch(console.error);
    router.push('/lancer-un-defi/linguistique/5');
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={(isEdit ? [] : ['Démarrer']).concat(['Choix de la langue', "Choix de l'objet", 'Explication', 'Le défi', 'Prévisualisation'])}
          activeStep={isEdit ? 2 : 3}
        />
        <div className="width-900">
          <h1>{'Explication'}</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            {LANGUAGE_OBJECTS[data.objectIndex % LANGUAGE_OBJECTS.length].desc2}
          </p>
          <ContentEditor
            content={activity.processedContent.slice(explanationContentIndex, activity.processedContent.length)}
            updateContent={updateContent}
            addContent={addIndiceContent}
            deleteContent={deleteIndiceContent}
            save={save}
          />
          <StepsButton prev="/lancer-un-defi/linguistique/3" next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default DefiStep4;
