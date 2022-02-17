import { useRouter } from 'next/router';
import React from 'react';

import { isEnigme } from 'src/activity-types/anyActivity';
import { ENIGME_DATA, ENIGME_TYPES, getEnigme } from 'src/activity-types/enigme.constants';
import type { EnigmeData } from 'src/activity-types/enigme.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ContentEditor } from 'src/components/activities/content';
import { getErrorSteps } from 'src/components/activities/enigmeChecks';
import { ActivityContext } from 'src/contexts/activityContext';
import { capitalize } from 'src/utils';
import type { ActivityContent, ActivityContentType } from 'types/activity.type';

const EnigmeStep2 = () => {
  const router = useRouter();
  const { activity, updateActivity, addContent, deleteContent, save } = React.useContext(ActivityContext);

  const data = (activity?.data as EnigmeData) || null;
  const indiceContentIndex = data?.indiceContentIndex ?? 0;

  const errorSteps = React.useMemo(() => {
    if (data !== null) {
      return getErrorSteps(data, 1);
    }
    return [];
  }, [data]);

  const contentAdded = React.useRef(false);
  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/creer-une-enigme');
    } else if (activity && !isEnigme(activity)) {
      router.push('/creer-une-enigme');
    }

    if (activity && isEnigme(activity)) {
      if ((activity.data.indiceContentIndex ?? 0) > activity.content.length) {
        updateActivity({
          data: {
            ...activity.data,
            indiceContentIndex: activity.content.length,
          },
        });
      }
      if ((activity.data.indiceContentIndex ?? 0) === activity.content.length && !contentAdded.current) {
        contentAdded.current = true;
        addContent('text');
      }
    }
  }, [activity, router, updateActivity, addContent]);

  const updateContent = (content: ActivityContent[]): void => {
    if (!activity) {
      return;
    }
    updateActivity({ content: [...activity.content.slice(0, indiceContentIndex), ...content] });
  };
  const addIndiceContent = (type: ActivityContentType, value?: string) => {
    contentAdded.current = true;
    addContent(type, value);
  };
  const deleteIndiceContent = (index: number) => {
    contentAdded.current = true; // delete means there were content already
    deleteContent(indiceContentIndex + index);
  };

  if (data === null || activity === null || !isEnigme(activity)) {
    return <div></div>;
  }

  const onNext = () => {
    save().catch(console.error);
    router.push('/creer-une-enigme/3');
  };

  const enigmeType = ENIGME_TYPES[activity.subType ?? 0] ?? ENIGME_TYPES[0];
  const enigmeData = ENIGME_DATA[activity.subType ?? 0] ?? ENIGME_DATA[0];

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={[
            data.theme === -1
              ? capitalize(data.themeName ?? '')
              : activity.subType === -1
              ? getEnigme(activity.subType, data).step1
              : enigmeData[data.theme]?.step ?? 'Thème',
            'Énigme',
            'Réponse',
            'Prévisualisation',
          ]}
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
            content={activity.content.slice(indiceContentIndex, activity.content.length)}
            updateContent={updateContent}
            addContent={addIndiceContent}
            deleteContent={deleteIndiceContent}
            save={save}
          />
          <StepsButton prev={`/creer-une-enigme/1?edit=${activity.id}`} next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default EnigmeStep2;
