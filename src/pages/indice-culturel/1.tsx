import { useRouter } from 'next/router';
import React from 'react';

import { INDICE_TYPES } from 'src/activity-types/indice.constants';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { Activities } from 'src/components/activities/List';
import { BackButton } from 'src/components/buttons/BackButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { useActivities } from 'src/services/useActivities';
import { getQueryString } from 'src/utils';
import { ActivityStatus, ActivityType } from 'types/activity.type';

const IndiceStep1 = () => {
  const router = useRouter();
  const { user } = React.useContext(UserContext);
  const { activity, createNewActivity } = React.useContext(ActivityContext);
  const isEdit = activity !== null && activity.status !== ActivityStatus.DRAFT;
  const { activities } = useActivities({
    page: 0,
    countries: user ? [user.country.isoCode.toUpperCase()] : [],
    pelico: true,
    type: ActivityType.INDICE,
  });
  const sameActivities = activity ? activities.filter((c) => c.subType === activity.subType) : [];

  const created = React.useRef(false);
  React.useEffect(() => {
    if (!created.current) {
      created.current = true;
      if (!('edit' in router.query)) {
        const indiceType = parseInt(getQueryString(router.query['category']) || '0', 10) || 0;
        createNewActivity(ActivityType.INDICE, indiceType, {
          theme: 0,
        });
      }
    }
  }, [activity, createNewActivity, router]);

  const onNext = () => {
    router.push('/indice-culturel/2');
  };

  if (!activity) {
    return <Base></Base>;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        {!isEdit && <BackButton href="/indice-culturel" />}
        <Steps steps={[INDICE_TYPES[activity.subType || 0]?.step1 ?? 'Indice', "Créer l'indice", 'Prévisualiser']} activeStep={0} />
        <div className="width-900">
          <p className="text">
            Vous trouvez ici les indices culturels qui ont déjà été présentés par les Pélicopains sur l&apos;aspect &quot;
            {INDICE_TYPES[activity.subType || 0]?.step1}&quot;. N&apos;hésitez pas à y puiser de l&apos;inspiration, avant de proposer votre indice !
            Vous pouvez également choisir de présenter un autre aspect culturel, en revenant à l&apos;étape précédente.
          </p>
          <StepsButton next={onNext} />
          <div>
            {sameActivities.length > 0 ? (
              <Activities activities={sameActivities} withLinks />
            ) : (
              <p className="center">
                Il n&apos;existe encore aucun indice culturel sur le thème &quot;{INDICE_TYPES[activity.subType || 0]?.title}&quot;
              </p>
            )}
          </div>
        </div>
      </div>
    </Base>
  );
};

export default IndiceStep1;
