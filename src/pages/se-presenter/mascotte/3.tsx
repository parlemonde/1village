import { useRouter } from 'next/router';
import React from 'react';

import { Grid } from '@material-ui/core';

import { isPresentation } from 'src/activity-types/anyActivity';
import { isMascotte } from 'src/activity-types/presentation.const';
import type { MascotteData } from 'src/activity-types/presentation.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { MultipleCountrySelector } from 'src/components/selectors/MultipleCountrySelector';
import { MultipleCurrencySelector } from 'src/components/selectors/MultipleCurrencySelector';
import { MultipleLanguageSelector } from 'src/components/selectors/MultipleLanguageSelector';
import { ActivityContext } from 'src/contexts/activityContext';

const MascotteStep3 = () => {
  const router = useRouter();
  const { activity, updateActivity, save } = React.useContext(ActivityContext);
  const shouldSave = React.useRef(false);

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/se-presenter');
    } else if (activity && (!isPresentation(activity) || !isMascotte(activity))) {
      router.push('/se-presenter');
    }
  }, [activity, router]);

  const data = (activity?.data as MascotteData) || null;

  const dataChange = (key: keyof MascotteData) => (newValue: string[]) => {
    const newData: MascotteData = { ...data, [key]: newValue };
    updateActivity({ data: newData });
    shouldSave.current = true;
  };

  React.useEffect(() => {
    if (shouldSave.current) {
      shouldSave.current = false;
      save().catch();
    }
  }, [data.languages, data.countries, data.currencies, save]);

  if (!activity) return <Base>Redirecting ...</Base>;

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={['Votre classe', 'Votre mascotte : ' + data.mascotteName ?? 'mascotteName', 'Description de votre mascotte', 'Prévisualiser']}
          activeStep={2}
        />
        <div style={{ margin: '0 auto 1rem auto', width: '100%', maxWidth: '900px' }}>
          <h1>Dites-en plus sur vous-même et votre mascotte ! Souvenez-vous {data.mascotteName ?? 'mascotteName'} vous représente.</h1>
          <div>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <p style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                  Quelle(s) langue(s) parle {data.mascotteName ?? 'mascotteName'} (et donc les élèves de votre classe) ?
                </p>
                <MultipleLanguageSelector
                  label="Langues"
                  style={{ width: '100%', marginBottom: '1rem' }}
                  value={data.languages}
                  onChange={dataChange('languages')}
                />
                <p style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                  Quelle(s) monnaie(s) utilise {data.mascotteName ?? 'mascotteName'} (et donc les élèves de votre classe) ?
                </p>
                <MultipleCurrencySelector
                  label="Monnaies"
                  style={{ width: '100%', marginBottom: '1rem' }}
                  value={data.currencies}
                  onChange={dataChange('currencies')}
                />
                <p style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                  Dans quel(s) pays {data.mascotteName ?? 'mascotteName'} est-il allé ou rêve t-il d’aller (et donc les élèves de la classe) ?
                </p>
                <MultipleCountrySelector
                  label="Pays"
                  style={{ width: '100%', marginBottom: '1rem' }}
                  value={data.countries}
                  onChange={dataChange('countries')}
                />
              </Grid>
            </Grid>
          </div>

          <StepsButton prev="/se-presenter/mascotte/2" next="/se-presenter/mascotte/4" />
        </div>
      </div>
    </Base>
  );
};

export default MascotteStep3;
