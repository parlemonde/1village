import { Tooltip } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { isReaction } from 'src/activity-types/anyActivity';
import { Base } from 'src/components/Base';
import { PageLayout } from 'src/components/PageLayout';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import ActivityLink from 'src/components/activities/Link';
import { Activities } from 'src/components/activities/List';
import { ContentView } from 'src/components/activities/content/ContentView';
import { REACTIONS } from 'src/components/activities/utils';
import { EditButton } from 'src/components/buttons/EditButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { useActivity } from 'src/services/useActivity';
import { ActivityStatus } from 'types/activity.type';
import { UserType } from 'types/user.type';

const ReactionStep3 = () => {
  const router = useRouter();
  const { activity, save } = React.useContext(ActivityContext);
  const { user } = React.useContext(UserContext);
  const { activity: responseActivity } = useActivity(activity?.responseActivityId ?? -1);
  const [isLoading, setIsLoading] = React.useState(false);

  const data = activity?.data || null;
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;
  const isObservator = user?.type === UserType.OBSERVATOR;

  const errorSteps = React.useMemo(() => {
    const fieldStep2 = activity?.content.filter((d) => d.value !== '' && d.value !== '<p></p>\n'); // if value is empty in step 2
    const errors = [];
    if (data !== null && activity?.responseActivityId === null) {
      errors.push(0); //corresponding to step 1
    }
    if (data !== null && fieldStep2?.length === 0) {
      errors.push(1); //corresponding to step 2
    }
    return errors;
  }, [activity?.content, activity?.responseActivityId, data]);

  const isValid = errorSteps.length === 0;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/reagir-a-une-activite/1');
    } else if (activity && !isReaction(activity)) {
      router.push('/reagir-a-une-activite/1');
    }
  }, [activity, router]);

  const onPublish = async () => {
    setIsLoading(true);
    const { success } = await save(true);
    if (success) {
      router.push('/reagir-a-une-activite/success');
    }
    setIsLoading(false);
  };

  if (activity === null || !isReaction(activity)) {
    return <div></div>;
  }

  return (
    <Base>
      <PageLayout>
        <Steps
          steps={['Activité', 'Réaction', 'Prévisualisation']}
          urls={['/reagir-a-une-activite/1?edit', '/reagir-a-une-activite/2?edit', '/reagir-a-une-activite/3']}
          activeStep={2}
          errorSteps={errorSteps}
        />
        <div className="width-900">
          <h1>Pré-visualisez votre réaction{!isEdit && ', et publiez-la'}</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            Voici la pré-visualisation de votre réaction.
            {isEdit
              ? " Vous pouvez le modifier à l'étape précédente, et enregistrer vos changements ici."
              : ' Vous pouvez le modifier, et quand vous êtes prêts : publiez-le dans votre village-monde !'}
          </p>
          {isEdit ? (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
              <Link href="/reagir-a-une-activite/2" passHref>
                <Button component="a" color="secondary" variant="contained" href="/reagir-a-une-activite/2">
                  {"Modifier à l'étape précédente"}
                </Button>
              </Link>
              <Button variant="outlined" color="primary" onClick={onPublish} disabled={isObservator}>
                Enregistrer les changements
              </Button>
            </div>
          ) : (
            <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
              {!isValid && (
                <p>
                  <b>Avant de publier votre présentation, il faut corriger les étapes incomplètes, marquées en orange.</b>
                </p>
              )}
              {isObservator ? (
                <Tooltip title="Action non autorisée" arrow>
                  <span>
                    <Button variant="outlined" color="primary" disabled>
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

          {!isEdit && activity?.responseActivityId === null && <ActivityLink url={`/reagir-a-une-activite/1?edit`} />}
          {responseActivity !== null && (
            <>
              <span className="text text--small text--success">En réaction à {REACTIONS[responseActivity.type]}</span>
              <div className="preview-block">
                {!isEdit && (
                  <EditButton
                    onClick={() => {
                      router.push(`/reagir-a-une-activite/1?edit`);
                    }}
                    status={'success'}
                    style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
                  />
                )}
                <Activities activities={[responseActivity]} noButtons />
              </div>
            </>
          )}

          <span className={classNames('text text--small text--success', { 'text text--small text--warning': !isValid && errorSteps.includes(1) })}>
            Contenu de votre réaction
          </span>
          <div className={classNames('preview-block', { 'preview-block--warning': !isValid && errorSteps.includes(1) })}>
            <EditButton
              onClick={() => {
                router.push('/reagir-a-une-activite/2?edit');
              }}
              status={errorSteps.includes(1) ? 'warning' : 'success'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <ContentView content={activity?.content} />
          </div>

          <StepsButton prev="/reagir-a-une-activite/2" />
        </div>
      </PageLayout>
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default ReactionStep3;
