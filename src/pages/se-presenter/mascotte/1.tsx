import { useRouter } from 'next/router';
import React from 'react';

import { Button, TextField } from '@material-ui/core';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { BackButton } from 'src/components/buttons/BackButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { useCountries } from 'src/services/useCountries';
import { ActivityType, ActivitySubType } from 'types/activity.type';

const MascotteStep1: React.FC = () => {
  const router = useRouter();
  const { countries } = useCountries();
  const [isError, setIsError] = React.useState<boolean>(false);
  const { activity, updateActivity, createActivityIfNotExist } = React.useContext(ActivityContext);
  const { user } = React.useContext(UserContext);

  React.useEffect(() => {
    if (!activity || activity.type !== ActivityType.PRESENTATION || activity.subType !== ActivitySubType.MASCOTTE) {
      createActivityIfNotExist(ActivityType.PRESENTATION, ActivitySubType.MASCOTTE, {
        presentation: '',
        totalStudent: 0,
        girlStudent: 0,
        boyStudent: 0,
        meanAge: 0,
        totalTeacher: 0,
        womanTeacher: 0,
        manTeacher: 0,
        numberClassroom: 0,
        totalSchoolStudent: 0,
        mascotteName: '',
        mascotteImage: '',
        mascotteDescription: '',
        personality1: '',
        personality2: '',
        personality3: '',
        countries: [],
        languages: [],
        currencies: [],
      });
    }
  }, [activity, countries, user, createActivityIfNotExist]);

  const dataChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newData = { ...activity.data, [key]: key === 'presentation' ? event.target.value : Number(event.target.value) };
    updateActivity({ data: newData });
  };

  if (!user) return <Base>Not authorized</Base>;
  if (!activity) return <Base>Loading...</Base>;

  const isValidSum = (x: number, y: number, z: number) => {
    if (x < 0 || y < 0) return false;
    return x + y === z;
  };

  const errorMessage = (women: number, men: number, total: number) => {
    if (isError && total === 0) {
      return 'Ce champ est obligatoire';
    }
    if (isError && !isValidSum(women, men, total)) {
      return "Le compte n'est pas bon";
    }
    return '';
  };

  const isValid = () => {
    return (
      isValidSum(activity.data.girlStudent as number, activity.data.boyStudent as number, activity.data.totalStudent as number) &&
      isValidSum(activity.data.womanTeacher as number, activity.data.manTeacher as number, activity.data.totalTeacher as number) &&
      activity.data.totalStudent !== 0 &&
      activity.data.totalTeacher !== 0
    );
  };

  const onNext = () => {
    if (isValid()) {
      router.push('/se-presenter/mascotte/2');
    } else {
      setIsError(true);
    }
  };

  const labelPrez =
    'la classe de ' +
    user.level +
    '" de "' +
    user.city +
    '" de l\'école "' +
    user.school +
    '" en "' +
    countries.filter((c) => c.isoCode === user.countryCode)[0]?.name +
    '".';

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <BackButton href="/se-presenter" />
        <Steps steps={['Votre classe', 'Votre mascotte', 'Description de votre mascotte', 'Prévisualiser']} activeStep={0} />
        <div style={{ margin: '0 10% 0 10%', lineHeight: '70px' }}>
          <h1>Qui est dans votre classe ?</h1>
          <span>Nous sommes </span>
          <TextField
            variant="outlined"
            style={{ width: '100%' }}
            label={labelPrez}
            value={activity.data.presentation}
            onChange={dataChange('presentation')}
          />
          <div className="se-presenter-step-one">
            <span>Nous sommes </span>{' '}
            <TextField
              className="se-presenter-step-one__textfield"
              type="number"
              inputProps={{ min: 0 }}
              size="small"
              value={activity.data.totalStudent}
              onChange={dataChange('totalStudent')}
              helperText={errorMessage(activity.data.girlStudent as number, activity.data.boyStudent as number, activity.data.totalStudent as number)}
              error={
                isError &&
                (!isValidSum(activity.data.girlStudent as number, activity.data.boyStudent as number, activity.data.totalStudent as number) ||
                  activity.data.totalStudent === 0)
              }
            />{' '}
            <span> élèves, dont </span>{' '}
            <TextField
              className="se-presenter-step-one__textfield"
              type="number"
              size="small"
              value={activity.data.girlStudent}
              onChange={dataChange('girlStudent')}
              inputProps={{ min: 0 }}
            />{' '}
            <span> filles et </span>{' '}
            <TextField
              className="se-presenter-step-one__textfield"
              type="number"
              size="small"
              value={activity.data.boyStudent}
              onChange={dataChange('boyStudent')}
              inputProps={{ min: 0 }}
            />{' '}
            <span> garçons.</span>
            <br />
            <span>En moyenne, l’âge des élèves de notre classe est </span>{' '}
            <TextField
              className="se-presenter-step-one__textfield"
              type="number"
              size="small"
              value={activity.data.meanAge}
              onChange={dataChange('meanAge')}
              helperText={isError && activity.data.meanAge === 0 ? 'Ce champ est obligatoire' : ''}
              error={isError && activity.data.meanAge === 0}
              inputProps={{ min: 0 }}
            />{' '}
            <span> ans.</span>
            <br />
            <span>Nous avons </span>{' '}
            <TextField
              className="se-presenter-step-one__textfield"
              type="number"
              size="small"
              value={activity.data.totalTeacher}
              onChange={dataChange('totalTeacher')}
              helperText={errorMessage(
                activity.data.womanTeacher as number,
                activity.data.manTeacher as number,
                activity.data.totalTeacher as number,
              )}
              error={
                isError &&
                (!isValidSum(activity.data.womanTeacher as number, activity.data.manTeacher as number, activity.data.totalTeacher as number) ||
                  activity.data.totalTeacher === 0)
              }
              inputProps={{ min: 0 }}
            />{' '}
            <span> professeurs, dont </span>{' '}
            <TextField
              className="se-presenter-step-one__textfield"
              type="number"
              size="small"
              value={activity.data.womanTeacher}
              onChange={dataChange('womanTeacher')}
              inputProps={{ min: 0 }}
            />{' '}
            <span> femmes et </span>{' '}
            <TextField
              className="se-presenter-step-one__textfield"
              type="number"
              size="small"
              value={activity.data.manTeacher}
              onChange={dataChange('manTeacher')}
              inputProps={{ min: 0 }}
            />{' '}
            <span> hommes.</span> <br />
            <span>Dans notre école, il y a </span>{' '}
            <TextField
              className="se-presenter-step-one__textfield"
              type="number"
              size="small"
              value={activity.data.numberClassroom}
              onChange={dataChange('numberClassroom')}
              helperText={isError && activity.data.numberClassroom === 0 ? 'Ce champ est obligatoire' : ''}
              error={isError && activity.data.numberClassroom === 0}
              inputProps={{ min: 0 }}
            />{' '}
            <span> classes et </span>{' '}
            <TextField
              className="se-presenter-step-one__textfield"
              type="number"
              size="small"
              value={activity.data.totalSchoolStudent}
              onChange={dataChange('totalSchoolStudent')}
              helperText={isError && activity.data.totalSchoolStudent === 0 ? 'Ce champ est obligatoire' : ''}
              error={isError && activity.data.totalSchoolStudent === 0}
              inputProps={{ min: 0 }}
            />{' '}
            <span> élèves.</span>
          </div>
          <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
            <Button component="a" onClick={onNext} variant="outlined" color="primary">
              Étape suivante
            </Button>
          </div>
        </div>
      </div>
    </Base>
  );
};

export default MascotteStep1;
