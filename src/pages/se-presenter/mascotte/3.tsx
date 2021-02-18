import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { Button, TextField, Grid } from '@material-ui/core';

import { Base } from 'src/components/Base';
import { MultipleCountrySelector } from 'src/components/MultipleCountrySelector';
import { Steps } from 'src/components/Steps';
import { BackButton } from 'src/components/buttons/BackButton';
import { ActivityContext } from 'src/contexts/activityContext';

const MascotteStep3: React.FC = () => {
  const router = useRouter();
  const { activity, updateActivity } = React.useContext(ActivityContext);

  const dataChange = (key: string) => (newValue: string) => {
    const newData = { ...activity.data, [key]: newValue };
    updateActivity({ data: newData });
    console.log(activity);
  };

  if (!activity) router.push('/se-presenter/mascotte/1');
  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <BackButton href="/se-presenter" />
        <Steps steps={['Votre classe', 'Votre mascotte', 'Description de votre mascotte', 'Prévisualiser']} activeStep={2} />
        <div style={{ margin: '0 auto 1rem auto', width: '100%', maxWidth: '900px' }}>
          <h1>Dites-en plus sur vous-mêmes et votre mascotte ! Souvenez-vous {activity.data.mascotteName ?? 'mascotteName'} vous représente.</h1>
          <div>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <p>Quelles langues parle {activity.data.mascotteName ?? 'mascotteName'} (et donc les élèves de votre classe) ?</p>
                <MultipleCountrySelector
                  label={'langues'}
                  style={{ width: '100%', marginBottom: '1rem' }}
                  value={activity.data.languages}
                  onChange={dataChange('languages')}
                />
                <p>Quelles monnaies utilise {activity.data.mascotteName ?? 'mascotteName'} (et donc les élèves de votre classe) ?</p>
                <MultipleCountrySelector
                  label={'monnaies'}
                  style={{ width: '100%', marginBottom: '1rem' }}
                  value={activity.data.currencies}
                  onChange={dataChange('currencies')}
                />
                <p>Dans quel pays {activity.data.mascotteName ?? 'mascotteName'} est-il allé ou rêve t-il d’aller ?</p>
                <MultipleCountrySelector
                  label={'pays'}
                  style={{ width: '100%', marginBottom: '1rem' }}
                  value={activity.data.countries}
                  onChange={dataChange('countries')}
                />
              </Grid>
            </Grid>
          </div>
          <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
            <Link href="/se-presenter/mascotte/3">
              <Button component="a" href="/se-presenter/mascotte/3" variant="outlined" color="primary">
                Étape suivante
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Base>
  );
};

export default MascotteStep3;
