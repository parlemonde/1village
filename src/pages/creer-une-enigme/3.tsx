import { useRouter } from 'next/router';
import React from 'react';

import { isEnigme } from 'src/activity-types/anyActivity';
import { ENIGME_DATA, ENIGME_TYPES } from 'src/activity-types/enigme.constants';
import type { EnigmeData } from 'src/activity-types/enigme.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ContentEditor } from 'src/components/activities/content';
import { getErrorSteps } from 'src/components/activities/enigmeChecks';
import { ActivityContext } from 'src/contexts/activityContext';
import { capitalize } from 'src/utils';
import type { ActivityContent, ActivityContentType } from 'types/activity.type';

const EnigmeStep3 = () => {
  const router = useRouter();
  const { activity, updateActivity, addContent, deleteContent, save } = React.useContext(ActivityContext);

  const data = (activity?.data as EnigmeData) || null;
  const indiceContentIndex = data?.indiceContentIndex ?? 0;

  const errorSteps = React.useMemo(() => {
    const fieldStep2 = activity?.content.filter((d) => d.value !== ''); // if value is empty in step 2
    if (data !== null && fieldStep2?.length === 0) {
      const errors = getErrorSteps(data, 2);
      errors.push(1); //corresponding to step 2
      return errors;
    }
    if (data !== null) return getErrorSteps(data, 2);
    return [];
  }, [activity?.content, data]);

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
    router.push('/creer-une-enigme/4');
  };

  const enigmeType = ENIGME_TYPES[activity.subType ?? 0] ?? ENIGME_TYPES[0];
  const enigmeData = ENIGME_DATA[activity.subType ?? 0] ?? ENIGME_DATA[0];

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={[
            data.theme === -1 ? capitalize(data.themeName ?? '') : enigmeData[data.theme]?.step ?? 'Choix de la catégorie',
            enigmeType.step1 ?? "Description de l'objet",
            "Création de l'indice",
            'Prévisualisation',
          ]}
          urls={['/creer-une-enigme/1?edit', '/creer-une-enigme/2', '/creer-une-enigme/3', '/creer-une-enigme/4']}
          activeStep={2}
          errorSteps={errorSteps}
        />
        <div className="width-900">
          <h1>Créer votre indice</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            Créez ici un <strong>indice</strong> pour faire deviner votre {enigmeType.titleStep2Short}. Vous pouvez ajouter du texte, une vidéo ou une
            image à votre indice et vous pourrez le modifier à l’étape 4.
          </p>
          <ContentEditor
            content={activity.content.slice(indiceContentIndex, activity.content.length)}
            updateContent={updateContent}
            addContent={addIndiceContent}
            deleteContent={deleteIndiceContent}
            save={save}
          />
          <StepsButton prev="/creer-une-enigme/2" next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default EnigmeStep3;
