import { TextField } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';

import { getIndice } from 'src/activity-types/indice.constants';
import type { IndiceData } from 'src/activity-types/indice.types';
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

const IndiceStep1 = () => {
  const router = useRouter();
  const { user } = React.useContext(UserContext);
  const { selectedPhase } = React.useContext(VillageContext);
  const { activity, createNewActivity, updateActivity } = React.useContext(ActivityContext);
  const [showErrors, setShowErrors] = React.useState(false);
  const isEdit = activity !== null && activity.status !== ActivityStatus.DRAFT;
  const { activities } = useActivities({
    page: 0,
    countries: user ? [user.country.isoCode.toUpperCase()] : [],
    pelico: true,
    type: ActivityType.INDICE,
  });
  const sameActivities = activity ? activities.filter((c) => c.subType === activity.subType) : [];
  const data = (activity?.data as IndiceData) || null;

  const created = React.useRef(false);
  React.useEffect(() => {
    if (!created.current) {
      created.current = true;
      if (!('edit' in router.query)) {
        const indiceType = parseInt(getQueryString(router.query['category']) || '0', 10) || 0;
        createNewActivity(ActivityType.INDICE, selectedPhase, indiceType, {
          theme: 0,
        });
      }
    }
  }, [activity, createNewActivity, router, selectedPhase]);

  const onNext = () => {
    if (activity === null || data === null || (activity.subType === -1 && !data.indice)) {
      setShowErrors(true);
      return;
    }
    router.push('/indice-culturel/2');
  };

  if (!activity || data === null) {
    return <Base></Base>;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        {!isEdit && <BackButton href="/indice-culturel" />}
        <Steps
          steps={[getIndice(activity.subType, data).step1 || 'Indice', "Créer l'indice", 'Prévisualiser']}
          urls={['/indice-culturel/1?edit', '/indice-culturel/2', '/indice-culturel/3']}
          activeStep={0}
        />
        <div className="width-900">
          {activity.subType === -1 ? (
            <>
              <h1>Présenter un autre type d&apos;indice culturel</h1>
              <p className="text">Indiquez quel autre type d&apos;indice culturel vous souhaitez présenter :</p>
              <TextField
                value={data.indice}
                onChange={(event) => {
                  updateActivity({ data: { indice: event.target.value.slice(0, 80) } });
                }}
                label="Indice à présenter"
                variant="outlined"
                placeholder="Nos monuments"
                InputLabelProps={{
                  shrink: true,
                }}
                error={showErrors && !data.indice}
                FormHelperTextProps={{ style: { textAlign: showErrors && !data.indice ? 'left' : 'right' } }}
                helperText={showErrors && !data.indice ? 'Requis' : `${data.indice?.length || 0}/80`}
                sx={{ width: '100%', margin: '1rem 0 1rem 0' }}
              />
            </>
          ) : (
            <p className="text">
              Vous trouvez ici les indices culturels qui ont déjà été présentés par les Pélicopains sur l&apos;aspect &quot;
              {getIndice(activity.subType, data).step1}&quot;. N&apos;hésitez pas à y puiser de l&apos;inspiration, avant de proposer votre indice !
              Vous pouvez également choisir de présenter un autre aspect culturel, en revenant à l&apos;étape précédente.
            </p>
          )}
          <StepsButton next={onNext} />
          {activity.subType !== -1 && (
            <div>
              {sameActivities.length > 0 ? (
                <Activities activities={sameActivities} withLinks />
              ) : (
                <p className="center">
                  Il n&apos;existe encore aucun indice culturel sur le thème &quot;{getIndice(activity.subType, data).title}&quot;
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Base>
  );
};

export default IndiceStep1;
