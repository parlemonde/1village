import Link from 'next/link';
import React from 'react';

import { Button, TextField } from '@material-ui/core';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { BackButton } from 'src/components/buttons/BackButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { ActivityType } from 'types/activity.type';

const MascotteStep1: React.FC = () => {
  const { activity, createNewActivity, updateActivity } = React.useContext(ActivityContext);
  const { user } = React.useContext(UserContext);

  React.useEffect(() => {
    if (!activity)
      createNewActivity(ActivityType.PRESENTATION, {
        subtype: 'MASCOTTE',
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
  }, [createNewActivity, activity]);

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
        <div style={{ margin: '0 10% 0 10%', lineHeight: '70px' }}>
          <h1>Qui est dans votre classe ?</h1>
          <TextField variant="outlined" style={{ width: '100%' }} value={activity.data.presentation} disabled />
          <div className="se-presenter-step-one">
            <span>Nous sommes </span>{' '}
            <TextField
              className="se-presenter-step-one__textfield"
              type="number"
              size="small"
              value={activity.data.totalStudent}
              onChange={dataChange('totalStudent')}
            />{' '}
            <span> élèves, dont </span>{' '}
            <TextField
              className="se-presenter-step-one__textfield"
              type="number"
              size="small"
              value={activity.data.girlStudent}
              onChange={dataChange('girlStudent')}
            />{' '}
            <span> filles et </span>{' '}
            <TextField
              className="se-presenter-step-one__textfield"
              type="number"
              size="small"
              value={activity.data.boyStudent}
              onChange={dataChange('boyStudent')}
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
            />{' '}
            <span> professeurs, dont </span>{' '}
            <TextField
              className="se-presenter-step-one__textfield"
              type="number"
              size="small"
              value={activity.data.womanTeacher}
              onChange={dataChange('womanTeacher')}
            />{' '}
            <span> femmes et </span>{' '}
            <TextField
              className="se-presenter-step-one__textfield"
              type="number"
              size="small"
              value={activity.data.manTeacher}
              onChange={dataChange('manTeacher')}
            />{' '}
            <span> hommes.</span> <br />
            <span>Dans notre école, il y a </span>{' '}
            <TextField
              className="se-presenter-step-one__textfield"
              type="number"
              size="small"
              value={activity.data.numberClassroom}
              onChange={dataChange('numberClassroom')}
            />{' '}
            <span> classes et </span>{' '}
            <TextField
              className="se-presenter-step-one__textfield"
              type="number"
              size="small"
              value={activity.data.totalSchoolStudent}
              onChange={dataChange('totalSchoolStudent')}
            />{' '}
            <span> élèves.</span>
          </div>
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
