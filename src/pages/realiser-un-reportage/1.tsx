import { TextField } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';

import { getReportage } from 'src/activity-types/reportage.constants';
import type { ReportageData } from 'src/activity-types/reportage.types';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { Activities } from 'src/components/activities/List';
import { BackButton } from 'src/components/buttons/BackButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { VillageContext } from 'src/contexts/villageContext';
import { getQueryString, serializeToQueryUrl } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';
import { ActivityStatus, ActivityType } from 'types/activity.type';
import type { Activity } from 'types/activity.type';

const ReportageStep1 = () => {
  const router = useRouter();

  const { village, selectedPhase } = React.useContext(VillageContext);
  const { activity, createNewActivity, updateActivity } = React.useContext(ActivityContext);
  const [reportageActivities, setReportageActivities] = React.useState<Activity[]>([]);
  const [showErrors, setShowErrors] = React.useState(false);
  const isEdit = activity !== null && activity.status !== ActivityStatus.DRAFT;

  const sameActivities = activity ? reportageActivities.filter((c) => c.subType === activity.subType) : [];
  const data = (activity?.data as ReportageData) || null;
  const created = React.useRef(false);
  React.useEffect(() => {
    if (!created.current) {
      created.current = true;
      if (!('edit' in router.query)) {
        const reportageType = parseInt(getQueryString(router.query['category']) || '0', 10) || 0;
        createNewActivity(ActivityType.REPORTAGE, selectedPhase, reportageType, {
          theme: reportageType,
        });
      }
    }
  }, [activity, createNewActivity, router, selectedPhase]);

  React.useEffect(() => {
    if (village) {
      axiosRequest({
        method: 'GET',
        url: `/activities${serializeToQueryUrl({
          villageId: village.id,
          type: ActivityType.REPORTAGE,
        })}`,
      }).then((response) => {
        if (!response.error && response.data) {
          const reportageActivities = response.data;
          setReportageActivities(reportageActivities as Activity[]);
        }
      });
    }
  }, [village]);

  const onNext = () => {
    if (activity === null || data === null || (activity.subType === -1 && !data.reportage)) {
      setShowErrors(true);
    }
    router.push('/realiser-un-reportage/2');
  };

  if (!activity || data === null) {
    return <Base></Base>;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        {!isEdit && <BackButton href="/realiser-un-reportage" />}
        <Steps
          steps={[getReportage(activity.subType, data).step1 || 'Choix du thème', 'Le reportage', 'Prévisualiser']}
          urls={['/realiser-un-reportage/1?edit', '/realiser-un-reportage/2', '/realiser-un-reportage/3']}
          activeStep={0}
        />
        <div className="width-900">
          {activity.subType === -1 ? (
            <>
              <h1>Créer un reportage sur un autre thème</h1>
              <p className="text">Indiquez le thème du reportage que vous souhaitez créer :</p>
              <TextField
                value={data.reportage}
                onChange={(event) => {
                  updateActivity({ data: { reportage: event.target.value.slice(0, 80) } });
                }}
                label="Reportage à créer"
                variant="outlined"
                placeholder="Nos monuments"
                InputLabelProps={{
                  shrink: true,
                }}
                error={showErrors && !data.reportage}
                FormHelperTextProps={{ style: { textAlign: showErrors && !data.reportage ? 'left' : 'right' } }}
                helperText={showErrors && !data.reportage ? 'Ce champ est obligatoire' : `${data.reportage?.length || 0}/80`}
                sx={{ width: '100%', margin: '1rem 0 1rem 0' }}
              />
            </>
          ) : (
            <p className="text">
              Vous trouvez ici les reportages qui ont déjà été déjà présentés par les Pélicopains sur le thème &quot;
              {getReportage(activity.subType, data).step1}&quot;. N&apos;hésitez pas à y puiser de l&apos;inspiration, avant de réaliser votre
              reportage ! Vous pouvez également choisir de réaliser un autre reportage, en revenant à l&apos;étape précédente.
            </p>
          )}
          <StepsButton next={onNext} />
          {activity.subType !== -1 && (
            <div>
              {sameActivities.length > 0 ? (
                <Activities activities={sameActivities} withLinks />
              ) : (
                <p className="center">
                  Il n&apos;existe encore aucun reportage sur le thème &quot;{getReportage(activity.subType, data).title}&quot;
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Base>
  );
};

export default ReportageStep1;
