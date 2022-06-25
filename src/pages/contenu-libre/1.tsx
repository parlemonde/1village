import { useRouter } from 'next/router';
import React from 'react';

import { isFreeContent } from 'src/activity-types/anyActivity';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { ContentEditor } from 'src/components/activities/content';
import { BackButton } from 'src/components/buttons/BackButton';
import { ActivityContext } from 'src/contexts/activityContext';
import type { ActivityContent } from 'types/activity.type';
import { ActivityStatus } from 'types/activity.type';

const ContenuLibre = () => {
  const router = useRouter();
  const { activity, updateActivity, addContent, deleteContent, save } = React.useContext(ActivityContext);

  const isEdit = activity !== null && activity.status !== ActivityStatus.DRAFT;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/contenu-libre');
    } else if (activity && !isFreeContent(activity)) {
      router.push('/contenu-libre');
    }
  }, [activity, router]);

  const updateContent = (content: ActivityContent[]): void => {
    if (!activity) {
      return;
    }
    updateActivity({ content });
  };

  const onNext = () => {
    save().catch(console.error);
    router.push('/contenu-libre/2');
  };

  if (!activity) {
    return <Base />;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        {!isEdit && <BackButton href="/contenu-libre" />}
        <Steps
          steps={['Contenu', 'Forme', 'Pré-visualiser']}
          urls={['/contenu-libre/1?edit', '/contenu-libre/2', '/contenu-libre/3']}
          activeStep={0}
        />
        <div className="width-900">
          <h1>Ecrivez le contenu de votre publication</h1>
          <p className="text">
            Utilisez l&apos;éditeur de bloc pour définir le contenu de votre publication. Dans l&apos;étape 2 vous pourrez définir l&apos;aspect de la
            carte résumée de votre publication.
          </p>
          <ContentEditor content={activity.content} updateContent={updateContent} addContent={addContent} deleteContent={deleteContent} />
          <StepsButton next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default ContenuLibre;
