import { useRouter } from 'next/router';
import React from 'react';

import { TextField } from '@material-ui/core';

import { isPresentation } from 'src/activities/anyActivity';
import { DEFAULT_MASCOTTE_DATA, isMascotte, PRESENTATION } from 'src/activities/presentation.const';
import { MascotteData } from 'src/activities/presentation.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { BackButton } from 'src/components/buttons/BackButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { getUserDisplayName, pluralS } from 'src/utils';
import { ActivityType, ActivityStatus } from 'types/activity.type';

const MascotteStep1: React.FC = () => {
  const router = useRouter();
  const [isError, setIsError] = React.useState<boolean>(false);
  const { activity, updateActivity, createActivityIfNotExist, save } = React.useContext(ActivityContext);
  const { user } = React.useContext(UserContext);
  const labelPresentation = getUserDisplayName(user, false);

  const created = React.useRef(false);
  React.useEffect(() => {
    if (!created.current) {
      if (!activity && !('activity-id' in router.query) && !sessionStorage.getItem('activity') && !('edit' in router.query)) {
        created.current = true;
        createActivityIfNotExist(ActivityType.PRESENTATION, PRESENTATION.MASCOTTE, {
          ...DEFAULT_MASCOTTE_DATA,
          presentation: labelPresentation,
        }).catch(console.error);
      } else if (activity && (!isPresentation(activity) || !isMascotte(activity))) {
        created.current = true;
        createActivityIfNotExist(ActivityType.PRESENTATION, PRESENTATION.MASCOTTE, {
          ...DEFAULT_MASCOTTE_DATA,
          presentation: labelPresentation,
        }).catch(console.error);
      }
    }
  }, [activity, labelPresentation, createActivityIfNotExist, router]);

  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;
  const data = (activity?.data as MascotteData) || null;

  const dataChange = (key: keyof MascotteData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newData = { ...data, [key]: key === 'presentation' ? event.target.value : event.target.value ? Number(event.target.value) : null };
    updateActivity({ data: newData });
  };
  const onFocusInput = (key: keyof MascotteData) => () => {
    if (data[key] === 0) {
      const newData: MascotteData = { ...data, [key]: null };
      updateActivity({ data: newData });
    }
  };

  const isValidSum = (x: number, y: number, z: number) => {
    if (x < 0 || y < 0) return false;
    return x + y === z;
  };

  const errorMessage = (women: number, men: number, total: number) => {
    if (isError && (total === 0 || total === null)) {
      return 'Ce champ est obligatoire';
    }
    if (isError && !isValidSum(women, men, total)) {
      return "Le compte n'est pas bon";
    }
    return '';
  };

  const isValid = () => {
    return (
      data.presentation.length > 0 &&
      isValidSum(data.girlStudent, data.boyStudent, data.totalStudent) &&
      isValidSum(data.womanTeacher, data.manTeacher, data.totalTeacher) &&
      data.totalStudent !== 0 &&
      data.totalTeacher !== 0 &&
      data.totalStudent !== null &&
      data.totalTeacher !== null &&
      data.numberClassroom !== 0 &&
      data.numberClassroom !== null &&
      data.totalSchoolStudent !== 0 &&
      data.totalSchoolStudent !== null &&
      data.meanAge !== 0 &&
      data.meanAge !== null
    );
  };

  const onNext = () => {
    save().catch(console.error);
    if (isValid()) {
      router.push('/se-presenter/mascotte/2');
    } else {
      setIsError(true);
    }
  };

  if (!user || !activity || data === null) {
    return (
      <Base>
        <div></div>
      </Base>
    );
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        {!isEdit && <BackButton href="/se-presenter" />}
        <Steps steps={['Votre classe', 'Votre mascotte', 'Description de votre mascotte', 'Prévisualiser']} activeStep={0} />
        <div className="width-900">
          <h1>Qui est dans votre classe ?</h1>
          <div className="se-presenter-step-one">
            <div className="se-presenter-step-one__line" style={{ display: 'flex', alignItems: 'flex-start', margin: '1.4rem 0' }}>
              <span style={{ flexShrink: 0, marginRight: '0.5rem' }}>Nous sommes</span>
              <TextField
                className="se-presenter-step-one__textfield se-presenter-step-one__textfield--full-width"
                style={{ flex: 1 }}
                fullWidth
                placeholder={labelPresentation}
                value={data.presentation}
                onChange={dataChange('presentation')}
                error={isError && !data.presentation}
                helperText={isError && !data.presentation ? 'Ce champ est obligatoire' : ''}
              />
            </div>
            <div className="se-presenter-step-one__line">
              <span>Nous sommes </span>{' '}
              <TextField
                className="se-presenter-step-one__textfield"
                type="number"
                inputProps={{ min: 0 }}
                onFocus={onFocusInput('totalStudent')}
                size="small"
                value={data.totalStudent ?? ''}
                onChange={dataChange('totalStudent')}
                helperText={errorMessage(data.girlStudent, data.boyStudent, data.totalStudent)}
                error={
                  isError &&
                  (!isValidSum(data.girlStudent, data.boyStudent, data.totalStudent) || data.totalStudent === 0 || data.totalStudent === null)
                }
              />{' '}
              <span> élève{pluralS(data.totalStudent)}, dont </span>{' '}
              <TextField
                className="se-presenter-step-one__textfield"
                type="number"
                size="small"
                onFocus={onFocusInput('girlStudent')}
                value={data.girlStudent ?? ''}
                onChange={dataChange('girlStudent')}
                inputProps={{ min: 0 }}
              />{' '}
              <span> fille{pluralS(data.girlStudent)} et </span>{' '}
              <TextField
                className="se-presenter-step-one__textfield"
                type="number"
                size="small"
                value={data.boyStudent ?? ''}
                onFocus={onFocusInput('boyStudent')}
                onChange={dataChange('boyStudent')}
                inputProps={{ min: 0 }}
              />{' '}
              <span> garçon{pluralS(data.boyStudent)}.</span>
            </div>
            <div className="se-presenter-step-one__line">
              <span>En moyenne, l’âge des élèves de notre classe est </span>{' '}
              <TextField
                className="se-presenter-step-one__textfield"
                type="number"
                size="small"
                value={data.meanAge ?? ''}
                onFocus={onFocusInput('meanAge')}
                onChange={dataChange('meanAge')}
                helperText={isError && (data.meanAge === 0 || data.meanAge === null) ? 'Ce champ est obligatoire' : ''}
                error={isError && (data.meanAge === 0 || data.meanAge === null)}
                inputProps={{ min: 0 }}
              />{' '}
              <span> an{pluralS(data.meanAge)}.</span>
            </div>
            <div className="se-presenter-step-one__line">
              <span>Nous avons </span>{' '}
              <TextField
                className="se-presenter-step-one__textfield"
                type="number"
                size="small"
                value={data.totalTeacher ?? ''}
                onFocus={onFocusInput('totalTeacher')}
                onChange={dataChange('totalTeacher')}
                helperText={errorMessage(data.womanTeacher, data.manTeacher, data.totalTeacher)}
                error={
                  isError &&
                  (!isValidSum(data.womanTeacher, data.manTeacher, data.totalTeacher) || data.totalTeacher === 0 || data.totalTeacher === null)
                }
                inputProps={{ min: 0 }}
              />{' '}
              <span> professeur{pluralS(data.totalTeacher)}, dont </span>{' '}
              <TextField
                className="se-presenter-step-one__textfield"
                type="number"
                size="small"
                value={data.womanTeacher ?? ''}
                onFocus={onFocusInput('womanTeacher')}
                onChange={dataChange('womanTeacher')}
                inputProps={{ min: 0 }}
              />{' '}
              <span> femme{pluralS(data.womanTeacher)} et </span>{' '}
              <TextField
                className="se-presenter-step-one__textfield"
                type="number"
                size="small"
                value={data.manTeacher ?? ''}
                onFocus={onFocusInput('manTeacher')}
                onChange={dataChange('manTeacher')}
                inputProps={{ min: 0 }}
              />{' '}
              <span> homme{pluralS(data.manTeacher)}.</span>
            </div>
            <div className="se-presenter-step-one__line">
              <span>Dans notre école, il y a </span>{' '}
              <TextField
                className="se-presenter-step-one__textfield"
                type="number"
                size="small"
                value={data.numberClassroom ?? ''}
                onFocus={onFocusInput('numberClassroom')}
                onChange={dataChange('numberClassroom')}
                helperText={isError && (data.numberClassroom === 0 || data.numberClassroom === null) ? 'Ce champ est obligatoire' : ''}
                error={isError && (data.numberClassroom === 0 || data.numberClassroom === null)}
                inputProps={{ min: 0 }}
              />{' '}
              <span> classe{pluralS(data.numberClassroom)} et </span>{' '}
              <TextField
                className="se-presenter-step-one__textfield"
                type="number"
                size="small"
                value={data.totalSchoolStudent ?? ''}
                onFocus={onFocusInput('totalSchoolStudent')}
                onChange={dataChange('totalSchoolStudent')}
                helperText={isError && (data.totalSchoolStudent === 0 || data.totalSchoolStudent === null) ? 'Ce champ est obligatoire' : ''}
                error={isError && (data.totalSchoolStudent === 0 || data.totalSchoolStudent === null)}
                inputProps={{ min: 0 }}
              />{' '}
              <span> élève{pluralS(data.totalSchoolStudent)}.</span>
            </div>
          </div>

          <StepsButton next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default MascotteStep1;
