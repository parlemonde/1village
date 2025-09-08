import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo } from 'react';

import { isDefi } from 'src/activity-types/anyActivity';
import { isFree } from 'src/activity-types/defi.constants';
import type { FreeDefiData } from 'src/activity-types/defi.types';
import { Base } from 'src/components/Base';
import { PageLayout } from 'src/components/PageLayout';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { ContentEditor } from 'src/components/activities/content';
import { getErrorSteps } from 'src/components/activities/defiChecksFree';
import { ActivityContext } from 'src/contexts/activityContext';
import type { ActivityContent } from 'types/activity.type';

const FreeDefiStep2 = () => {
  const router = useRouter();
  const { activity, updateActivity, addContent, deleteContent, save } = useContext(ActivityContext);

  const data = (activity?.data as FreeDefiData) || null;

  const errorSteps = useMemo(() => {
    if (data !== null) {
      return getErrorSteps(data, 1);
    }
    return [];
  }, [data]);

  useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/lancer-un-defi');
    } else if (activity && (!isDefi(activity) || (isDefi(activity) && !isFree(activity)))) {
      router.push('/lancer-un-defi');
    }
  }, [activity, router]);

  if (data === null || activity === null || !isDefi(activity) || (isDefi(activity) && !isFree(activity))) {
    return <div></div>;
  }

  const updateContent = (content: ActivityContent[]): void => {
    updateActivity({ content: content });
  };

  const onNext = () => {
    save().catch(console.error);
    router.push('/lancer-un-defi/3');
  };

  return (
    <Base>
      <PageLayout>
        <Steps
          steps={[data.themeName || 'Thème', 'Action', 'Le défi', 'Prévisualisation']}
          urls={['/lancer-un-defi/1?edit', '/lancer-un-defi/2', '/lancer-un-defi/3', '/lancer-un-defi/4']}
          activeStep={1}
          errorSteps={errorSteps}
        />
        <div className="width-900">
          <h1>Choisissez une action et décrivez-la</h1>
          <ContentEditor content={activity.content} updateContent={updateContent} addContent={addContent} deleteContent={deleteContent} />
          <StepsButton prev={`/lancer-un-defi/1?edit=${activity.id}`} next={onNext} />
        </div>
      </PageLayout>
    </Base>
  );
};

export default FreeDefiStep2;
