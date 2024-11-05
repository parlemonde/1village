/* eslint-disable no-console */
import { useRouter } from 'next/router';
import React from 'react';

import { Base } from 'src/components/Base';
import { PageLayout } from 'src/components/PageLayout';
import { StepsButton } from 'src/components/StepsButtons';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { ActivityType } from 'types/activity.type';
import { UserType } from 'types/user.type';

const ContenuLibre = () => {
  const router = useRouter();
  const { createNewActivity } = React.useContext(ActivityContext);
  const { user } = React.useContext(UserContext);
  const { selectedPhase } = React.useContext(VillageContext);

  const isModerator = user !== null && user.type <= UserType.TEACHER;

  const onNext = () => {
    const success = createNewActivity(ActivityType.CONTENU_LIBRE, selectedPhase);
    if (success) {
      router.push('/contenu-libre/1');
    }
  };

  if (!isModerator) {
    return <h1>Vous n&apos;avez pas accès à cette page, vous devez être modérateur.</h1>;
  }

  return (
    <Base>
      <PageLayout>
        <div className="width-900">
          <h1 style={{ marginTop: '0.5rem' }}>Publication de contenu libre</h1>
          <p className="text">
            Dans cette activité, nous vous proposons de créer une publication libre. Vous pourrez ensuite partager cette publication et décider de
            l&apos;épingler dans le fil d&apos;actualité.
          </p>
          <StepsButton next={onNext} />
        </div>
      </PageLayout>
    </Base>
  );
};
export default ContenuLibre;
