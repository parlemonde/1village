import { useRouter } from 'next/router';
import React from 'react';

import { isEnigme } from 'src/activity-types/anyActivity';
import { ENIGME_TYPES, getSubcategoryName } from 'src/activity-types/enigme.constants';
import type { EnigmeData } from 'src/activity-types/enigme.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ContentEditor } from 'src/components/activities/content';
import { getErrorSteps } from 'src/components/activities/enigmeChecks';
import { ActivityContext } from 'src/contexts/activityContext';
import type { ActivityContent, ActivityContentType } from 'types/activity.type';

const EnigmeStep2 = () => {
  const router = useRouter();
  const { activity, updateActivity, addContent, deleteContent, save } = React.useContext(ActivityContext);

  const data = (activity?.data as EnigmeData) || null;
  const indiceContentIndex = Math.max(data?.indiceContentIndex ?? 0, 0);
  const errorSteps = React.useMemo(() => {
    if (data !== null) {
      return getErrorSteps(data, 1);
    }
    return [];
  }, [data]);

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/creer-une-enigme');
    } else if (activity && !isEnigme(activity)) {
      router.push('/creer-une-enigme');
    }
  }, [activity, router]);

  const updateContent = (content: ActivityContent[]): void => {
    if (!activity) {
      return;
    }
    updateActivity({ content: [...content, ...activity.content.slice(indiceContentIndex, activity.content.length)] });
  };
  const addDescriptionContent = (type: ActivityContentType, value?: string) => {
    addContent(type, value, indiceContentIndex);
    updateActivity({ data: { ...data, indiceContentIndex: indiceContentIndex + 1 } });
  };
  const deleteDescriptionContent = (index: number) => {
    deleteContent(index);
    updateActivity({ data: { ...data, indiceContentIndex: indiceContentIndex - 1 } });
  };

  if (data === null || activity === null || !isEnigme(activity)) {
    return <div></div>;
  }

  const onNext = () => {
    save().catch(console.error);
    router.push('/creer-une-enigme/3');
  };

  const enigmeType = ENIGME_TYPES[activity.subType ?? 0] ?? ENIGME_TYPES[0];

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={[getSubcategoryName(activity.data.theme, data, activity.subType).title, 'Énigme', 'Réponse', 'Prévisualisation']}
          urls={['/creer-une-enigme/1?edit', '/creer-une-enigme/2', '/creer-une-enigme/3', '/creer-une-enigme/4']}
          activeStep={1}
          errorSteps={errorSteps}
        />
        <div className="width-900">
          <h1>Créez l’énigme, pour faire deviner votre objet</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            Faites deviner votre {enigmeType.titleStep2Short} à vos Pélicopains en donnant des indices en vidéos, images, sons et texte !<br></br> À
            l’étape suivante, vous écrirez la réponse à l’énigme.
          </p>
          <ContentEditor
            content={activity.content.slice(0, indiceContentIndex)}
            updateContent={updateContent}
            addContent={addDescriptionContent}
            deleteContent={deleteDescriptionContent}
            save={save}
          />
          <StepsButton prev={`/creer-une-enigme/1?edit=${activity.id}`} next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default EnigmeStep2;
