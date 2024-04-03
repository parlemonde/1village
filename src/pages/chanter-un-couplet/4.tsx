import { useRouter } from 'next/router';
import React from 'react';

import MicNoneIcon from '@mui/icons-material/MicNone';
import MusicNote from '@mui/icons-material/MusicNote';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import styles from './chanter-un-couplet.module.css';
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

  const [verseStart, setVerseStart] = React.useState(data?.verseStartTime ? data?.verseStartTime : 0);
  const [verseMixDuration, setVerseMixDuration] = React.useState(0);
  const [verseRecordDuration, setVerseRecordDuration] = React.useState(0);
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
        setVerseMixDuration(getLongestVerseSampleDuration(getVerseTracks(data.tracks)));
      }
      if (data.verseRecordUrl && !verseRecordAudio) {
        setVerseRecordAudio(new Audio(data.verseRecordUrl));
        setVerseRecordDuration(data.verseRecordDuration);
      }
      console.log('MIX', data.verseMixUrl, verseMixAudio, verseMixDuration);
      console.log('RECORD', data.verseRecordUrl, verseRecordAudio, verseRecordDuration);
    }
  }, [data, verseMixAudio, verseMixDuration, verseRecordAudio, verseRecordDuration]);

  React.useEffect(() => {
    console.log('verseStarrt', verseStart);
  }, [verseStart]);

  if (!activity || !data) {
    return (
      <Base>
        <div></div>
      </Base>
    );
  }

  const onNext = () => {
    verseMixAudio?.pause();
    verseRecordAudio?.pause();
    setIsLoading(true);
    setIsLoading(false);
    save().catch(console.error);
    router.push('/chanter-un-couplet/5');
  };

  const onPlay = () => {
    verseMixAudio?.play();
    verseRecordAudio?.play();
    setIsPlaying(true);
  };

  const onPause = () => {
    verseMixAudio?.pause();
    verseRecordAudio?.pause();
    setIsPlaying(false);
  };

  const handleSampleUpdate = (url: string, duration: number) => {
    if (duration > verseMixDuration) {
      setIsRecordInvalidDuration(false);
      updateActivity({ data: { ...data, verseRecordUrl: url, verseRecordDuration: duration } });
      setVerseRecordAudio(new Audio(url));
      setVerseRecordDuration(duration);
    } else {
      setIsRecordInvalidDuration(true);
      console.log('hihui');
    }
  };

  const handleSampleDelete = () => {
    updateActivity({ data: { ...data, verseRecordUrl: '', verseRecordDuration: 0 } });
    setVerseRecordAudio(null);
    setVerseRecordDuration(0);
    onPause();
  };

  const handleClassAnthemUpdate = () => {
    // updateActivity({ data: { ...data, verse, slicedRecord: response.data.url } });
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
          <p> Avez-vous bien chanter en rythme ?</p>
          <p>Pour le savoir, mettez en ligne le fichier son contenant vos voix, et déplacez-le avec votre souris pour le caler sur l&apos;hymne !</p>
          {!data?.verseMixUrl && (
            <p>
              <b>Il manque votre mix du couplet !</b>
            </p>
          )}
          {!verseRecordAudio ? (
            <AddAudioButton onClick={() => setIsAudioEditorOpen(true)} />
          ) : (
            <div className={styles.verseRecordTrack}>
              <div className={styles.verseRecordTrackInfos}>
                {microIcon}
                <p>Piste vocale</p>
                <p>{toTime(verseRecordDuration)}</p>
              </div>
              <div className={styles.verseRecordTrackControls}>
                <EditButton //add edit condition ??
                  size="small"
                  onClick={() => {
                    setIsAudioEditorOpen(true);
                  }}
                />
                <DeleteButton
                  color="red"
                  confirmTitle="Supprimer ce son ?"
                  confirmLabel="Voulez-vous vraiment supprimer ce son ?"
                  onDelete={() => {
                    handleSampleDelete();
                    setIsAudioEditorOpen(false);
                  }}
                />
              </div>
            </div>
          )}

          {isRecordInvalidDuration && <b>Votre enregistrement ne dure pas assez longtemps !</b>}

          {verseMixAudio && verseRecordAudio && (
            <>
              <div style={{ height: '200px' }}>
                <DraggableTrack
                  verseRecordDuration={verseRecordDuration}
                  verseMixDuration={verseMixDuration}
                  initialCoupletStart={verseStart}
                  onCoupletStartChange={(coupletStart) => {
                    verseRecordAudio.currentTime = coupletStart;
                    updateActivity({ data: { ...data, slicedVerseStartTime: coupletStart } });
                    setVerseStart(coupletStart);
                  }}
                  onChangeEnd={(coupletStart) => {
                    verseRecordAudio.currentTime = coupletStart;
                    verseMixAudio.currentTime = 0;
                    verseRecordAudio.play();
                    verseMixAudio.play();
                    setIsPlaying(true);
                    setVerseStart(coupletStart);
                    updateActivity({ data: { ...data, verseStart: coupletStart } });
                  }}
                  pauseAudios={onPause}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '860px',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  margin: '1rem 0',
                }}
              >
                <div>
                  <p>régler le volume de l&apos;instrumental</p>
                  <VolumeControl icon={musicIcon} handleVolumeChange={(value) => (verseMixAudio.volume = value / 10)} />
                </div>
                <div>
                  <p>régler le volume des voix</p>
                  <VolumeControl icon={microIcon} handleVolumeChange={(value) => (verseRecordAudio.volume = value / 10)} />
                </div>
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
              </div>
            </>
          )}

          {isAudioEditorOpen && (
            <AudioEditor
              sampleUrl={data.verseRecordUrl}
              sampleDuration={verseRecordDuration}
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

// const onNext = () => {
//     audioRef.current?.pause();
//     customizedMixAudio?.pause();
//     setIsLoading(true);
//     if (data.classRecord) {
//       audioBufferSlice(data.classRecord, verseStart * 1000, (verseStart + data?.verseTime) * 1000, async (slicedAudioBuffer: AudioBuffer) => {
//         const formData = new FormData();
//         formData.append('audio', new Blob([audioBufferToWav(slicedAudioBuffer)], { type: 'audio/vnd.wav' }), 'classRecordAcapella.wav');
//         const response = await axiosRequest({
//           method: 'POST',
//           url: '/audios',
//           data: formData,
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         });
//         const verse = await mixAudios([{ value: data.customizedMix }, { value: response.data.url }], axiosRequest);
//         updateActivity({ data: { ...data, verse, slicedRecord: response.data.url } });
//       });
//     }
//     setIsLoading(false);
//     save().catch(console.error);
//     router.push('/chanter-un-couplet/5');
//   };
