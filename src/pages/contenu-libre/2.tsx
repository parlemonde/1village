import { useRouter } from 'next/router';
import React from 'react';

import { TextField, Switch } from '@mui/material';

import { isFreeContent } from 'src/activity-types/anyActivity';
import type { FreeContentData } from 'src/activity-types/freeContent.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ActivityCard } from 'src/components/activities/ActivityCard';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';

const ContenuLibre = () => {
  const router = useRouter();
  const { activity, updateActivity, save } = React.useContext(ActivityContext);
  const { user } = React.useContext(UserContext);

  const data = (activity?.data as FreeContentData) || null;
  const errorSteps = React.useMemo(() => {
    if (activity !== null && activity.content.filter((c) => c.value.length > 0 && c.value !== '<p></p>\n').length === 0) {
      return [0];
    }
    return [];
  }, [activity]);

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/contenu-libre/1');
    } else if (activity && !isFreeContent(activity)) {
      router.push('/contenu-libre/1');
    }
  }, [activity, router]);

  if (!activity || !user) {
    return <Base></Base>;
  }

  const handleChange = () => {
    updateActivity({ isPinned: !activity.isPinned });
  };

  const dataChange = (key: keyof FreeContentData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.slice(0, 400);
    const newData = { ...data, [key]: value };
    updateActivity({ data: newData });
  };

  const onNext = () => {
    save().catch(console.error);
    router.push('/contenu-libre/3');
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps steps={['Contenu', 'Forme', 'Pré-visualiser']} activeStep={1} errorSteps={errorSteps} />
        <div className="width-900">
          <h1>Ajustez l&apos;apparence de votre publication</h1>
          <p className="text">
            Vous pouvez ajuster le titre, l&apos;extrait et l&apos;image à la une de votre publication qui sera intégrée sur le fil d&apos;actualité.
            Vous pouvez également décider de mettre votre publication à l&apos;avant, tout en haut du fil d&apos;actualité.
          </p>
          <TextField
            value={data.title}
            onChange={dataChange('title')}
            label="Titre de votre publication"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            style={{ width: '100%', marginBottom: '1vw' }}
          />
          <TextField
            value={data.resume}
            onChange={dataChange('resume')}
            label="Extrait votre publication"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            style={{ width: '100%', marginBottom: '1vw' }}
          />
          Épingler la publication ?
          <Switch checked={activity?.isPinned} onChange={handleChange} value={activity?.isPinned} color="primary" />
          <h2 style={{ margin: '1rem 0 0.5rem 0' }}>Aperçu de votre publication</h2>
          <p className="text">Voilà à quoi ressemblera votre publication dans le fil d&apos;activité</p>
          <ActivityCard activity={activity} user={user} noButtons />
          <StepsButton prev="/contenu-libre/1" next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default ContenuLibre;
