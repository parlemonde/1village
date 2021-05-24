import React, { ChangeEventHandler } from 'react';

import { TextField, Grid, Button } from '@material-ui/core';

import { MimiqueData } from 'types/game.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { UserContext } from 'src/contexts/userContext';
import { VideoModals } from 'src/components/activities/content/editors/VideoEditor/VideoModals';
import UploadIcon from 'src/svg/jeu/add-video.svg';
import ReactPlayer from 'react-player';
import { ActivityContext } from 'src/contexts/activityContext';

interface MimiqueSelectorProps {
  mimiqueData: MimiqueData;
  mimiqueNumber: string;
  onDataChange(key: keyof MimiqueData): ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onVideoChange(newValue: string): void;
  onNext(): void;
}

const MimiqueSelector: React.FC<MimiqueSelectorProps> = ({
  mimiqueData,
  mimiqueNumber,
  onDataChange,
  onVideoChange,
  onNext,
}: MimiqueSelectorProps) => {
  const [isError, setIsError] = React.useState<boolean>(false);
  const { user } = React.useContext(UserContext);
  const { save } = React.useContext(ActivityContext);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const isValid = () => {
    return (
      mimiqueData.origine != null &&
      mimiqueData.origine.length > 0 &&
      mimiqueData.signification != null &&
      mimiqueData.signification.length > 0 &&
      mimiqueData.fakeSignification1 != null &&
      mimiqueData.fakeSignification1.length > 0 &&
      mimiqueData.fakeSignification2 != null &&
      mimiqueData.fakeSignification2.length > 0 &&
      mimiqueData.video != null &&
      mimiqueData.video.length > 0
    );
  };

  const isFieldValid = (value: string) => {
    return value != null && value.length > 0;
  };

  const nextPage = () => {
    save().catch(console.error);
    if (isValid()) {
      onNext();
    } else {
      setIsError(true);
    }
  };

  if (!user || !mimiqueData) {
    return (
      <Base>
        <div></div>
      </Base>
    );
  }

  return (
    <>
      <div className="width-900">
        <h1>Présentez en vidéo une {mimiqueNumber} mimique à vos Pélicopains</h1>
        <p>
          Votre vidéo est un plan unique tourné à l’horizontal, qui montre un élève faisant la mimique et la situation dans laquelle on l’utilise..
          Gardez le mystère, et ne révélez pas à l’oral sa signification !
        </p>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            {isFieldValid(mimiqueData.video) && (
              <div style={{ width: '100%', height: '100%', marginTop: '0.2rem' }}>
                <ReactPlayer width="100%" height="70%" light url={mimiqueData.video || ''} controls />
                <Button name="video" style={{ width: '100%', marginTop: '0.4rem' }} onClick={toggleModal} variant="outlined" color="primary">
                  changer de video
                </Button>
              </div>
            )}
            {!isFieldValid(mimiqueData.video) && (
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
                <p>Mettre en ligne la vidéo de la {mimiqueNumber} mimique</p>
              </div>
            )}
            <VideoModals
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              videoUrl={mimiqueData.video}
              value={mimiqueData.video || ''}
              setVideoUrl={onVideoChange}
              id={0}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <h4>Que signifie cette mimique ?</h4>
            <TextField
              variant="outlined"
              value={mimiqueData.signification || ''}
              label="Signification réelle"
              onChange={onDataChange('signification')}
              style={{ width: '100%', margin: '10px' }}
              error={isError && !isFieldValid(mimiqueData.signification)}
              helperText={isError && !isFieldValid(mimiqueData.signification) ? 'Ce champ est obligatoire' : ''}
              multiline
            />
            <h4>Quelle est l’origine de cette mimique ?</h4>
            <TextField
              variant="outlined"
              label="Origine"
              value={mimiqueData.origine || ''}
              onChange={onDataChange('origine')}
              style={{ width: '100%', margin: '10px' }}
              error={isError && !isFieldValid(mimiqueData.origine)}
              helperText={isError && !isFieldValid(mimiqueData.origine) ? 'Ce champ est obligatoire' : ''}
              multiline
            />
          </Grid>
        </Grid>
        <h1>Présentez en vidéo une {mimiqueNumber} mimique à vos Pélicopains</h1>
        <p>
          Vos Pélicopains verront la vidéo de votre mimique, et devront trouver sa signification parmi la vraie, et ces deux fausses, qu’il faut
          inventer :
        </p>
        <TextField
          variant="outlined"
          label="Signification inventée 1"
          value={mimiqueData.fakeSignification1 || ''}
          onChange={onDataChange('fakeSignification1')}
          style={{ width: '100%', margin: '10px' }}
          error={isError && !isFieldValid(mimiqueData.fakeSignification1)}
          helperText={isError && !isFieldValid(mimiqueData.fakeSignification1) ? 'Ce champ est obligatoire' : ''}
          multiline
        />
        <TextField
          variant="outlined"
          label="Signification inventée 2"
          value={mimiqueData.fakeSignification2 || ''}
          onChange={onDataChange('fakeSignification2')}
          style={{ width: '100%', margin: '10px' }}
          error={isError && !isFieldValid(mimiqueData.fakeSignification2)}
          helperText={isError && !isFieldValid(mimiqueData.fakeSignification2) ? 'Ce champ est obligatoire' : ''}
          multiline
        />
        <StepsButton next={nextPage} />
      </div>
    </>
  );
};

export default MimiqueSelector;
