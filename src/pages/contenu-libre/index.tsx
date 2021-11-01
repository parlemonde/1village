import { useRouter } from 'next/router';
import React from 'react';

import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { ActivityType } from 'types/activity.type';
import { UserType } from 'types/user.type';

const ContenuLibre = () => {
  const router = useRouter();
  const { createNewActivity } = React.useContext(ActivityContext);
  const { user } = React.useContext(UserContext);
  const isModerator = user !== null && user.type >= UserType.MEDIATOR;

  const onNext = () => {
    const success = createNewActivity(ActivityType.CONTENU_LIBRE);
    if (success) {
      router.push('/contenu-libre/1');
    }
  };

  if (!isModerator) {
    return <h1>Vous n&apos;avez pas accès à cette page, vous devez être modérateur.</h1>;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <div className="width-900">
          <h1>Publication de contenu libre</h1>
          <p className="text">
            Dans cette activité, nous vous proposons de créer une publication libre. Vous pourrez ensuite partager cette publication et décider de
            l&apos;épingler dans le fil d&apos;actualité.
          </p>
          <StepsButton next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default ContenuLibre;
