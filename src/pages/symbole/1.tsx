import { useRouter } from 'next/router';
import React from 'react';

import { SYMBOL_TYPES } from 'src/activity-types/symbol.constants';
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

const SymbolStep1 = () => {
  const router = useRouter();
  const { activity, createNewActivity } = React.useContext(ActivityContext);
  const { user } = React.useContext(UserContext);
  const isEdit = activity !== null && activity.status !== ActivityStatus.DRAFT;
  const { activities } = useActivities({
    page: 0,
    countries: user ? [user.country.isoCode.toUpperCase()] : [],
    pelico: true,
    type: ActivityType.SYMBOL,
  });
  const sameActivities = activity ? activities.filter((c) => c.subType === activity.subType) : [];

  const created = React.useRef(false);
  React.useEffect(() => {
    if (!created.current) {
      created.current = true;
      if (!('edit' in router.query)) {
        const symbolType = parseInt(getQueryString(router.query['category']) || '0', 10) || 0;
        createNewActivity(ActivityType.SYMBOL, symbolType, {
          theme: 0,
        });
      }
    }
  }, [activity, createNewActivity, router]);

  const onNext = () => {
    router.push('/symbole/2');
  };

  if (!activity) {
    return <Base></Base>;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        {!isEdit && <BackButton href="/symbole" />}
        <Steps steps={[SYMBOL_TYPES[activity.subType || 0]?.step1 ?? 'Symbole', 'Créer le symbole', 'Prévisualiser']} activeStep={0} />
        <div className="width-900">
          <p className="text">
            Vous trouvez ici les symboles qui ont déjà été présentés par les Pélicopains de type &quot;
            {SYMBOL_TYPES[activity.subType || 0]?.step1}&quot;. N&apos;hésitez pas à y puiser de l&apos;inspiration, avant de proposer votre symbole !
            Vous pouvez également choisir de présenter un autre symbole, en revenant à l&apos;étape précédente.
          </p>
          <StepsButton next={onNext} />
          <div>
            {sameActivities.length > 0 ? (
              <Activities activities={sameActivities} withLinks />
            ) : (
              <p className="center">
                Il n&apos;existe encore aucun symbole culturel sur le thème &quot;{SYMBOL_TYPES[activity.subType || 0]?.title}&quot;
              </p>
            )}
          </div>
        </div>
      </div>
    </Base>
  );
};

export default SymbolStep1;
