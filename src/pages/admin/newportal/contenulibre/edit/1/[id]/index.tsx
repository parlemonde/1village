import { useRouter } from 'next/router';
import React from 'react';

import Layout from '../../../layout';
import { useGetOneActivityById } from 'src/api/activities/activities.getOneById';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import StepsNavigation from 'src/components/activities/StepsNavigation';
import { ContentEditor } from 'src/components/activities/content';
import { ActivityContext } from 'src/contexts/activityContext';
import type { ActivityContent } from 'types/activity.type';

const ContenuLibreStep1: React.FC = () => {
  const { updateActivity, addContent, deleteContent, save } = React.useContext(ActivityContext);
  const router = useRouter();
  const { id } = router.query;

  const { data: activity } = useGetOneActivityById({ id: Number(id) });

  // useEffect(() => {}, [activity, router]);

  const updateContent = (content: ActivityContent[]): void => {
    if (!activity) return;
    const newActivity = { ...activity, content, villageId: undefined };
    updateActivity(newActivity);
  };

  const onNext = async (): Promise<void> => {
    const success = await save();
    if (success) {
      router.push(`/admin/newportal/contenulibre/edit/2/` + id);
    }
  };

  if (!activity) {
    return <Base hideLeftNav />;
  }

  return (
    <Layout>
      <StepsNavigation currentStep={0} isEdit={true} id={id as unknown as number} />
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
