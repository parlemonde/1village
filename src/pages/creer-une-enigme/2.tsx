import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { Button } from '@material-ui/core';

import { isEnigme } from 'src/activities/anyActivity';
import { ENIGME_DATA, ENIGME_TYPES } from 'src/activities/enigme.const';
import { EnigmeData } from 'src/activities/enigme.types';
import { EditorContent, EditorTypes } from 'src/activities/extendedActivity.types';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { SimpleActivityEditor } from 'src/components/activities';
import { BackButton } from 'src/components/buttons/BackButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { ActivityStatus } from 'types/activity.type';

const EnigmeStep2: React.FC = () => {
  const router = useRouter();
  const { activity, updateActivity, addContent, deleteContent, save } = React.useContext(ActivityContext);

  const data = (activity?.data as EnigmeData) || null;
  const indiceContentIndex = Math.max(data?.indiceContentIndex ?? 0, 0);
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;

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
        {activity !== null && <BackButton href={`/creer-une-enigme/1?edit=${activity.id}`} label={isEdit ? 'Modifier' : 'Retour'} />}
        <Steps
          steps={[
            enigmeData[data.theme]?.step ?? 'Choix de la catégorie',
            enigmeType.step2 ?? "Description de l'objet",
            "Création de l'indice",
            'Prévisualisation',
          ]}
          activeStep={1}
        />
        <div className="width-900">
          <h1>{enigmeType.titleStep2}</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            Decrivez ici votre {enigmeType.titleStep2Short}, il s’agira de la <strong>réponse</strong> partagée aux autres classes. Vous pouvez
            ajouter du texte, une vidéo ou une image à votre description. Vous pourrez le modifier à l’étape 4.
          </p>
          <SimpleActivityEditor
            content={activity.processedContent.slice(0, indiceContentIndex)}
            updateContent={updateContent}
            addContent={addDescriptionContent}
            deleteContent={deleteDescriptionContent}
            save={save}
          />
          <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
            <Link href="/creer-une-enigme/3">
              <Button component="a" href="/creer-une-enigme/3" variant="outlined" color="primary">
                Étape suivante
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Base>
  );
};

export default EnigmeStep2;
