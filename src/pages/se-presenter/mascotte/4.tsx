import { useRouter } from 'next/router';
import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import { Button, Grid, Backdrop, Box } from '@material-ui/core';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { AvatarView } from 'src/components/activities/views/AvatarView';
import { BackButton } from 'src/components/buttons/BackButton';
import { EditButton } from 'src/components/buttons/EditButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { useCountries } from 'src/services/useCountries';
import { useCurrencies } from 'src/services/useCurrencies';
import { useLanguages } from 'src/services/useLanguages';

const MascotteStep4: React.FC = () => {
  const router = useRouter();
  const { activity, addContent, save, updateActivity } = React.useContext(ActivityContext);
  const { countries } = useCountries();
  const { languages } = useLanguages();
  const { currencies } = useCurrencies();

  const displayableCountries: string[] = React.useMemo(
    () => activity && countries.filter((country) => (activity.data.countries as string[]).includes(country.isoCode)).map((country) => country.name),
    [countries, activity],
  );

  const displayableLanguages: string[] = React.useMemo(
    () =>
      activity &&
      languages.filter((language) => (activity.data.languages as string[]).includes(language.alpha3_b)).map((language) => language.french),
    [languages, activity],
  );

  const displayableCurrencies: string[] = React.useMemo(
    () =>
      activity && currencies.filter((currency) => (activity.data.currencies as string[]).includes(currency.code)).map((currency) => currency.name),
    [currencies, activity],
  );

  const [isLoading, setIsLoading] = React.useState(false);

  const isEdit = activity !== null && activity.id !== 0;

  const onPublish = async () => {
    setIsLoading(true);
    const success = await save();
    if (success) {
      router.push('/');
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    if (!activity && !('activity-id' in router.query)) {
      router.push('/se-presenter/mascotte/1');
    }
  }, [activity, router, addContent, updateActivity]);

  React.useEffect(() => {
    updateActivity({ processedContent: [] });
  }, [updateActivity]);

  React.useEffect(() => {
    if (!activity || !activity.processedContent || activity.processedContent.length !== 0) {
      return;
    }
    addContent(
      'text',
      `
  <p>
    Nous sommes ${activity.data.presentation}.
  </p>
  <p>
    Nous sommes ${activity.data.totalStudent} élèves, dont ${activity.data.girlStudent} filles et ${activity.data.boyStudent} garçons.
  </p>
  <p>En moyenne, l’âge des élèves de notre classe est ${activity.data.meanAge} ans.</p>
  <p>
    Nous avons ${activity.data.totalTeacher} professeurs, dont ${activity.data.womanTeacher} femmes et ${activity.data.manTeacher} hommes.
  </p>
  <p>
    Dans notre école, il y a ${activity.data.numberClassroom} classes et ${activity.data.totalSchoolStudent} élèves.
  </p>`,
    );
    addContent(
      'text',
      `<p>Notre mascotte s’appelle ${activity.data.mascotteName}, elle nous représente.</p>
      <p>${activity.data.mascotteDescription}</p>
      <p>
        ${activity.data.mascotteName} est ${activity.data.personality1}, ${activity.data.personality2} et ${activity.data.personality3}
      </p>`,
    );

    addContent(
      'text',
      `<p>
      ${activity.data.mascotteName}, comme les élèves de notre classe,
      ${
        displayableLanguages.length > 0
          ? ' parle : ' + [].concat(displayableLanguages).map(naturalJoinArray).join('') + '.'
          : ' ne parle aucune langue.'
      }
    </p>
    <p>
      ${activity.data.mascotteName}, comme les élèves de notre classe,
      ${
        displayableCurrencies.length > 0
          ? ' utilise comme monnaie : ' + [].concat(displayableCurrencies).map(naturalJoinArray).join('') + '.'
          : " n'utilise aucune monnaie."
      }
    </p>
    <p>
      ${activity.data.mascotteName} est allé ou rêve d’aller dans
      ${displayableCountries.length > 0 ? ' ces pays : ' + [].concat(displayableCountries).map(naturalJoinArray).join('') + '.' : ' aucun pays.'}
    </p>`,
    );
  }, [activity, addContent, displayableCountries, displayableCurrencies, displayableLanguages]);

  if (!activity) return <Base>Redirecting ...</Base>;

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <BackButton href="/se-presenter/mascotte/3" label={isEdit ? 'Modifier' : 'Retour'} />
        <Steps
          steps={[
            'Votre classe',
            'Votre mascotte : ' + activity.data.mascotteName ?? 'mascotteName',
            'Description de votre mascotte',
            'Prévisualiser',
          ]}
          activeStep={3}
        />
        <div className="width-900">
          <h1>Pré-visualisez votre mascotte{!isEdit && ' et publiez la'}</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            Voici la pré-visualisation de votre présentation.
            {isEdit
              ? " Vous pouvez la modifier à l'étape précédente, et enregistrer vos changements ici."
              : ' Vous pouvez la modifier, et quand vous êtes prêts : publiez-la dans votre village-monde !'}
          </p>
          {isEdit ? (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
              <Button variant="outlined" color="primary" onClick={onPublish}>
                Enregistrer les changements
              </Button>
            </div>
          ) : (
            <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
              <Button variant="outlined" color="primary" onClick={onPublish}>
                Publier
              </Button>
            </div>
          )}
          <div className="preview-block">
            <EditButton
              onClick={() => {
                router.push('/se-presenter/mascotte/1');
              }}
              isGreen
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <div dangerouslySetInnerHTML={{ __html: activity.processedContent[0] && activity.processedContent[0].value }}></div>
          </div>
          <div className="preview-block">
            <EditButton
              onClick={() => {
                router.push('/se-presenter/mascotte/2');
              }}
              isGreen
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Box display="flex" justifyContent="center" m={0}>
                  <AvatarView value={activity.data.mascotteImage as string} />
                </Box>
              </Grid>
              <Grid item xs={12} md={9}>
                <div dangerouslySetInnerHTML={{ __html: activity.processedContent[1] && activity.processedContent[1].value }}></div>
              </Grid>
            </Grid>
          </div>
          <div className="preview-block">
            <EditButton
              onClick={() => {
                router.push('/se-presenter/mascotte/3');
              }}
              isGreen
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <div dangerouslySetInnerHTML={{ __html: activity.processedContent[2] && activity.processedContent[2].value }}></div>
          </div>
        </div>
      </div>
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

const naturalJoinArray = (element: string, index: number, array: Array<string>) => {
  if (array.length < 2) {
    return element;
  }
  if (index === array.length - 2) {
    return element + ' et ';
  }
  if (index === array.length - 1) {
    return element;
  }
  return element + ', ';
};

export default MascotteStep4;
