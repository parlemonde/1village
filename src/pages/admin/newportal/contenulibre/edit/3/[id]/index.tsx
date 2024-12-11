import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import Layout from '../../../layout';
import { useGetOneActivityById } from 'src/api/activities/activities.getOneById';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { ActivityCard } from 'src/components/activities/ActivityCard';
import StepsNavigation from 'src/components/activities/StepsNavigation';
import { ContentView } from 'src/components/activities/content/ContentView';
import { EditButton } from 'src/components/buttons/EditButton';
import { UserContext } from 'src/contexts/userContext';
import { useActivity } from 'src/hooks/useActivity';

const ContenuLibre = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: fetchedActivity } = useGetOneActivityById({ id: Number(id) });

  const { activity, updateActivity, save, setDraft } = useActivity();
  const { user } = React.useContext(UserContext);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    if (fetchedActivity && (!activity || activity.id !== fetchedActivity.id)) {
      updateActivity(fetchedActivity);
    }
  }, [fetchedActivity, activity, updateActivity]);

  const onModified = async () => {
    setIsLoading(true);
    const { success } = await save(false);
    if (success) {
      setDraft(null);
      router.push('/admin/newportal/contenulibre/success');
    }
    setIsLoading(false);
  };

  if (!activity || !user) {
    return <Base hideLeftNav />;
  }

  return (
    <Layout>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <StepsNavigation currentStep={2} isEdit={true} id={id as unknown as number} />
        <div className="width-900">
          <h1>Pré-visualisez votre publication</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            Voici la pré-visualisation de votre publication.
          </p>
          <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
            <Button variant="outlined" color="primary" onClick={onModified}>
              Modifier
            </Button>
          </div>

          <div className={classNames('preview-block')}>
            <EditButton
              onClick={() => {
                router.push('/admin/newportal/contenulibre/edit/1/' + id);
              }}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <ContentView content={activity.content} />
          </div>

          <div className={classNames('preview-block')}>
            <EditButton
              onClick={() => {
                router.push('/admin/newportal/contenulibre/edit/2/' + id);
              }}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <ActivityCard activity={activity} user={user} noMargin noButtons />
          </div>

          <StepsButton prev={`/admin/newportal/contenulibre/edit/2/${id}`} />
        </div>
      </div>
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Layout>
  );
};

export default ContenuLibre;
