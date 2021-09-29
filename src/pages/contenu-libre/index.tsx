import { useRouter } from 'next/router';
import React from 'react';

import type { EditorContent, EditorTypes } from 'src/activity-types/extendedActivity.types';
import type { FreeContentData } from 'src/activity-types/freeContent.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ContentEditor } from 'src/components/activities/content';
import { ActivityContext } from 'src/contexts/activityContext';
import { ActivityType } from 'types/activity.type';

const ContenuLibre = () => {
  const router = useRouter();
  const { activity, createNewActivity, updateActivity, addContent, deleteContent, save } = React.useContext(ActivityContext);
  const data = (activity?.data as FreeContentData) || null;
  const indiceContentIndex = Math.max(data?.indiceContentIndex ?? 0, 0);

  const updateContent = (content: EditorContent[]): void => {
    updateActivity({ processedContent: [...content, ...activity.processedContent.slice(indiceContentIndex, activity.processedContent.length)] });
  };
  const addDescriptionContent = (type: EditorTypes, value?: string) => {
    addContent(type, value, indiceContentIndex);
    updateActivity({ data: { ...data, indiceContentIndex: indiceContentIndex + 1 } });
  };
  const deleteDescriptionContent = (index: number) => {
    deleteContent(index);
    updateActivity({ data: { ...data, indiceContentIndex: indiceContentIndex - 1 } });
  };

  const onNext = () => {
    const success = createNewActivity(ActivityType.CONTENU_LIBRE);
    if (success) {
      router.push('/contenu-libre/2');
    }
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps steps={['Contenu', 'Forme', 'Pré-visualiser']} activeStep={0} />
        <div className="width-900">
          <h1>Ecrivez le contenu de votre publication</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            Utilisez l&apos;éditeur de bloc pour définir le contenu de votre publication ; dans l&apos;étape 2 vous pourrez définir l&apos;aspect de
            la carte résumée de votre publication.
          </p>
          <ContentEditor
            content={activity?.processedContent}
            updateContent={updateContent}
            addContent={addDescriptionContent}
            deleteContent={deleteDescriptionContent}
            save={save}
          />
          <StepsButton next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default ContenuLibre;
