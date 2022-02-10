import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Tooltip } from '@mui/material';

import { isReportage } from 'src/activity-types/anyActivity';
import { getReportage } from 'src/activity-types/reportage.constants';
import type { ReportageData } from 'src/activity-types/reportage.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ContentView } from 'src/components/activities/content/ContentView';
import { getErrorSteps } from 'src/components/activities/reportageChecks';
import { EditButton } from 'src/components/buttons/EditButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { ActivityStatus } from 'types/activity.type';
import { UserType } from 'types/user.type';

const ReportageStep3 = () => {
  const router = useRouter();
  const { activity, save } = React.useContext(ActivityContext);
  const { user } = React.useContext(UserContext);
  const [isLoading, setIsLoading] = React.useState(false);

  const isEdit = activity != null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;
  const isUserObservator = user?.type === UserType.OBSERVATOR;
  const data = (activity?.data as ReportageData) || null;

  const errorSteps = React.useMemo(() => {
    const fieldStep2 = activity?.content.filter((d) => d.value !== '' && d.value !== '<p></p>\n'); // if value is empty in step 2
    if (data !== null && fieldStep2?.length === 0 && activity?.subType === -1) {
      const errors = getErrorSteps(data, 1);
      errors.push(1); //corresponding to step 2
      return errors;
    }
    if (data !== null && fieldStep2?.length === 0) {
      return [1]; //corresponding to step 2
    }
    return [];
  }, [activity?.content, activity?.subType, data]);
  const isValid = errorSteps.length === 0;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/realiser-un-reportage');
    } else if (activity && !isReportage(activity)) {
      router.push('/realiser-un-reportage');
    }
  }, [activity, router]);

  const onPublish = async () => {
    if (!isValid) {
      return;
    }
    setIsLoading(true);
    const success = await save(true);
    if (success) {
      router.push('/realiser-un-reportage/success');
    }
    setIsLoading(false);
  };

  if (activity === null || data === null) {
    return <div></div>;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={[getReportage(activity.subType, data).step1, 'Le reportage', 'Prévisualiser']}
          urls={['/realiser-un-reportage/1?edit', '/realiser-un-reportage/2', '/realiser-un-reportage/3']}
          activeStep={2}
          errorSteps={errorSteps}
        />
        <div className="width-900">
          <h1>Pré-visualisez votre reportage{!isEdit && ' et publiez-la.'}</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            Voici la pré-visualisation de votre reportage.
            {isEdit
              ? " Vous pouvez le modifier à l'étape précédente, et enregistrer vos changements ici."
              : ' Vous pouvez le modifier, et quand vous êtes prêts : publiez-le dans votre village-monde !'}
          </p>
          {!isValid && (
            <p>
              <b>Avant de publier votre présentation, il faut corriger les étapes incomplètes, marquées en orange.</b>
            </p>
          )}
          {isEdit ? (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
              <Link href="/indice-culturel/2" passHref>
                <Button component="a" color="secondary" variant="contained" href="/indice-culture/2">
                  {"Modifier à l'étape précédente"}
                </Button>
              </Link>
              <Button variant="outlined" color="primary" onClick={onPublish} disabled={isUserObservator}>
                Enregistrer les changements
              </Button>
            </div>
          ) : (
            <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
              {isUserObservator ? (
                <Tooltip title="Action non autorisée" arrow>
                  <span>
                    <Button variant="outlined" color="primary" onClick={onPublish} disabled>
                      Publier
                    </Button>
                  </span>
                </Tooltip>
              ) : (
                <Button variant="outlined" color="primary" onClick={onPublish} disabled={!isValid}>
                  Publier
                </Button>
              )}
            </div>
          )}

          <span className={classNames('text text--small text--success', { 'text text--small text--warning': !isValid && errorSteps.includes(0) })}>
            Thème
          </span>
          <div className={classNames('preview-block', { 'preview-block--warning': !isValid && errorSteps.includes(0) })}>
            <EditButton
              onClick={() => {
                router.push('/realiser-un-reportage/1?edit');
              }}
              status={!isValid && errorSteps.includes(0) ? 'warning' : 'success'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <p style={{ margin: '0.5rem 0' }}>{getReportage(activity.subType, data).title}</p>
          </div>

          <span className={`text text--small ${isValid ? 'text--success' : 'text--warning'}`}>Le reportage</span>
          <div className={classNames('preview-block', { 'preview-block--warning': !isValid })}>
            <EditButton
              onClick={() => {
                router.push('/realiser-un-reportage/2');
              }}
              status={isValid ? 'success' : 'warning'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <ContentView content={activity.content} />
          </div>

          <StepsButton prev="/realiser-un-reportage/2" />
        </div>
      </div>
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default ReportageStep3;
