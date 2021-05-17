import { useRouter } from 'next/router';
import React from 'react';

import { TextField, Grid, Button } from '@material-ui/core';

import { isGame } from 'src/activity-types/anyActivity';
import { DEFAULT_MIMIQUE_DATA, isMimique, GAME } from 'src/activity-types/game.const';
import { MimiqueData, MimiquesData } from 'src/activity-types/game.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { BackButton } from 'src/components/buttons/BackButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { getUserDisplayName } from 'src/utils';
import { ActivityType, ActivityStatus } from 'types/activity.type';
import { VideoModals } from 'src/components/activities/content/editors/VideoEditor/VideoModals';
import UploadIcon from 'src/svg/jeu/add-video.svg';

const MimiqueStep3: React.FC = () => {
  const router = useRouter();
  const [isError, setIsError] = React.useState<boolean>(false);
  const { activity, updateActivity, createActivityIfNotExist, save } = React.useContext(ActivityContext);
  const { user } = React.useContext(UserContext);
  const labelPresentation = getUserDisplayName(user, false);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const created = React.useRef(false);
  React.useEffect(() => {
    if (!created.current) {
      if (!activity) {
        created.current = true;
        createActivityIfNotExist(ActivityType.GAME, GAME.MIMIQUE, {
          ...DEFAULT_MIMIQUE_DATA,
          presentation: labelPresentation,
        }).catch(console.error);
      } else if (activity && (!isGame(activity) || !isMimique(activity))) {
        created.current = true;
        createActivityIfNotExist(ActivityType.GAME, GAME.MIMIQUE, {
          ...DEFAULT_MIMIQUE_DATA,
          presentation: labelPresentation,
        }).catch(console.error);
      }
    }
  }, [activity, labelPresentation, createActivityIfNotExist, router]);

  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;
  const data = (activity?.data as MimiquesData) || null;

  const dataChange = (key: keyof MimiqueData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newData = { ...data };
    newData.mimique3[key] = event.target.value;
    updateActivity({ data: newData });
  };

  const videoChange = (newValue: string) => {
    console.log(newValue);
    const newData = { ...data };
    newData.mimique1.video = newValue;
    updateActivity({ data: newData });
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const errorMessage = () => {
    if (isError) {
      return 'Merci de remplir tout les champs';
    }
    return '';
  };

  const isValid = () => {
    return (
      data.mimique3.origine.length > 0 &&
      data.mimique3.signification.length > 0 &&
      data.mimique3.fakeSignification1.length > 0 &&
      data.mimique3.fakeSignification2.length > 0 //&&
      //data.mimique3.video.length > 0
    );
  };

  const onNext = () => {
    save().catch(console.error);
    if (isValid()) {
      router.push('/creer-un-jeu/mimique/4');
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
        {!isEdit && <BackButton href="/creer-un-jeu" />}
        <Steps steps={['1ère mimique', '2ème mimique', '3ème mimique', 'Prévisualiser']} activeStep={2} />
        <div className="width-900">
          <h1>Présentez en vidéo une 3ème mimique à vos Pélicopains</h1>
          <p>
            Votre vidéo est un plan unique tourné à l’horizontal, qui montre un élève faisant la mimique et la situation dans laquelle on l’utilise..
            Gardez le mystère, et ne révélez pas à l’oral sa signification !
          </p>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Button name="video" style={{ width: '100%', background: data.mimique3.video ? 'lightgrey' : 'lightgrey' }} onClick={toggleModal}>
                {<UploadIcon style={{ fill: 'currentcolor', width: '3rem', height: '3rem', margin: '30px' }} />}
              </Button>
              <p>Mettre en ligne la vidéo de la 3ème mimique</p>
              <VideoModals
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                videoUrl={data.mimique3.video}
                setVideoUrl={videoChange}
                id={0}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <h4>Que signifie cette mimique ?</h4>
              <TextField
                variant="outlined"
                label="Signification réelle"
                value={data.mimique3.signification}
                onChange={dataChange('signification')}
                style={{ width: '100%' }}
              />
              <h4>Quelle est l’origine de cette mimique ?</h4>
              <TextField
                variant="outlined"
                label="Origine"
                value={data.mimique3.origine}
                onChange={dataChange('origine')}
                style={{ width: '100%' }}
              />
            </Grid>
          </Grid>
          <h1>Présentez en vidéo une 3ème mimique à vos Pélicopains</h1>
          <p>
            Vos Pélicopains verront la vidéo de votre mimique, et devront trouver sa signification parmi la vraie, et ces deux fausses, qu’il faut
            inventer :
          </p>
          <TextField
            variant="outlined"
            label="Signification inventée 1"
            value={data.mimique3.fakeSignification1}
            onChange={dataChange('fakeSignification1')}
            style={{ width: '100%' }}
          />
          <TextField
            variant="outlined"
            label="Signification inventée 2"
            value={data.mimique3.fakeSignification2}
            onChange={dataChange('fakeSignification2')}
            style={{ width: '100%' }}
          />
          <StepsButton next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default MimiqueStep3;
