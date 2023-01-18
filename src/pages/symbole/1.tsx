import { TextField } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';

import { getSymbol } from 'src/activity-types/symbol.constants';
import type { SymbolData } from 'src/activity-types/symbol.types';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { Activities } from 'src/components/activities/List';
import { BackButton } from 'src/components/buttons/BackButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { useActivities } from 'src/services/useActivities';
import { getQueryString } from 'src/utils';
import { ActivityStatus, ActivityType } from 'types/activity.type';

const SymbolStep1 = () => {
  const router = useRouter();
  const { activity, createNewActivity, updateActivity } = React.useContext(ActivityContext);
  const { user } = React.useContext(UserContext);
  const { selectedPhase } = React.useContext(VillageContext);
  const [showErrors, setShowErrors] = React.useState(false);
  const isEdit = activity !== null && activity.status !== ActivityStatus.DRAFT;
  const { activities } = useActivities({
    page: 0,
    countries: user?.country ? [user.country?.isoCode.toUpperCase()] : [],
    pelico: true,
    type: ActivityType.SYMBOL,
  });
  const sameActivities = activity ? activities.filter((c) => c.subType === activity.subType) : [];
  const data = (activity?.data as SymbolData) || null;

  const created = React.useRef(false);
  React.useEffect(() => {
    if (!created.current) {
      created.current = true;
      if (!('edit' in router.query)) {
        const symbolType = parseInt(getQueryString(router.query['category']) || '0', 10) || 0;
        createNewActivity(ActivityType.SYMBOL, selectedPhase, symbolType, {
          theme: 0,
        });
      }
    }
  }, [activity, createNewActivity, router, selectedPhase]);

  const onNext = () => {
    if (activity === null || data === null || (activity.subType === -1 && !data.symbol)) {
      setShowErrors(true);
      return;
    }
    router.push('/symbole/2');
  };

  if (!activity || !data) {
    return <Base></Base>;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        {!isEdit && <BackButton href="/symbole" />}
        <Steps
          steps={[getSymbol(activity.subType, data).step1 || 'Symbole', 'Créer le symbole', 'Prévisualiser']}
          urls={['/symbole/1?edit', '/symbole/2', '/symbole/3']}
          activeStep={0}
        />
        <div className="width-900">
          {activity.subType === -1 ? (
            <>
              <h1>Présenter un autre type de symbole</h1>
              <p className="text">Indiquez quel autre type de symbole vous souhaitez présenter :</p>
              <TextField
                value={data.symbol}
                onChange={(event) => {
                  updateActivity({ data: { symbol: event.target.value.slice(0, 80) } });
                }}
                label="Symbole à présenter"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder="Nos totems"
                error={showErrors && !data.symbol}
                FormHelperTextProps={{ style: { textAlign: showErrors && !data.symbol ? 'left' : 'right' } }}
                helperText={showErrors && !data.symbol ? 'Requis' : `${data.symbol?.length || 0}/80`}
                sx={{ width: '100%', margin: '1rem 0 1rem 0' }}
              />
            </>
          ) : (
            <p className="text">
              Vous trouvez ici les symboles qui ont déjà été présentés par les Pélicopains de type &quot;
              {getSymbol(activity.subType, data).step1}&quot;. N&apos;hésitez pas à y puiser de l&apos;inspiration, avant de proposer votre symbole !
              Vous pouvez également choisir de présenter un autre symbole, en revenant à l&apos;étape précédente.
            </p>
          )}
          <StepsButton next={onNext} />
          {activity.subType !== -1 && (
            <div>
              {sameActivities.length > 0 ? (
                <Activities activities={sameActivities} withLinks />
              ) : (
                <p className="center">
                  Il n&apos;existe encore aucun symbole culturel sur le thème &quot;{getSymbol(activity.subType, data).title}&quot;
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Base>
  );
};

export default SymbolStep1;
