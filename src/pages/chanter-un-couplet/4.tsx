import { useRouter } from 'next/router';
import React from 'react';

import MicNoneIcon from '@mui/icons-material/MicNone';
import MusicNote from '@mui/icons-material/MusicNote';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import styles from '../../styles/chanter-un-couplet.module.css';
import type { ClassAnthemData } from 'src/activity-types/classAnthem.types';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import AudioEditor from 'src/components/activities/content/editors/AudioEditor/AudioEditor';
import { DraggableTrack } from 'src/components/audio/DraggableTrack';
import VolumeControl from 'src/components/audio/VolumeControls/VolumeControl';
import AddAudioButton from 'src/components/buttons/AddAudioButton';
import { DeleteButton } from 'src/components/buttons/DeleteButton';
import { EditButton } from 'src/components/buttons/EditButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { getLongestVerseSampleDuration, getVerseTracks } from 'src/utils/audios';
import { toTime } from 'src/utils/toTime';

const SongStep4 = () => {
  const router = useRouter();

  const { activity, updateActivity, save } = React.useContext(ActivityContext);
  const data = (activity?.data as ClassAnthemData) || null;

  const [isLoading, setIsLoading] = React.useState(false);
  const [isAudioEditorOpen, setIsAudioEditorOpen] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isRecordInvalidDuration, setIsRecordInvalidDuration] = React.useState(false);

  const [verseMixDuration, setVerseMixDuration] = React.useState(0);
  const [verseRecordAudio, setVerseRecordAudio] = React.useState<HTMLAudioElement | null>(null);
  const [verseMixAudio, setVerseMixAudio] = React.useState<HTMLAudioElement | null>(null);
  const musicIcon = <MusicNote sx={{ color: '#666' }} />;
  const microIcon = <MicNoneIcon sx={{ color: '#666' }} />;

  const errorSteps = React.useMemo(() => {
    const errors: number[] = [];
    if (data !== null && !data?.verseMixUrl) {
      errors.push(0);
    }
    return errors;
  }, [data]);

  React.useEffect(() => {
    if (data) {
      if (data.verseMixUrl && !verseMixAudio) {
        setVerseMixAudio(new Audio(data.verseMixUrl));
      }
      if (data.classRecordTrack.sampleUrl && !verseRecordAudio) {
        setVerseRecordAudio(new Audio(data.classRecordTrack.sampleUrl));
      }
      if (verseMixDuration === 0) {
        setVerseMixDuration(getLongestVerseSampleDuration(getVerseTracks(data.anthemTracks)));
      }
    }
  }, [data, verseMixAudio, verseMixDuration, verseRecordAudio]);

  if (!activity || !data) {
    return (
      <Base>
        <div></div>
      </Base>
    );
  }

  const onNext = () => {
    if (verseMixAudio && verseRecordAudio) {
      verseMixAudio.pause();
      verseRecordAudio.pause();
    }
    setIsLoading(true);
    save().catch(console.error);
    setIsLoading(false);
    router.push('/chanter-un-couplet/5');
  };

  const onPlay = () => {
    if (verseMixAudio && verseRecordAudio) {
      verseMixAudio.play();
      verseRecordAudio.play();
    }
    setIsPlaying(true);
  };

  const onPause = () => {
    if (verseMixAudio && verseRecordAudio) {
      verseMixAudio.pause();
      verseRecordAudio.pause();
    }
    setIsPlaying(false);
  };

  const onRestart = () => {
    if (verseMixAudio && verseRecordAudio) {
      verseMixAudio.currentTime = 0;
      verseRecordAudio.currentTime = data.classRecordTrack.sampleStartTime;
    }
    onPlay();
  };

  const handleSampleUpdate = (url: string, duration: number) => {
    if (!url) return;
    if (duration > verseMixDuration) {
      setIsRecordInvalidDuration(false);
      const tempClassRecordTrack = { ...data.classRecordTrack, sampleUrl: url, sampleDuration: duration };
      updateActivity({ data: { ...data, classRecordTrack: tempClassRecordTrack } });
      setVerseRecordAudio(new Audio(url));
    } else {
      setIsRecordInvalidDuration(true);
    }
  };

  const handleSampleStart = (startTime: number) => {
    const tempClassRecordTrack = { ...data.classRecordTrack, sampleStartTime: startTime };
    updateActivity({ data: { ...data, classRecordTrack: tempClassRecordTrack } });
  };

  const handleSampleDelete = () => {
    const tempClassRecordTrack = { ...data.classRecordTrack, sampleUrl: '', sampleDuration: 0, sampleStartTime: 0 };
    updateActivity({ data: { ...data, classRecordTrack: tempClassRecordTrack } });
    setVerseRecordAudio(null);
    onPause();
  };

  return (
    <Base>
      <div className={styles.mainContainer}>
        <Steps
          steps={['Mixer', 'Écrire', 'Enregistrer', 'Synchroniser', 'Prévisualiser']}
          activeStep={3}
          errorSteps={errorSteps}
          urls={['/chanter-un-couplet/1', '/chanter-un-couplet/2', '/chanter-un-couplet/3', '/chanter-un-couplet/4', '/chanter-un-couplet/5']}
        />
        <div className={styles.contentContainer}>
          <h1>Synchronisez votre voix sur l&apos;hymne</h1>
          <p>Avez-vous bien chanté en rythme ? 😀</p>
          <p>
            Pour le savoir, importez le fichier son contenant vos voix, et déplacez-le avec votre souris pour le caler sur l&apos;hymne ! Vous pouvez
            changer réduire ou augmenter le volume du son pour que vos voix s’entendent suffisamment.
          </p>
          {!verseRecordAudio ? (
            <AddAudioButton
              onClick={() => {
                setIsAudioEditorOpen(true);
                setIsRecordInvalidDuration(false);
              }}
            />
          ) : (
            <div className={styles.verseRecordTrack}>
              <div className={styles.verseRecordTrackInfos}>
                {microIcon}
                <p>Piste vocale</p>
                <p>{toTime(data.classRecordTrack.sampleDuration)}</p>
              </div>
              <div className={styles.verseRecordTrackControls}>
                <EditButton
                  size="small"
                  onClick={() => {
                    setIsAudioEditorOpen(true);
                    setIsRecordInvalidDuration(false);
                  }}
                />
                <DeleteButton
                  color="red"
                  confirmTitle="Supprimer ce son ?"
                  confirmLabel="Voulez-vous vraiment supprimer ce son ?"
                  onDelete={() => {
                    handleSampleDelete();
                    setIsAudioEditorOpen(false);
                    setIsRecordInvalidDuration(false);
                  }}
                />
              </div>
            </div>
          )}

          <div className={styles.errorContainer}>
            {!data?.verseMixUrl && <p>Il manque votre mix du couplet !</p>}
            {isRecordInvalidDuration &&
              (!verseRecordAudio ? (
                <p>Vous devez choisir un enregistrement d&apos;au moins {Math.ceil(verseMixDuration)} secondes !</p>
              ) : (
                <p>Pour modifier l&apos;enregistrement, merci d&apos;en choisir un supérieur à {Math.ceil(verseMixDuration)} secondes !</p>
              ))}
          </div>

          {verseMixAudio && verseRecordAudio && (
            <>
              <div className={styles.draggableTrackContainer}>
                <DraggableTrack
                  verseRecordDuration={data.classRecordTrack.sampleDuration}
                  verseMixDuration={verseMixDuration}
                  initialVerseStart={data.classRecordTrack.sampleStartTime}
                  onVerseStartChange={(startTime) => {
                    verseRecordAudio.currentTime = startTime;
                    handleSampleStart(startTime);
                  }}
                  onChangeEnd={(startTime) => {
                    verseRecordAudio.currentTime = startTime;
                    verseMixAudio.currentTime = 0;
                    verseRecordAudio.play();
                    verseMixAudio.play();
                    setIsPlaying(true);
                    handleSampleStart(startTime);
                  }}
                  pauseAudios={onPause}
                />
              </div>
              <div className={styles.draggableTrackControls}>
                <div>
                  <p>Régler le volume de l&apos;instrumental</p>
                  <VolumeControl
                    icon={musicIcon}
                    handleVolumeChange={(volume) => {
                      verseMixAudio.volume = volume / 10;
                      const tempClassRecordTrack = { ...data.classRecordTrack, sampleVolume: volume };
                      updateActivity({ data: { ...data, classRecordTrack: tempClassRecordTrack } });
                    }}
                  />
                </div>
                <div>
                  <p>Régler le volume des voix</p>
                  <VolumeControl icon={microIcon} handleVolumeChange={(value) => (verseRecordAudio.volume = value / 10)} />
                </div>

                <div>
                  <div>
                    <Button
                      variant="contained"
                      sx={{
                        minWidth: '100px',
                      }}
                      onClick={() => {
                        isPlaying ? onPause() : onPlay();
                      }}
                    >
                      {isPlaying ? 'Pause' : 'Jouer'}
                    </Button>
                  </div>
                  <div>
                    <Button variant="contained" onClick={onRestart}>
                      Recommencer
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}

          {isAudioEditorOpen && (
            <AudioEditor
              sampleUrl={data.classRecordTrack.sampleUrl}
              sampleDuration={data.classRecordTrack.sampleDuration}
              handleSampleUpdate={handleSampleUpdate}
              setIsAudioEditorOpen={setIsAudioEditorOpen}
            />
          )}
          <div></div>
          <StepsButton prev="/chanter-un-couplet/3" next={onNext} />
          <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
      </div>
    </Base>
  );
};

export default SongStep4;
