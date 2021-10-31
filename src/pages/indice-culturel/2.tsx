import { useRouter } from 'next/router';
import React from 'react';

import { isIndice } from 'src/activity-types/anyActivity';
import { INDICE_TYPES } from 'src/activity-types/indice.constants';
import type { IndiceData } from 'src/activity-types/indice.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ContentEditor } from 'src/components/activities/content';
import { ActivityContext } from 'src/contexts/activityContext';
import type { ActivityContent } from 'types/activity.type';
import { ActivityStatus } from 'types/activity.type';

const IndiceStep2 = () => {
  const router = useRouter();
  const { activity, updateActivity, addContent, deleteContent, save } = React.useContext(ActivityContext);

  const data = (activity?.data as IndiceData) || null;
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;
  const indiceContentIndex = data?.indiceContentIndex ?? 0;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/indice-culturel');
    } else if (activity && !isIndice(activity)) {
      router.push('/indice-culturel');
    }
  }, [activity, router]);

  const updateContent = (content: ActivityContent[]): void => {
    if (!activity) {
      return;
    }
    updateActivity({ content: [...activity.content.slice(0, indiceContentIndex), ...content] });
  };

  const onNext = () => {
    save().catch(console.error);
    router.push('/indice-culturel/3');
  };

  if (data === null || activity === null || !('theme' in data) || data.theme === -1) {
    return <div></div>;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps steps={[INDICE_TYPES[activity.subType || 0].step1 ?? 'Indice', "Créer l'indice", 'Prévisualiser']} activeStep={isEdit ? 0 : 1} />
        <div className="width-900">
          <h1>Faites une présentation libre de votre indice</h1>
          <p className="text">
            Si vous souhaitez réaliser un film, n&apos;hésitez pas à utiliser Clap, un outil d&apos;aide à l&apos;écriture audiovisuel !
          </p>
          <ContentEditor content={activity.content} updateContent={updateContent} addContent={addContent} deleteContent={deleteContent} save={save} />
          <StepsButton prev="/indice-culturel" next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default IndiceStep2;
