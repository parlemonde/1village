import { useRouter } from 'next/router';
import React from 'react';

import { Grid } from '@mui/material';

import { isMascotte } from 'src/activity-types/anyActivity';
import type { MascotteData } from 'src/activity-types/mascotte.types';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { getErrorSteps } from 'src/components/activities/mascotteChecks';
import { MultipleCurrencySelector } from 'src/components/selectors/MultipleCurrencySelector';
import { MultipleLanguageSelector } from 'src/components/selectors/MultipleLanguageSelector';
import { ActivityContext } from 'src/contexts/activityContext';

const MascotteStep3 = () => {
  const router = useRouter();
  const { activity, updateActivity } = React.useContext(ActivityContext);

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/ma-classe');
    } else if (activity && !isMascotte(activity)) {
      router.push('/ma-classe');
    }
  }, [activity, router]);

  const data = (activity?.data as MascotteData) || null;
  const errorSteps = React.useMemo(() => {
    if (data !== null) {
      return getErrorSteps(data, 2);
    }
    return [];
  }, [data]);

  const dataChange = (key: keyof MascotteData) => (newValue: string[]) => {
    const newData: MascotteData = { ...data, [key]: newValue };
    updateActivity({ data: newData });
  };

  if (!activity) return <Base>Redirecting ...</Base>;

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={[
            'Votre classe',
            `${data.mascotteName ? data.mascotteName : 'Votre mascotte'}`,
            'Langues et monnaies',
            'Le web de Pélico',
            'Prévisualiser',
          ]}
          urls={['/mascotte/1?edit', '/mascotte/2', '/mascotte/3', '/mascotte/4', '/mascotte/5']}
          activeStep={2}
          errorSteps={errorSteps}
        />
        <div style={{ margin: '0 auto 1rem auto', width: '100%', maxWidth: '900px' }}>
          <h2>Langues parlées dans votre classe</h2>
          <div>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <p style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                  Quelles sont les langues parlées couramment par <b>tous les enfants</b> de votre classe ?
                </p>
                <MultipleLanguageSelector
                  label="Langues"
                  style={{ width: '100%', marginBottom: '1rem' }}
                  value={data.fluentLanguages}
                  onChange={dataChange('fluentLanguages')}
                />
                <p style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                  Quelles sont les langues parlées couramment par <b>au moins un enfant</b> de votre classe ?
                </p>
                <MultipleLanguageSelector
                  label="Langues"
                  style={{ width: '100%', marginBottom: '1rem' }}
                  value={data.minorLanguages}
                  onChange={dataChange('minorLanguages')}
                />
                <p style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                  Quelles sont les langues étrangères apprises par les enfants de votre classe ?
                </p>
                <MultipleLanguageSelector
                  label="Langues"
                  style={{ width: '100%', marginBottom: '1rem' }}
                  value={data.wantedForeignLanguages}
                  onChange={dataChange('wantedForeignLanguages')}
                />
              </Grid>
            </Grid>
            <h2>Monnaies utilisées dans votre classe</h2>
            <p style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>Quelles sont les monnaies utilisées par les enfants de votre classe ?</p>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <MultipleCurrencySelector
                  label="Monnaies"
                  style={{ width: '100%', marginBottom: '1rem' }}
                  value={data.currencies}
                  onChange={dataChange('currencies')}
                />
              </Grid>
            </Grid>
          </div>

          <StepsButton prev="/mascotte/2" next="/mascotte/4" />
        </div>
      </div>
    </Base>
  );
};

export default MascotteStep3;
