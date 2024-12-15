import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import Layout from '../layout';
import { isFreeContent } from 'src/activity-types/anyActivity';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import StepsNavigation from 'src/components/activities/StepsNavigation';
import { ContentEditor } from 'src/components/activities/content';
import { ActivityContext } from 'src/contexts/activityContext';
import type { ActivityContent } from 'types/activity.type';

const ContenuLibreStep1: React.FC = () => {
  const { activity, updateActivity, addContent, deleteContent, save } = React.useContext(ActivityContext);
  const router = useRouter();

  useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/admin/newportal/contenulibre/1');
    } else if (activity && !isFreeContent(activity)) {
      router.push('/admin/newportal/contenulibre/1');
    }
  }, [activity, router]);

  const updateContent = (content: ActivityContent[]): void => {
    if (!activity) return;
    const newActivity = { ...activity, content, villageId: undefined };
    updateActivity(newActivity);
  };

  const onNext = async (): Promise<void> => {
    const success = await save();
    if (success) {
      router.push('/admin/newportal/contenulibre/2');
    }
  };

  if (!activity) {
    return <Base hideLeftNav />;
  }

  return (
    <Layout>
      <StepsNavigation currentStep={0} />
      <h1>Ecrivez le contenu de votre publication</h1>
      <p>
        Utilisez l&apos;éditeur de bloc pour définir le contenu de votre publication. Dans l&apos;étape 2 vous pourrez définir l&apos;aspect de la
        carte résumée de votre publication.
      </p>
      <ContentEditor content={activity.content} updateContent={updateContent} addContent={addContent} deleteContent={deleteContent} />

      <StepsButton next={onNext} />
    </Layout>
  );
};

export default ContenuLibreStep1;
