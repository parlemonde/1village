import { useRouter } from 'next/router';
import React from 'react';

import { TextField, Grid, Button } from '@material-ui/core';

import { MimiqueData, MimiquesData } from 'types/game.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { BackButton } from 'src/components/buttons/BackButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { VideoModals } from 'src/components/activities/content/editors/VideoEditor/VideoModals';
import UploadIcon from 'src/svg/jeu/add-video.svg';
import { isMimique } from 'src/activity-types/game.const';
import { isGame } from 'src/activity-types/anyActivity';
import ReactPlayer from 'react-player';

const MimiqueStep2: React.FC = () => {
  const router = useRouter();
  const [isError, setIsError] = React.useState<boolean>(false);
  const { activity, updateActivity, save } = React.useContext(ActivityContext);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/creer-un-jeu');
    } else if (activity && (!isGame(activity) || !isMimique(activity))) {
      router.push('/creer-un-jeu');
    }
  }, [activity, router]);

  const data = (activity?.data as MimiquesData) || null;

  const dataChange = (key: keyof MimiqueData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newData = { ...data };
    newData.mimique2[key] = event.target.value;
    updateActivity({ data: newData });
  };

  const videoChange = (newValue: string) => {
    console.log(newValue);
    const newData = { ...data };
    newData.mimique2.video = newValue;
    updateActivity({ data: newData });
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const isValid = () => {
    return (
      data.mimique2.origine != null &&
      data.mimique2.signification != null &&
      data.mimique2.fakeSignification1 != null &&
      data.mimique2.fakeSignification2 != null
      //&&data.mimique2.video != null
    );
  };

  const onNext = () => {
    save().catch(console.error);
    if (isValid()) {
      router.push('/creer-un-jeu/mimique/3');
    } else {
      setIsError(true);
    }
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
        {<BackButton href="/creer-un-jeu/mimique/1" />}
        <Steps steps={['1ère mimique', '2ème mimique', '3ème mimique', 'Prévisualiser']} activeStep={1} />
        <div className="width-900">
          <h1>Présentez en vidéo une 2ème mimique à vos Pélicopains</h1>
          <p>
            Votre vidéo est un plan unique tourné à l’horizontal, qui montre un élève faisant la mimique et la situation dans laquelle on l’utilise..
            Gardez le mystère, et ne révélez pas à l’oral sa signification !
          </p>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              {data.mimique2.video && (
                <div style={{ width: '100%', height: '100%', marginTop: '0.2rem' }}>
                  <ReactPlayer width="100%" height="70%" light url={data.mimique2.video} controls />
                  <Button name="video" style={{ width: '100%', marginTop: '0.4rem' }} onClick={toggleModal} variant="outlined" color="primary">
                    changer de video
                  </Button>
                </div>
              )}
              {!data.mimique2.video && (
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
                  <p>Mettre en ligne la vidéo de la 2ème mimique</p>
                </div>
              )}
              <VideoModals
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                videoUrl={data.mimique2.video}
                setVideoUrl={videoChange}
                id={0}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <h4>Que signifie cette mimique ?</h4>
              <TextField
                variant="outlined"
                label="Signification réelle"
                value={data.mimique2.signification}
                onChange={dataChange('signification')}
                style={{ width: '100%', margin: '10px' }}
                error={isError && data.mimique2.signification == null}
                helperText={isError && data.mimique2.signification == null ? 'Ce champ est obligatoire' : ''}
              />
              <h4>Quelle est l’origine de cette mimique ?</h4>
              <TextField
                variant="outlined"
                label="Origine"
                value={data.mimique2.origine}
                onChange={dataChange('origine')}
                style={{ width: '100%', margin: '10px' }}
                error={isError && data.mimique2.origine == null}
                helperText={isError && data.mimique2.origine == null ? 'Ce champ est obligatoire' : ''}
              />
            </Grid>
          </Grid>
          <h1>Présentez en vidéo une 2ème mimique à vos Pélicopains</h1>
          <p>
            Vos Pélicopains verront la vidéo de votre mimique, et devront trouver sa signification parmi la vraie, et ces deux fausses, qu’il faut
            inventer :
          </p>
          <TextField
            variant="outlined"
            label="Signification inventée 1"
            value={data.mimique2.fakeSignification1}
            onChange={dataChange('fakeSignification1')}
            style={{ width: '100%', margin: '10px' }}
            error={isError && data.mimique2.fakeSignification1 == null}
            helperText={isError && data.mimique2.fakeSignification1 == null ? 'Ce champ est obligatoire' : ''}
          />
          <TextField
            variant="outlined"
            label="Signification inventée 2"
            value={data.mimique2.fakeSignification2}
            onChange={dataChange('fakeSignification2')}
            style={{ width: '100%', margin: '10px' }}
            error={isError && data.mimique2.fakeSignification2 == null}
            helperText={isError && data.mimique2.fakeSignification2 == null ? 'Ce champ est obligatoire' : ''}
          />
          <StepsButton next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default MimiqueStep2;
