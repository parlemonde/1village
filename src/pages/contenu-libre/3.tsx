import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { isFreeContent } from 'src/activity-types/anyActivity';
import type { FreeContentData } from 'src/activity-types/freeContent.types';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { ActivityCard } from 'src/components/activities/ActivityCard';
import { ContentView } from 'src/components/activities/content/ContentView';
import { EditButton } from 'src/components/buttons/EditButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { ActivityStatus } from 'types/activity.type';

const ContenuLibre = () => {
  const router = useRouter();
  const { activity, save } = React.useContext(ActivityContext);
  const { user } = React.useContext(UserContext);
  const [isLoading, setIsLoading] = React.useState(false);

  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;
  const errorSteps = React.useMemo(() => {
    const errors: number[] = [];
    const data = (activity?.data as FreeContentData) || null;
    if (activity !== null && activity.content.filter((c) => c.value.length > 0 && c.value !== '<p></p>\n').length === 0) {
      errors.push(0);
    }
    if (data !== null && (!data.title || !data.resume)) {
      errors.push(1);
    }
    return errors;
  }, [activity]);
  const isValid = errorSteps.length === 0;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/contenu-libre');
    } else if (activity && !isFreeContent(activity)) {
      router.push('/contenu-libre');
    }
  }, [activity, router]);

  const onPublish = async () => {
    if (!isValid) {
      return;
    }
    setIsLoading(true);
    const { success } = await save(true);
    if (success) {
      router.push('/contenu-libre/success');
    }
    setIsLoading(false);
  };

  if (!activity || !user) {
    return <Base />;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={['Contenu', 'Forme', 'Prévisualiser']}
          urls={['/contenu-libre/1?edit', '/contenu-libre/2', '/contenu-libre/3']}
          activeStep={2}
          errorSteps={errorSteps}
        />
        <div className="width-900">
          <h1>Pré-visualisez votre publication</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            Voici la pré-visualisation de votre publication.
            {isEdit
              ? " Vous pouvez la modifier à l'étape précédente, et enregistrer vos changements ici."
              : ' Vous pouvez la modifier, et quand vous êtes prêts : publiez-la dans votre village-monde !'}
          </p>
          {isEdit ? (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
              <Link href="/contenu-libre/2" passHref>
                <Button component="a" color="secondary" variant="contained" onClick={() => router.push('/contenu-libre/2')}>
                  {"Modifier à l'étape précédente"}
                </Button>
              </Link>
              <Button variant="outlined" color="primary" onClick={onPublish}>
                Enregistrer les changements
              </Button>
            </div>
          ) : (
            <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
              <Button variant="outlined" color="primary" onClick={onPublish} disabled={errorSteps.length > 0}>
                Publier
              </Button>
            </div>
          )}

          <span className={`text text--small ${errorSteps.includes(0) ? 'text--warning' : 'text--success'}`}>Contenu</span>
          <div className={classNames('preview-block', { 'preview-block--warning': errorSteps.includes(0) })}>
            <EditButton
              onClick={() => {
                router.push('/contenu-libre/1');
              }}
              status={errorSteps.includes(0) ? 'warning' : 'success'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <ContentView content={activity.content} />
          </div>

          <span className={`text text--small ${errorSteps.includes(1) ? 'text--warning' : 'text--success'}`}>Forme</span>
          <div className={classNames('preview-block', { 'preview-block--warning': errorSteps.includes(1) })}>
            <EditButton
              onClick={() => {
                router.push('/contenu-libre/2');
              }}
              status={errorSteps.includes(1) ? 'warning' : 'success'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <ActivityCard activity={activity} user={user} noMargin noButtons />
          </div>

          <StepsButton prev="/contenu-libre/2" />
        </div>
      </div>
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default ContenuLibre;
