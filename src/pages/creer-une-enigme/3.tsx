import { useRouter } from 'next/router';
import React from 'react';

import { isEnigme } from 'src/activity-types/anyActivity';
import { ENIGME_DATA, ENIGME_TYPES } from 'src/activity-types/enigme.const';
import { EnigmeData } from 'src/activity-types/enigme.types';
import { EditorContent, EditorTypes } from 'src/activity-types/extendedActivity.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ContentEditor } from 'src/components/activities/content';
import { ActivityContext } from 'src/contexts/activityContext';
import { capitalize } from 'src/utils';
import { ActivityStatus } from 'types/activity.type';

const EnigmeStep3: React.FC = () => {
  const router = useRouter();
  const { activity, updateActivity, addContent, deleteContent, save } = React.useContext(ActivityContext);

  const data = (activity?.data as EnigmeData) || null;
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;
  const indiceContentIndex = Math.max(data?.indiceContentIndex ?? 0, 0);

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/creer-une-enigme');
    } else if (activity && !isEnigme(activity)) {
      router.push('/creer-une-enigme');
    }
  }, [activity, router]);

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

  if (data === null || !isEnigme(activity)) {
    return <div></div>;
  }

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
          activeStep={isEdit ? 1 : 2}
        />
        <div className="width-900">
          <h1>{enigmeType.titleStep2}</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            Decrivez ici votre {enigmeType.titleStep2Short}, il s’agira de la <strong>réponse</strong> partagée aux autres classes. Vous pouvez
            ajouter du texte, une vidéo ou une image à votre description. Vous pourrez le modifier à l’étape 4.
          </p>
          <ContentEditor
            content={activity.processedContent.slice(0, indiceContentIndex)}
            updateContent={updateContent}
            addContent={addDescriptionContent}
            deleteContent={deleteDescriptionContent}
            save={save}
          />
          <StepsButton prev="/creer-une-enigme/2" next="/creer-une-enigme/4" />
        </div>
      </div>
    </Base>
  );
};

export default EnigmeStep3;
