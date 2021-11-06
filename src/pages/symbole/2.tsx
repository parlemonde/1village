import { useRouter } from 'next/router';
import React from 'react';

import { isSymbol } from 'src/activity-types/anyActivity';
import { getSymbol } from 'src/activity-types/symbol.constants';
import type { SymbolData } from 'src/activity-types/symbol.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ContentEditor } from 'src/components/activities/content';
import { ActivityContext } from 'src/contexts/activityContext';
import { ActivityStatus } from 'types/activity.type';
import type { ActivityContent } from 'types/activity.type';

const SymbolStep2 = () => {
  const router = useRouter();
  const { activity, updateActivity, addContent, deleteContent, save } = React.useContext(ActivityContext);

  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;
  const data = (activity?.data as SymbolData) || null;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/symbole');
    } else if (activity && !isSymbol(activity)) {
      router.push('/symbole');
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
    router.push('/symbole/3');
  };

  if (activity === null || data === null) {
    return <div></div>;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps steps={[getSymbol(activity.subType, data).step1, 'Créer le symbole', 'Prévisualiser']} activeStep={isEdit ? 0 : 1} />
        <div className="width-900">
          <h1>Faites une présentation libre de votre symbole</h1>
          <p className="text">
            Si vous souhaitez réaliser un film, n&apos;hésitez pas à utiliser{' '}
            <a className="text" target="_blank" rel="noopener noreferrer" href="https://clap.parlemonde.org">
              Clap!
            </a>
            , un outil d&apos;aide à l&apos;écriture audiovisuel !
          </p>
          <ContentEditor content={activity.content} updateContent={updateContent} addContent={addContent} deleteContent={deleteContent} save={save} />
          <StepsButton prev="/symbole/1?edit" next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default SymbolStep2;
