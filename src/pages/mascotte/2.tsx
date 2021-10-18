import { useRouter } from 'next/router';
import React from 'react';

import { TextField, Grid, Box } from '@material-ui/core';

import { isPresentation } from 'src/activity-types/anyActivity';
import { isMascotte } from 'src/activity-types/presentation.constants';
import type { MascotteData } from 'src/activity-types/presentation.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { AvatarEditor } from 'src/components/activities/content/editors/ImageEditor/AvatarEditor';
import { isFirstStepValid } from 'src/components/activities/mascotteChecks';
import { MultipleCountrySelector } from 'src/components/selectors/MultipleCountrySelector';
import { ActivityContext } from 'src/contexts/activityContext';

const MascotteStep2 = () => {
  const router = useRouter();
  const [isError, setIsError] = React.useState<boolean>(false);
  const { activity, updateActivity, save } = React.useContext(ActivityContext);
  const [errorSteps, setErrorSteps] = React.useState([]);

  React.useEffect(() => {
    !isFirstStepValid(data) && setErrorSteps([0]);
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/ma-classe');
    } else if (activity && (!isPresentation(activity) || !isMascotte(activity))) {
      router.push('/ma-classe');
    }
  }, [activity, router]);

  const data = (activity?.data as MascotteData) || null;

  const dataChange = (key: keyof MascotteData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = key === 'mascotteDescription' ? event.target.value.slice(0, 400) : event.target.value;
    const newData = { ...data, [key]: value };
    updateActivity({ data: newData });
  };

  const prevImage = React.useRef<string | null>(data?.mascotteImage || null);
  React.useEffect(() => {
    if (data !== null && data.mascotteImage !== prevImage.current) {
      prevImage.current = data.mascotteImage;
      save().catch();
    }
  }, [data, save]);
  const countryChange = (countryCodes: string[]) => {
    updateActivity({ data: { ...data, countries: countryCodes } });
  };
  const imageChange = (image: string) => {
    updateActivity({ data: { ...data, mascotteImage: image } });
  };

  const onNext = () => {
    save().catch(console.error);
    if (!isValid()) {
      router.push('/mascotte/3');
      setIsError(true);
    } else {
      router.push('/mascotte/3');
    }
  };

  const isValid = (): boolean => {
    if (data.mascotteName === '') return false;
    if (data.mascotteDescription === '') return false;
    if (data.personality1 === '') return false;
    if (data.personality2 === '') return false;
    if (data.personality3 === '') return false;
    if (data.countries === []) return false;
    if (data.game === '') return false;
    if (data.sport === '') return false;
    return true;
  };

  if (!activity || data === null) {
    return (
      <Base>
        <div></div>
      </Base>
    );
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={[
            'Votre classe',
            `${data.mascotteName ? data.mascotteName : 'Votre mascotte'}`,
            'Langues et monnaies',
            'Le web de Pelico',
            'Prévisualiser',
          ]}
          activeStep={1}
          errorSteps={errorSteps}
        />
        <div style={{ margin: '0 auto 1rem auto', width: '100%', maxWidth: '900px' }}>
          <h1>Qui êtes-vous ? Choisissez une mascotte pour vous représenter collectivement !</h1>
          <div>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Box display="flex" justifyContent="center" m={2}>
                  <AvatarEditor id={1} value={data.mascotteImage} onChange={imageChange} />
                </Box>
                <p className="text-center" style={{ marginTop: '-10px' }}>
                  Image de votre mascotte
                </p>
              </Grid>
              <Grid item xs={12} md={9}>
                <p>Quel est le nom de votre mascotte ?</p>
                <TextField
                  error={isError && data.mascotteName === ''}
                  helperText={isError && data.mascotteName === '' && 'Écrivez le nom de votre mascotte !'}
                  value={data.mascotteName}
                  onChange={dataChange('mascotteName')}
                  label="Nom"
                  variant="outlined"
                  placeholder="Pelico"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <p>Quel animal est votre mascotte et pourquoi l&apos;avoir choisi ?</p>
                <TextField
                  error={isError && data.mascotteDescription === ''}
                  helperText={isError && data.mascotteDescription === '' && 'Écrivez la description de votre mascotte !'}
                  value={data.mascotteDescription}
                  onChange={dataChange('mascotteDescription')}
                  label="Description"
                  multiline
                  variant="outlined"
                  placeholder="C'est un Toucan !"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={{ width: '100%' }}
                />
                {!(isError && data.mascotteDescription === '') && (
                  <div style={{ width: '100%', textAlign: 'right' }}>
                    <span className="text text--small">{data.mascotteDescription.length}/400</span>
                  </div>
                )}
                <p>3 traits de personnalité de votre mascotte (et donc des élèves !)</p>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      error={isError && data.personality1 === ''}
                      value={data.personality1}
                      helperText={isError && data.personality1 === '' && 'Écrivez un trait de personnalité !'}
                      onChange={dataChange('personality1')}
                      label="1"
                      variant="outlined"
                      style={{ width: '100%' }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      error={isError && data.personality2 === ''}
                      helperText={isError && data.personality2 === '' && 'Écrivez un trait de personnalité !'}
                      value={data.personality2}
                      onChange={dataChange('personality2')}
                      label="2"
                      variant="outlined"
                      style={{ width: '100%' }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      error={isError && data.personality3 === ''}
                      helperText={isError && data.personality3 === '' && 'Écrivez un trait de personnalité !'}
                      value={data.personality3}
                      onChange={dataChange('personality3')}
                      label="3"
                      variant="outlined"
                      style={{ width: '100%' }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <p>Tout commes vous, votre mascotte rêve. Dans quels pays rêve-t-elle de voyager ?</p>
              <MultipleCountrySelector label="Pays" style={{ width: '100%', marginBottom: '1rem' }} value={data.countries} onChange={countryChange} />

              <p>Tout commes vous, votre mascotte joue à l&apos;école. À quel jeu de récréation votre mascotte joue-t-elle le plus souvent ?</p>
              <span style={{ flexShrink: 0, marginRight: '0.5rem' }}>Notre mascotte joue </span>
              <TextField
                className="se-presenter-step-one__textfield se-presenter-step-one__textfield--full-width"
                style={{ flex: 1, minWidth: 0, width: '100%' }}
                fullWidth
                value={data.game}
                onChange={dataChange('game')}
                error={isError && !data.game}
                helperText={isError && !data.game ? 'Ce champ est obligatoire' : ''}
              />
              <p style={{ width: '100%' }}>
                Tout commes vous, votre mascotte fait du sport à l&apos;école. Quels sports pratique-t-elle le plus souvent ?
              </p>
              <span style={{ flexShrink: 0, marginRight: '0.5rem' }}>Notre mascotte pratique </span>
              <TextField
                className="se-presenter-step-one__textfield se-presenter-step-one__textfield--full-width"
                style={{ flex: 1, minWidth: 0 }}
                fullWidth
                value={data.sport}
                onChange={dataChange('sport')}
                error={isError && !data.sport}
                helperText={isError && !data.sport ? 'Ce champ est obligatoire' : ''}
              />
            </Grid>
          </div>

          <StepsButton prev={`/mascotte/1?edit=${activity?.id ?? 0}`} next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default MascotteStep2;
