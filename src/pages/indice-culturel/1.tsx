import { useRouter } from 'next/router';
import React from 'react';

import { isIndice } from 'src/activity-types/anyActivity';
import { INDICE_TYPES } from 'src/activity-types/indice.constants';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import type { FilterArgs } from 'src/components/accueil/Filters';
import { Activities } from 'src/components/activities/List';
import { ActivityContext } from 'src/contexts/activityContext';
import { useActivities } from 'src/services/useActivities';
import { getQueryString } from 'src/utils';
import { ActivityType } from 'types/activity.type';

const IndiceStep1 = () => {
  const router = useRouter();
  const { activity, createNewActivity, updateActivity } = React.useContext(ActivityContext);
  const selectRef = React.useRef<HTMLDivElement>(null);

  const [filters] = React.useState<FilterArgs>({
    type: [6],
    status: 0,
    countries: {},
    pelico: true,
  });
  const { activities } = useActivities({
    page: 0,
    countries: Object.keys(filters.countries).filter((key) => filters.countries[key]),
    pelico: filters.pelico,
    type: ActivityType.INDICE,
  });
  const sameActivities = activities.filter((c) => {
    return c.subType === activity.subType;
  });

  // indice sub-type
  const indiceTypeIndex =
    activity !== null && 'edit' in router.query && isIndice(activity)
      ? activity.subType ?? 0
      : parseInt(getQueryString(router.query['category']) ?? '-1', 10) ?? 0;

  const onNext = () => {
    updateActivity({ responseActivityId: null, responseType: null });
    router.push('/indice-culturel/2');
  };

  const created = React.useRef(false);
  React.useEffect(() => {
    if (!created.current) {
      created.current = true;
      if (!('edit' in router.query)) {
        const responseActivityId =
          'responseActivityId' in router.query ? parseInt(getQueryString(router.query.responseActivityId), 10) ?? null : null;
        const responseActivityType =
          'responseActivityType' in router.query ? parseInt(getQueryString(router.query.responseActivityType), 10) ?? null : null;
        createNewActivity(
          ActivityType.INDICE,
          indiceTypeIndex,
          {
            theme: 0,
          },
          responseActivityId,
          responseActivityType,
        );
        if (responseActivityId !== null) {
          if (selectRef.current) {
            selectRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    }
  }, [activity, createNewActivity, indiceTypeIndex, router]);

  if (!activity) {
    return (
      <Base>
        <div></div>
      </Base>
    );
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps steps={[INDICE_TYPES[activity.subType]?.step1 ?? 'Indice', "Créer l'indice", 'Prévisualiser']} activeStep={0} />
        <div className="width-900">
          <p className="text">
            Vous trouvez ici les indices culturels qui ont déjà été présentés par les Pélicopains sur l&apos;aspect &quot;
            {INDICE_TYPES[activity.subType]?.step1}&quot;. N&apos;hésitez pas à y puiser de l&apos;inspiration, avant de proposer votre indice ! Vous
            pouvez également choisir de présenter un autre aspect culturel, en revenant à l&apos;étape précédente.
          </p>
          <StepsButton prev="/indice-culturel" next={onNext} />
          <div>
            {sameActivities.length > 0 ? (
              <Activities activities={sameActivities} withLinks />
            ) : (
              <p className="center">Il n&apos;existe encore aucun indice culturel sur le thème &quot;{INDICE_TYPES[activity.subType]?.title}&quot;</p>
            )}
          </div>
        </div>
      </div>
    </Base>
  );
};

export default IndiceStep1;
