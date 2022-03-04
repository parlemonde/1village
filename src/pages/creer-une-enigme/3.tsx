import { useRouter } from 'next/router';
import React from 'react';

import { isEnigme } from 'src/activity-types/anyActivity';
import { getSubcategoryName } from 'src/activity-types/enigme.constants';
import type { EnigmeData } from 'src/activity-types/enigme.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ContentEditor } from 'src/components/activities/content';
import { getErrorSteps } from 'src/components/activities/enigmeChecks';
import { ActivityContext } from 'src/contexts/activityContext';
import type { ActivityContent, ActivityContentType } from 'types/activity.type';

const EnigmeStep3 = () => {
  const router = useRouter();
  const { activity, updateActivity, addContent, deleteContent, save } = React.useContext(ActivityContext);

  const data = (activity?.data as EnigmeData) || null;
  const indiceContentIndex = data?.indiceContentIndex ?? 0;

  const errorSteps = React.useMemo(() => {
    const fieldStep2 = activity?.content.filter((d) => d.value !== '' && d.value !== '<p></p>\n'); // if value is empty in step 2
    if (data !== null && fieldStep2?.length === 0) {
      const errors = getErrorSteps(data, 1);
      errors.push(1); //corresponding to step 2
      return errors;
    }
    if (data !== null) return getErrorSteps(data, 1);

    return [];
  }, [activity?.content, data]);

  const contentAdded = React.useRef(false);
  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/creer-une-enigme');
    } else if (activity && !isEnigme(activity)) {
      router.push('/creer-une-enigme');
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

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={[getSubcategoryName(activity.data.theme, data, activity.subType).title, 'Énigme', 'Réponse', 'Prévisualisation']}
          urls={['/creer-une-enigme/1?edit', '/creer-une-enigme/2', '/creer-une-enigme/3', '/creer-une-enigme/4']}
          activeStep={2}
          errorSteps={errorSteps}
        />
        <div className="width-900">
          <h1>Créez la réponse à votre énigme</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            À présent, écrivez la réponse à votre énigme, en donnant des explications à vos Pélicopains. Votre réponse ne sera visible que{' '}
            <strong>7 jours</strong> après la publication de votre énigme, pour laisser le temps à vos Pélicopains de faire des recherches, et de vous
            poser des questions !
          </p>
          <ContentEditor
            content={activity.content.slice(indiceContentIndex, activity.content.length)}
            updateContent={updateContent}
            addContent={addIndiceContent}
            deleteContent={deleteIndiceContent}
            save={save}
          />
          <StepsButton prev={`/creer-une-enigme/2`} next="/creer-une-enigme/4" />
        </div>
      </div>
    </Base>
  );
};

export default EnigmeStep3;
