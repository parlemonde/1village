import { useRouter } from 'next/router';
import React from 'react';

import { isEnigme } from 'src/activity-types/anyActivity';
import { ENIGME_DATA, ENIGME_TYPES } from 'src/activity-types/enigme.const';
import type { EnigmeData } from 'src/activity-types/enigme.types';
import type { EditorContent, EditorTypes } from 'src/activity-types/extendedActivity.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ContentEditor } from 'src/components/activities/content';
import { ActivityContext } from 'src/contexts/activityContext';
import { capitalize } from 'src/utils';
import { ActivityStatus } from 'types/activity.type';

const EnigmeStep4 = () => {
  const router = useRouter();
  const { activity, updateActivity, addContent, deleteContent, save } = React.useContext(ActivityContext);

  const data = (activity?.data as EnigmeData) || null;
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;
  const indiceContentIndex = data?.indiceContentIndex ?? 0;

  const contentAdded = React.useRef(false);
  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/creer-une-enigme');
    } else if (activity && !isEnigme(activity)) {
      router.push('/creer-une-enigme');
    }

    if (activity && isEnigme(activity)) {
      if ((activity.data.indiceContentIndex ?? 0) > activity.processedContent.length) {
        updateActivity({
          data: {
            ...activity.data,
            indiceContentIndex: activity.processedContent.length,
          },
        });
      }
      if ((activity.data.indiceContentIndex ?? 0) === activity.processedContent.length && !contentAdded.current) {
        contentAdded.current = true;
        addContent('text');
      }
    }
  }, [activity, router, updateActivity, addContent]);

  const updateContent = (content: EditorContent[]): void => {
    updateActivity({ processedContent: [...activity.processedContent.slice(0, indiceContentIndex), ...content] });
  };
  const addIndiceContent = (type: EditorTypes, value?: string) => {
    contentAdded.current = true;
    addContent(type, value);
  };
  const deleteIndiceContent = (index: number) => {
    contentAdded.current = true; // delete means there were content already
    deleteContent(indiceContentIndex + index);
  };

  if (data === null || !isEnigme(activity)) {
    return <div></div>;
  }

  const onNext = () => {
    save().catch(console.error);
    router.push('/creer-une-enigme/5');
  };

  const enigmeType = ENIGME_TYPES[activity.subType ?? 0] ?? ENIGME_TYPES[0];
  const enigmeData = ENIGME_DATA[activity.subType ?? 0] ?? ENIGME_DATA[0];

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={(isEdit ? [] : ['Démarrer']).concat([
            data.theme === -1 ? capitalize(data.themeName ?? '') : enigmeData[data.theme]?.step ?? 'Choix de la catégorie',
            enigmeType.step2 ?? "Description de l'objet",
            "Création de l'indice",
            'Prévisualisation',
          ])}
          activeStep={isEdit ? 2 : 3}
        />
        <div className="width-900">
          <h1>Créer votre indice</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            Créez ici un <strong>indice</strong> pour faire deviner votre {enigmeType.titleStep2Short}. Vous pouvez ajouter du texte, une vidéo ou une
            image à votre indice et vous pourrez le modifier à l’étape 4.
          </p>
          <ContentEditor
            content={activity.processedContent.slice(indiceContentIndex, activity.processedContent.length)}
            updateContent={updateContent}
            addContent={addIndiceContent}
            deleteContent={deleteIndiceContent}
            save={save}
          />
          <StepsButton prev="/creer-une-enigme/3" next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default EnigmeStep4;
