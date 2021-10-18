import { useRouter } from 'next/router';
import React from 'react';

import { TextField, Box } from '@material-ui/core';

import { isPresentation } from 'src/activity-types/anyActivity';
import { DEFAULT_MASCOTTE_DATA, isMascotte, PRESENTATION } from 'src/activity-types/presentation.constants';
import type { MascotteData } from 'src/activity-types/presentation.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { AvatarEditor } from 'src/components/activities/content/editors/ImageEditor/AvatarEditor';
import { stepsHasBeenFilled, isFirstStepValid, isValidSum } from 'src/components/activities/mascotteChecks';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { errorColor } from 'src/styles/variables.const';
import { getUserDisplayName, pluralS } from 'src/utils';
import { ActivityType } from 'types/activity.type';

const MascotteStep1 = () => {
  const router = useRouter();
  const [isError, setIsError] = React.useState<boolean>(false);
  const { activity, updateActivity, createActivityIfNotExist, save } = React.useContext(ActivityContext);
  const { user } = React.useContext(UserContext);
  const labelPresentation = getUserDisplayName(user, false);
  // const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;
  const data = (activity?.data as MascotteData) || null;
  const prevImage = React.useRef<string | null>(data?.classImg || null);
  const created = React.useRef(false);
  React.useEffect(() => {
    // if (!created.current) {
    if (!activity && !('activity-id' in router.query) && localStorage.getItem('activity') === null && !('edit' in router.query)) {
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
    if (data !== null && data.classImg !== prevImage.current) {
      prevImage.current = data.classImg;
      save().catch();
    }
    // }

    setIsError(stepsHasBeenFilled(data, 0));
  }, [activity, labelPresentation, createActivityIfNotExist, router]);

  const dataChange = (key: keyof MascotteData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newData = {
      ...data,
      [key]: ['presentation', 'classImgDesc'].indexOf(key) > -1 ? event.target.value : event.target.value ? Number(event.target.value) : null,
    };
    updateActivity({ data: newData });
  };
  const onFocusInput = (key: keyof MascotteData) => () => {
    if (data[key] === 0) {
      const newData: MascotteData = { ...data, [key]: null };
      updateActivity({ data: newData });
    }
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

  const imageChange = (image: string) => {
    updateActivity({ data: { ...data, classImg: image } });
  };

  const onNext = () => {
    save().catch(console.error);
    if (isFirstStepValid(data)) {
      router.push('/mascotte/2');
    } else {
      router.push('/mascotte/2');
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
        <Steps
          steps={[
            'Votre classe',
            `${data.mascotteName ? data.mascotteName : 'Votre mascotte'}`,
            'Langues et monnaies',
            'Le web de Pelico',
            'Prévisualiser',
          ]}
          activeStep={0}
        />
        <div className="width-900">
          <h2>Qui est dans votre classe ?</h2>
          <div className="se-presenter-step-one">
            <div className="se-presenter-step-one__line" style={{ display: 'flex', alignItems: 'flex-start', margin: '1.4rem 0' }}>
              <span style={{ flexShrink: 0, marginRight: '0.5rem' }}>Nous sommes</span>
              <TextField
                className="se-presenter-step-one__textfield se-presenter-step-one__textfield--full-width"
                style={{ flex: 1, minWidth: 0 }}
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
          <h2 style={{ marginTop: '5rem' }}>À quoi ressemble votre classe ?</h2>
          <p>
            Pour donner à vos Pélicopains un aperçu de votre classe, nous vous invitons à mettre en ligne{' '}
            <b>une photo d&apos;une affiche ou d&apos;une décoration accrochée</b> sur un des murs de votre classe ! Par exemple, une carte du monde
            ou une liste de règles.
          </p>

          <div style={{ display: 'flex' }}>
            <div>
              <Box display="flex" justifyContent="center" m={2}>
                <AvatarEditor id={1} value={data.classImg} onChange={imageChange} isRounded={false} />
              </Box>
              <p className="text-center" style={{ marginTop: '-10px' }}>
                Image de votre affiche ou décoration
              </p>
              {isError && data.classImgDesc === '' && <p style={{ color: errorColor }}>Ce champs est obligatoire</p>}
            </div>
            <div style={{ width: '100%' }}>
              <p>Que représente cette photo et pourquoi l&apos;avoir choisie ?</p>
              <TextField
                value={data.classImgDesc}
                label={'Description de l’objet'}
                placeholder={"Il s'agit d'une carte du monde !"}
                variant="outlined"
                style={{ width: '100%' }}
                onChange={dataChange('classImgDesc')}
                helperText={isError && data.classImgDesc === '' && 'Ce champs est obligatoire'}
                error={isError && data.classImgDesc === ''}
              ></TextField>
            </div>
          </div>
          <StepsButton prev="/ma-classe" next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default MascotteStep1;
