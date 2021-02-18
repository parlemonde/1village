import dynamic from 'next/dynamic';
import Link from 'next/link';
import React from 'react';

import { Button, TextField, Grid } from '@material-ui/core';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { BackButton } from 'src/components/buttons/BackButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { ActivityType } from 'types/activity.type';

const TextEditor = dynamic(() => import('src/components/activities/editors/TextEditor'), { ssr: false });

const MascotteStep1: React.FC = () => {
  const { activity, createNewActivity, updateActivity } = React.useContext(ActivityContext);
  const { user } = React.useContext(UserContext);

  React.useEffect(() => {
    createNewActivity(ActivityType.PRESENTATION, {
      presentation: '',
      totalStudent: 0,
      mascotteName: '',
      mascotteDescription: '',
      personality1: '',
      personality2: '',
      personality3: '',
    });
  }, [createNewActivity]);

  const dataChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newData = { ...activity.data, [key]: event.target.value };
    updateActivity({ data: newData });
  };

  if (!user) return <Base>Not authorized</Base>;
  if (!activity) return <Base>Loading...</Base>;

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <BackButton href="/se-presenter" />
        <Steps steps={['Votre classe', 'Votre mascotte', 'Description de votre mascotte', 'Prévisualiser']} activeStep={0} />
        <div style={{ lineHeight: '70px' }}>
          <h1>Qui est dans votre classe ?</h1>
          <TextField variant="outlined" style={{ width: '100%' }} value={activity.data.presentation} disabled />
          <span>Nous sommes </span> <TextField style={{ display: 'inline' }} type="number" /> <span> élèves, dont </span>{' '}
          <TextField style={{ display: 'inline' }} type="number" /> <span> filles et </span> <TextField style={{ display: 'inline' }} type="number" />{' '}
          <span> garçons.</span>
          <br />
          <span>En moyenne, l’âge des élèves de notre classe est </span> <TextField style={{ display: 'inline' }} type="number" /> <span> ans.</span>
          <br />
          <span>Nous avons </span> <TextField style={{ display: 'inline' }} type="number" /> <span> professeurs, dont </span>{' '}
          <TextField style={{ display: 'inline' }} type="number" /> <span> femmes et </span> <TextField style={{ display: 'inline' }} type="number" />{' '}
          <span> hommes.</span> <br />
          <span>Dans notre école, il y a </span> <TextField style={{ display: 'inline' }} type="number" /> <span> classes et </span>{' '}
          <TextField style={{ display: 'inline' }} type="number" /> <span> élèves.</span>
          <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
            <Link href="/se-presenter/mascotte/2">
              <Button component="a" href="/se-presenter/mascotte/2" variant="outlined" color="primary">
                Étape suivante
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Base>
  );
};

export default MascotteStep1;
