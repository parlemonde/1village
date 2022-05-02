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
  const url = 'edit' in router.query ? '/reagir-a-une-activite/1?edit' : '/reagir-a-une-activite/1';
  const data = activity?.data || null;

  const errorSteps = React.useMemo(() => {
    if (data !== null && activity?.responseActivityId === null) {
      return [0]; //corresponding to step 1
    }
    return [];
  }, [activity?.responseActivityId, data]);

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/reagir-a-une-activite/1');
    } else if (activity && !isReaction(activity)) {
      router.push('/reagir-a-une-activite/1');
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
    router.push('/reagir-a-une-activite/3');
  };

  if (!activity) {
    return <Base />;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={['Activité', 'Réaction', 'Prévisualisation']}
          urls={['/reagir-a-une-activite/1?edit', '/reagir-a-une-activite/2', '/reagir-a-une-activite/3']}
          activeStep={1}
          errorSteps={errorSteps}
        />
        <div className="width-900">
          <h1>Réagissez à l&apos;activité sélectionnée</h1>
          <ContentEditor content={activity.content} updateContent={updateContent} addContent={addContent} deleteContent={deleteContent} />
          <StepsButton prev={url} next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default ReactionStep2;
