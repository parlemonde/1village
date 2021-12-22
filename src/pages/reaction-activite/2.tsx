import { useRouter } from 'next/router';
import React from 'react';

import { isReaction } from 'src/activity-types/anyActivity';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ContentEditor } from 'src/components/activities/content';
import { ActivityContext } from 'src/contexts/activityContext';
import type { ActivityContent } from 'types/activity.type';

const ReactionStep2 = () => {
  const router = useRouter();
  const { activity, updateActivity, addContent, deleteContent, save } = React.useContext(ActivityContext);

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/reaction-activite/1');
    } else if (activity && !isReaction(activity)) {
      router.push('/reaction-activite/1');
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
    router.push('/reaction-activite/3');
  };

  if (!activity) {
    return <Base />;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps steps={['Activité', 'Réaction', 'Prévisualisation']} activeStep={1} />
        <div className="width-900">
          <h1>Réagissez à l&apos;activité sélectionnée</h1>
          <ContentEditor content={activity.content} updateContent={updateContent} addContent={addContent} deleteContent={deleteContent} save={save} />
          <StepsButton prev="/reaction-activite/1" next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default ReactionStep2;
