import { useRouter } from 'next/router';
import React from 'react';

import { isFreeContent } from 'src/activity-types/anyActivity';
import type { EditorContent } from 'src/activity-types/extendedActivity.types';
import type { FreeContentData } from 'src/activity-types/freeContent.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ContentEditor } from 'src/components/activities/content';
import { ActivityContext } from 'src/contexts/activityContext';

// import { ActivityStatus } from 'types/activity.type';

const ContenuLibre = () => {
  const router = useRouter();
  const { activity, updateActivity, addContent, deleteContent, save } = React.useContext(ActivityContext);

  const data = (activity?.data as FreeContentData) || null;
  // const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;
  const indiceContentIndex = data?.indiceContentIndex ?? 0;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/indice-culturel');
    } else if (activity && !isFreeContent(activity)) {
      router.push('/indice-culturel');
    }
  }, [activity, router]);

  const updateContent = (content: EditorContent[]): void => {
    updateActivity({ processedContent: [...activity.processedContent.slice(0, indiceContentIndex), ...content] });
  };

  const onNext = () => {
    save().catch(console.error);
    router.push('/contenu-libre/2');
  };

  return (
    activity && (
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
              content={activity.processedContent}
              updateContent={updateContent}
              addContent={addContent}
              deleteContent={deleteContent}
              save={save}
            />
            <StepsButton prev="/contenu-libre" next={onNext} />
          </div>
        </div>
      </Base>
    )
  );
};

export default ContenuLibre;
