import dynamic from 'next/dynamic';
import Link from 'next/link';
import React from 'react';

import { Button, TextField } from '@material-ui/core';

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
    createNewActivity(ActivityType.PRESENTATION, { presentation: '', totalStudent: 0 });
  }, [createNewActivity]);

  const presentationChange = (newValue: string) => {
    const newProcessedContent = [...activity.processedContent];
    newProcessedContent[0].value = newValue;
    updateActivity({ processedContent: newProcessedContent });
  };

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
        <div style={{ margin: '0 auto 1rem auto', width: '100%', maxWidth: '900px' }}>
          <h1>Qui est dans votre classe ?</h1>
          <TextField variant="outlined" style={{ width: '100%' }} value={activity.data.totalStudent} onChange={dataChange('totalStudent')} />
          <p className="text" style={{ fontSize: '1.1rem' }}>
            Dans cette activité, nous vous proposons de faire une présentation générale aux Pélicopains sur le thème de votre choix.
          </p>
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
