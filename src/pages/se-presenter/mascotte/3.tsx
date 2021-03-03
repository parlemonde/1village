import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { Button, Grid } from '@material-ui/core';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { BackButton } from 'src/components/buttons/BackButton';
import { MultipleCountrySelector } from 'src/components/selectors/MultipleCountrySelector';
import { MultipleCurrencySelector } from 'src/components/selectors/MultipleCurrencySelector';
import { MultipleLanguageSelector } from 'src/components/selectors/MultipleLanguageSelector';
import { ActivityContext } from 'src/contexts/activityContext';

const MascotteStep3: React.FC = () => {
  const router = useRouter();
  const { activity, updateActivity } = React.useContext(ActivityContext);

  const dataChange = (key: string) => (newValue: string[]) => {
    const newData = { ...activity.data, [key]: newValue };
    updateActivity({ data: newData });
  };

  React.useEffect(() => {
    if (!activity) {
      router.push('/se-presenter/mascotte/1');
    }
  }, [activity, router]);

  if (!activity) return <Base>Redirecting ...</Base>;

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <BackButton href="/se-presenter/mascotte/2" />
        <Steps
          steps={[
            'Votre classe',
            'Votre mascotte : ' + activity.data.mascotteName ?? 'mascotteName',
            'Description de votre mascotte',
            'Prévisualiser',
          ]}
          activeStep={2}
        />
        <div style={{ margin: '0 auto 1rem auto', width: '100%', maxWidth: '900px' }}>
          <h1>Dites-en plus sur vous-mêmes et votre mascotte ! Souvenez-vous {activity.data.mascotteName ?? 'mascotteName'} vous représente.</h1>
          <div>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <p>Quelles langues parle {activity.data.mascotteName ?? 'mascotteName'} (et donc les élèves de votre classe) ?</p>
                <MultipleLanguageSelector
                  label={'langues'}
                  style={{ width: '100%', marginBottom: '1rem' }}
                  value={activity.data.languages as string[]}
                  onChange={dataChange('languages')}
                />
                <p>Quelles monnaies utilise {activity.data.mascotteName ?? 'mascotteName'} (et donc les élèves de votre classe) ?</p>
                <MultipleCurrencySelector
                  label={'monnaies'}
                  style={{ width: '100%', marginBottom: '1rem' }}
                  value={activity.data.currencies as string[]}
                  onChange={dataChange('currencies')}
                />
                <p>Dans quel pays {activity.data.mascotteName ?? 'mascotteName'} est-il allé ou rêve t-il d’aller ?</p>
                <MultipleCountrySelector
                  label={'pays'}
                  style={{ width: '100%', marginBottom: '1rem' }}
                  value={activity.data.countries as string[]}
                  onChange={dataChange('countries')}
                />
              </Grid>
            </Grid>
          </div>
          <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
            <Link href="/se-presenter/mascotte/4">
              <Button component="a" href="/se-presenter/mascotte/4" variant="outlined" color="primary">
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
