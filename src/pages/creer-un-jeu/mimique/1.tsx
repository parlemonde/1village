import { useRouter } from 'next/router';
import React from 'react';

import { TextField, Grid, Button } from '@material-ui/core';

import { isGame } from 'src/activity-types/anyActivity';
import { DEFAULT_MIMIQUE_DATA, isMimique } from 'src/activity-types/game.const';
import { MimiqueData, MimiquesData, GameType } from 'types/game.types';
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
import ReactPlayer from 'react-player';

const MimiqueStep1: React.FC = () => {
  const router = useRouter();
  const [isError, setIsError] = React.useState<boolean>(false);
  const { activity, updateActivity, createNewActivity, save } = React.useContext(ActivityContext);
  const { user } = React.useContext(UserContext);
  const labelPresentation = getUserDisplayName(user, false);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!activity) {
      createNewActivity(ActivityType.GAME, GameType.MIMIQUE, {
        ...DEFAULT_MIMIQUE_DATA,
        presentation: labelPresentation,
      });
    } else if (activity && (!isGame(activity) || !isMimique(activity))) {
      createNewActivity(ActivityType.GAME, GameType.MIMIQUE, {
        ...DEFAULT_MIMIQUE_DATA,
        presentation: labelPresentation,
      });
    }
  }, [activity, labelPresentation, createNewActivity, router]);

  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;
  const data = (activity?.data as MimiquesData) || null;

  const dataChange = (key: keyof MimiqueData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newData = { ...data };
    newData.mimique1[key] = event.target.value;
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

  const isValid = () => {
    return (
      data.mimique1.origine != null &&
      data.mimique1.signification != null &&
      data.mimique1.fakeSignification1 != null &&
      data.mimique1.fakeSignification2 != null
      //&&data.mimique1.video != null
    );
  };

  const onNext = () => {
    save().catch(console.error);
    if (isValid()) {
      router.push('/creer-un-jeu/mimique/2');
    } else {
      setIsError(true);
    }
  };

  if (!user || !activity || !activity.data || !data.mimique1) {
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
        <Steps steps={['1ère mimique', '2ème mimique', '3ème mimique', 'Prévisualiser']} activeStep={0} />
        <div className="width-900">
          <h1>Présentez en vidéo une 1ère mimique à vos Pélicopains</h1>
          <p>
            Votre vidéo est un plan unique tourné à l’horizontal, qui montre un élève faisant la mimique et la situation dans laquelle on l’utilise..
            Gardez le mystère, et ne révélez pas à l’oral sa signification !
          </p>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              {data.mimique1.video && (
                <div style={{ width: '100%', height: '100%', marginTop: '0.2rem' }}>
                  <ReactPlayer width="100%" height="70%" light url={data.mimique1.video} controls />
                  <Button name="video" style={{ width: '100%', marginTop: '0.4rem' }} onClick={toggleModal} variant="outlined" color="primary">
                    changer de video
                  </Button>
                </div>
              )}
              {!data.mimique1.video && (
                <div>
                  {!isError && (
                    <Button name="video" style={{ width: '100%' }} onClick={toggleModal} variant="outlined" color="primary">
                      {<UploadIcon style={{ fill: 'currentcolor', width: '3rem', height: '3rem', margin: '30px' }} />}
                    </Button>
                  )}
                  {isError && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <Button name="video" style={{ width: '100%', borderColor: '#d93939' }} onClick={toggleModal} variant="outlined" color="primary">
                        {<UploadIcon style={{ color: '#d93939', width: '3rem', height: '3rem', margin: '30px' }} />}
                      </Button>
                      <span style={{ fontSize: '0.7rem', marginLeft: '1rem', color: '#d93939' }}>Ce champ est obligatoire</span>
                    </div>
                  )}
                  <p>Mettre en ligne la vidéo de la 1ère mimique</p>
                </div>
              )}
              <VideoModals
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                videoUrl={data.mimique1.video}
                value={data.mimique1.video}
                setVideoUrl={videoChange}
                id={0}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <h4>Que signifie cette mimique ?</h4>
              <TextField
                variant="outlined"
                value={data.mimique1.signification || ''}
                label="Signification réelle"
                onChange={dataChange('signification')}
                style={{ width: '100%', margin: '10px' }}
                error={isError && data.mimique1.signification == null}
                helperText={isError && data.mimique1.signification == null ? 'Ce champ est obligatoire' : ''}
              />
              <h4>Quelle est l’origine de cette mimique ?</h4>
              <TextField
                variant="outlined"
                label="Origine"
                value={data.mimique1.origine || ''}
                onChange={dataChange('origine')}
                style={{ width: '100%', margin: '10px' }}
                error={isError && data.mimique1.origine == null}
                helperText={isError && data.mimique1.origine == null ? 'Ce champ est obligatoire' : ''}
              />
            </Grid>
          </Grid>
          <h1>Présentez en vidéo une 1ère mimique à vos Pélicopains</h1>
          <p>
            Vos Pélicopains verront la vidéo de votre mimique, et devront trouver sa signification parmi la vraie, et ces deux fausses, qu’il faut
            inventer :
          </p>
          <TextField
            variant="outlined"
            label="Signification inventée 1"
            value={data.mimique1.fakeSignification1 || ''}
            onChange={dataChange('fakeSignification1')}
            style={{ width: '100%', margin: '10px' }}
            error={isError && data.mimique1.fakeSignification1 == null}
            helperText={isError && data.mimique1.fakeSignification1 == null ? 'Ce champ est obligatoire' : ''}
          />
          <TextField
            variant="outlined"
            label="Signification inventée 2"
            value={data.mimique1.fakeSignification2 || ''}
            onChange={dataChange('fakeSignification2')}
            style={{ width: '100%', margin: '10px' }}
            error={isError && data.mimique1.fakeSignification2 == null}
            helperText={isError && data.mimique1.fakeSignification2 == null ? 'Ce champ est obligatoire' : ''}
          />
          <StepsButton next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default MimiqueStep1;
