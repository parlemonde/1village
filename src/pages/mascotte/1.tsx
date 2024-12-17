import { useRouter } from 'next/router';
import React from 'react';

import { TextField, Box } from '@mui/material';

import { isMascotte } from 'src/activity-types/anyActivity';
import { DEFAULT_MASCOTTE_DATA } from 'src/activity-types/mascotte.constants';
import type { MascotteData } from 'src/activity-types/mascotte.types';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { AvatarEditor } from 'src/components/activities/content/editors/ImageEditor/AvatarEditor';
import { isValidSum } from 'src/components/activities/mascotteChecks';
import { BackButton } from 'src/components/buttons/BackButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { errorColor } from 'src/styles/variables.const';
import { getUserDisplayName, pluralS } from 'src/utils';
import { ActivityStatus, ActivityType } from 'types/activity.type';

const MascotteStep1 = () => {
  const { selectedPhase } = React.useContext(VillageContext);
  const router = useRouter();
  const [showError, setShowError] = React.useState(false);
  const { activity, updateActivity, createActivityIfNotExist, save } = React.useContext(ActivityContext);
  const { user } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);

  const labelPresentation = user ? getUserDisplayName(user, false) : '';
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;
  const data = (activity?.data as MascotteData) || null;

  React.useEffect(() => {
    if (window.sessionStorage.getItem('mascotte-step-1-next') === 'true') {
      setShowError(true);
      window.sessionStorage.setItem('mascotte-step-1-next', 'false');
    }
  }, []);

  const created = React.useRef(false);
  React.useEffect(() => {
    if (!user || !village) {
      return;
    }
    if (!created.current) {
      if (!activity && !('activity-id' in router.query) && localStorage.getItem('activity') === null && !('edit' in router.query)) {
        created.current = true;
        createActivityIfNotExist(ActivityType.MASCOTTE, selectedPhase, undefined, {
          ...DEFAULT_MASCOTTE_DATA,
          presentation: labelPresentation,
        }).catch(console.error);
      } else if (activity && !isMascotte(activity)) {
        created.current = true;
        createActivityIfNotExist(ActivityType.MASCOTTE, selectedPhase, undefined, {
          ...DEFAULT_MASCOTTE_DATA,
          presentation: labelPresentation,
        }).catch(console.error);
      }
    }
  }, [user, village, activity, labelPresentation, createActivityIfNotExist, router, selectedPhase]);

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
    if (showError && (total === 0 || total === null)) {
      return 'Ce champ est obligatoire';
    }
    if (showError && !isValidSum(women, men, total)) {
      return "Le compte n'est pas bon";
    }
    return '';
  };

  const imageChange = (image: string) => {
    updateActivity({ data: { ...data, classImg: image } });
  };

  const onNext = () => {
    save().catch(console.error);
    window.sessionStorage.setItem('mascotte-step-1-next', 'true');
    router.push('/mascotte/2');
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
        {!isEdit && <BackButton href="/ma-classe" />}
        <Steps
          steps={[
            'Votre classe',
            `${data.mascotteName ? data.mascotteName : 'Votre mascotte'}`,
            'Langues et monnaies',
            'Le web de Pélico',
            'Prévisualiser',
          ]}
          urls={['/mascotte/1?edit', '/mascotte/2', '/mascotte/3', '/mascotte/4', '/mascotte/5']}
          activeStep={0}
        />
        <div className="width-900">
          <h1>Qui est dans votre classe ?</h1>
          <div className="se-presenter-step-one">
            <div className="se-presenter-step-one__line" style={{ display: 'flex', alignItems: 'flex-start', margin: '1.4rem 0' }}>
              <span style={{ flexShrink: 0, marginRight: '0.5rem' }}>Nous sommes</span>
              <TextField
                className="se-presenter-step-one__textfield se-presenter-step-one__textfield--full-width"
                variant="standard"
                style={{ flex: 1, minWidth: 0 }}
                fullWidth
                placeholder={labelPresentation}
                value={data.presentation}
                onChange={dataChange('presentation')}
                error={showError && !data.presentation}
                helperText={showError && !data.presentation ? 'Ce champ est obligatoire' : ''}
              />
            </div>
            <div className="se-presenter-step-one__line">
              <span>Nous sommes </span>{' '}
              <TextField
                className="se-presenter-step-one__textfield"
                variant="standard"
                type="number"
                inputProps={{ min: 0 }}
                onFocus={onFocusInput('totalStudent')}
                size="small"
                value={data.totalStudent ?? ''}
                onChange={dataChange('totalStudent')}
                helperText={errorMessage(data.girlStudent || 0, data.boyStudent || 0, data.totalStudent || 0)}
                error={
                  showError &&
                  (!isValidSum(data.girlStudent || 0, data.boyStudent || 0, data.totalStudent || 0) ||
                    data.totalStudent === 0 ||
                    data.totalStudent === null)
                }
              />{' '}
              <span> élève{pluralS(data.totalStudent || 0)}, dont </span>{' '}
              <TextField
                className="se-presenter-step-one__textfield"
                variant="standard"
                type="number"
                size="small"
                onFocus={onFocusInput('girlStudent')}
                value={data.girlStudent ?? ''}
                onChange={dataChange('girlStudent')}
                inputProps={{ min: 0 }}
              />{' '}
              <span> fille{pluralS(data.girlStudent || 0)} et </span>{' '}
              <TextField
                className="se-presenter-step-one__textfield"
                variant="standard"
                type="number"
                size="small"
                value={data.boyStudent ?? ''}
                onFocus={onFocusInput('boyStudent')}
                onChange={dataChange('boyStudent')}
                inputProps={{ min: 0 }}
              />{' '}
              <span> garçon{pluralS(data.boyStudent || 0)}.</span>
            </div>
            <div className="se-presenter-step-one__line">
              <span>En moyenne, l’âge des enfants de notre classe est </span>{' '}
              <TextField
                className="se-presenter-step-one__textfield"
                variant="standard"
                type="number"
                size="small"
                value={data.meanAge ?? ''}
                onFocus={onFocusInput('meanAge')}
                onChange={dataChange('meanAge')}
                helperText={showError && (data.meanAge === 0 || data.meanAge === null) ? 'Ce champ est obligatoire' : ''}
                error={showError && (data.meanAge === 0 || data.meanAge === null)}
                inputProps={{ min: 0 }}
              />{' '}
              <span> an{pluralS(data.meanAge || 0)}.</span>
            </div>
            <div className="se-presenter-step-one__line">
              <span>Nous avons </span>{' '}
              <TextField
                className="se-presenter-step-one__textfield"
                variant="standard"
                type="number"
                size="small"
                value={data.totalTeacher ?? ''}
                onFocus={onFocusInput('totalTeacher')}
                onChange={dataChange('totalTeacher')}
                helperText={errorMessage(data.womanTeacher || 0, data.manTeacher || 0, data.totalTeacher || 0)}
                error={
                  showError &&
                  (!isValidSum(data.womanTeacher || 0, data.manTeacher || 0, data.totalTeacher || 0) ||
                    data.totalTeacher === 0 ||
                    data.totalTeacher === null)
                }
                inputProps={{ min: 0 }}
              />{' '}
              <span> professeur{pluralS(data.totalTeacher || 0)}, dont </span>{' '}
              <TextField
                className="se-presenter-step-one__textfield"
                variant="standard"
                type="number"
                size="small"
                value={data.womanTeacher ?? ''}
                onFocus={onFocusInput('womanTeacher')}
                onChange={dataChange('womanTeacher')}
                inputProps={{ min: 0 }}
              />{' '}
              <span> femme{pluralS(data.womanTeacher || 0)} et </span>{' '}
              <TextField
                className="se-presenter-step-one__textfield"
                variant="standard"
                type="number"
                size="small"
                value={data.manTeacher ?? ''}
                onFocus={onFocusInput('manTeacher')}
                onChange={dataChange('manTeacher')}
                inputProps={{ min: 0 }}
              />{' '}
              <span> homme{pluralS(data.manTeacher || 0)}.</span>
            </div>
            <div className="se-presenter-step-one__line">
              <span>Dans notre école, il y a </span>{' '}
              <TextField
                className="se-presenter-step-one__textfield"
                variant="standard"
                type="number"
                size="small"
                value={data.numberClassroom ?? ''}
                onFocus={onFocusInput('numberClassroom')}
                onChange={dataChange('numberClassroom')}
                helperText={showError && (data.numberClassroom === 0 || data.numberClassroom === null) ? 'Ce champ est obligatoire' : ''}
                error={showError && (data.numberClassroom === 0 || data.numberClassroom === null)}
                inputProps={{ min: 0 }}
              />{' '}
              <span> classe{pluralS(data.numberClassroom || 0)} et </span>{' '}
              <TextField
                className="se-presenter-step-one__textfield"
                variant="standard"
                type="number"
                size="small"
                value={data.totalSchoolStudent ?? ''}
                onFocus={onFocusInput('totalSchoolStudent')}
                onChange={dataChange('totalSchoolStudent')}
                helperText={showError && (data.totalSchoolStudent === 0 || data.totalSchoolStudent === null) ? 'Ce champ est obligatoire' : ''}
                error={showError && (data.totalSchoolStudent === 0 || data.totalSchoolStudent === null)}
                inputProps={{ min: 0 }}
              />{' '}
              <span> élève{pluralS(data.totalSchoolStudent || 0)}.</span>
            </div>
          </div>
          <h1 style={{ marginTop: '5rem' }}>À quoi ressemble votre classe ?</h1>
          <p>
            Pour donner à vos pélicopains un aperçu de votre classe, nous vous invitons à mettre en ligne{' '}
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
              {showError && data.classImg === '' && (
                <p className="text text--small text-center" style={{ color: errorColor }}>
                  Ce champs est obligatoire
                </p>
              )}
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
                helperText={showError && data.classImgDesc === '' && 'Ce champs est obligatoire'}
                error={showError && data.classImgDesc === ''}
              ></TextField>
            </div>
          </div>
          <StepsButton next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default MascotteStep1;
