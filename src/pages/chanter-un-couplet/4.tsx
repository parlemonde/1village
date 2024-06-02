import { useRouter } from 'next/router';
import React from 'react';

import MicNoneIcon from '@mui/icons-material/MicNone';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import styles from '../../styles/chanter-un-couplet.module.css';
import { postMixAudio } from 'src/api/audio/audio-mix.post';
import { deleteAudio } from 'src/api/audio/audio.delete';
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
import { ActivityStatus } from 'types/activity.type';
import type { Track } from 'types/anthem.type';
import { TrackType } from 'types/anthem.type';
import type { ClassAnthemData } from 'types/classAnthem.types';

const SongStep4 = () => {
  const router = useRouter();

  const { activity, updateActivity, save } = React.useContext(ActivityContext);
  const data = (activity?.data as ClassAnthemData) || null;

  const [isLoading, setIsLoading] = React.useState(false);
  const [isAudioEditorOpen, setIsAudioEditorOpen] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);

  const verseMixDuration = data ? getLongestVerseSampleDuration(getVerseTracks(data.anthemTracks)) : 0;
  const [verseRecordAudio, setVerseRecordAudio] = React.useState<HTMLAudioElement | null>(null);
  const [verseMixAudio, setVerseMixAudio] = React.useState<HTMLAudioElement | null>(null);
  const microIcon = <MicNoneIcon sx={{ color: '#666' }} />;

  const errorSteps = React.useMemo(() => {
    const errors: number[] = [];
    if (data !== null && !data?.verseMixUrl) {
      errors.push(0);
    }
    return errors;
  }, [data]);

  const animationFrameRef = React.useRef<number | null>(null);
  const recordStartTimeRef = React.useRef<number>(0);
  recordStartTimeRef.current = data?.classRecordTrack.sampleStartTime || 0;
  const onTimeUpdate = () => {
    if (verseMixAudio) {
      setCurrentTime(verseMixAudio.currentTime);
      if (verseMixAudio.currentTime >= verseMixAudio.duration) {
        setIsPlaying(false);
        verseMixAudio.pause();
        verseRecordAudio?.pause();
      } else if (!verseMixAudio.paused) {
        if (verseMixAudio.currentTime >= recordStartTimeRef.current && verseRecordAudio && verseRecordAudio.paused) {
          verseRecordAudio?.play();
        }
        animationFrameRef.current = requestAnimationFrame(onTimeUpdate);
      }
    } else {
      setCurrentTime(0);
    }
  };

  const trimStartRef = React.useRef(0);
  trimStartRef.current = data?.classRecordTrack.sampleTrim?.start || 0;
  React.useEffect(() => {
    setCurrentTime(0);
    let newVerseMixAudio: HTMLAudioElement | null = null;
    let newVerseRecordAudio: HTMLAudioElement | null = null;

    if (data?.verseMixUrl) {
      newVerseMixAudio = new Audio(data.verseMixUrl);
      newVerseMixAudio.volume = 0.5; // set default to half to allow increasing the record above 1.
    }
    if (data?.classRecordTrack.sampleUrl) {
      newVerseRecordAudio = new Audio(data.classRecordTrack.sampleUrl);
      newVerseRecordAudio.currentTime = trimStartRef.current;
    }

    setVerseMixAudio(newVerseMixAudio);
    setVerseRecordAudio(newVerseRecordAudio);

    return () => {
      newVerseMixAudio?.pause();
      newVerseRecordAudio?.pause();
      newVerseMixAudio?.remove();
      newVerseRecordAudio?.remove();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [data?.verseMixUrl, data?.classRecordTrack?.sampleUrl]);

  if (!activity || !data) {
    return (
      <Base>
        <div></div>
      </Base>
    );
  }

  const buildFinalMix = async () => {
    // -- clean previous mix
    if (data.verseFinalMixUrl && activity?.status === ActivityStatus.DRAFT) {
      await deleteAudio(data.verseFinalMixUrl).catch(console.error);
    }

    const tracks = data.anthemTracks.filter((t) => t.sampleUrl !== '');

    if (data.classRecordTrack.sampleUrl) {
      const verseTracks = tracks.filter((t) => t.type !== TrackType.VOCALS && t.type !== TrackType.INTRO_CHORUS && t.type !== TrackType.OUTRO);
      const verseFinalMixUrl = await postMixAudio([...verseTracks, data.classRecordTrack]);
      updateActivity({ data: { ...data, verseFinalMixUrl } });
    } else {
      updateActivity({ data: { ...data, verseFinalMixUrl: '' } });
    }
  };

  const onNext = async () => {
    if (verseMixAudio && verseRecordAudio) {
      verseMixAudio.pause();
      verseRecordAudio.pause();
    }
    setIsLoading(true);
    await buildFinalMix();
    save().catch(console.error);
    setIsLoading(false);
    router.push('/chanter-un-couplet/5');
  };

  const onPlay = (newCurrentTime = currentTime, newStartTime = data?.classRecordTrack?.sampleStartTime ?? 0) => {
    if (!verseMixAudio) {
      return;
    }

    if (verseMixAudio.currentTime >= verseMixAudio.duration) {
      onRestart();
      return;
    }

    verseMixAudio?.play();
    if (newStartTime <= newCurrentTime) {
      verseRecordAudio?.play();
    } else {
      verseRecordAudio?.pause();
    }
    setIsPlaying(true);
    onTimeUpdate();
  };

  const onPause = () => {
    verseMixAudio?.pause();
    verseRecordAudio?.pause();
    setIsPlaying(false);
  };

  const onRestart = (
    newStartTime = data?.classRecordTrack?.sampleStartTime ?? 0,
    recordTrimStart = data?.classRecordTrack?.sampleTrim?.start ?? 0,
  ) => {
    if (verseMixAudio && verseRecordAudio) {
      setCurrentTime(0);
      verseMixAudio.currentTime = 0;
      verseRecordAudio.currentTime = recordTrimStart;
      onPlay(0, newStartTime);
    }
  };

  const handleSampleUpdate = (url: string, duration: number) => {
    if (!url) return;
    const tempClassRecordTrack = { ...data.classRecordTrack, sampleUrl: url, sampleDuration: duration, startTime: 0 };
    const trim: Track['sampleTrim'] = {
      start: 0,
      end: Math.min(data.classRecordTrack.sampleDuration, verseMixDuration),
    };
    if (trim.end !== data.classRecordTrack.sampleDuration) {
      tempClassRecordTrack.sampleTrim = trim;
    } else {
      delete tempClassRecordTrack.sampleTrim;
    }
    updateActivity({ data: { ...data, classRecordTrack: tempClassRecordTrack } });
    setVerseRecordAudio(new Audio(url));
  };

  const handleSampleStart = (startTime: number) => {
    const tempClassRecordTrack = { ...data.classRecordTrack, sampleStartTime: Math.max(0, startTime) };
    const trim: Track['sampleTrim'] = {
      start: Math.max(0, -startTime),
      end: Math.min(data.classRecordTrack.sampleDuration, verseMixDuration - startTime),
    };
    if (trim.start !== 0 || trim.end !== data.classRecordTrack.sampleDuration) {
      tempClassRecordTrack.sampleTrim = trim;
    } else {
      delete tempClassRecordTrack.sampleTrim;
    }
    updateActivity({ data: { ...data, classRecordTrack: tempClassRecordTrack } });
  };

  const handleSampleDelete = () => {
    const tempClassRecordTrack = { ...data.classRecordTrack, sampleUrl: '', sampleDuration: 0, sampleStartTime: 0, sampleTrim: undefined };
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
          urls={['/chanter-un-couplet/1?edit', '/chanter-un-couplet/2', '/chanter-un-couplet/3', '/chanter-un-couplet/4', '/chanter-un-couplet/5']}
          onBeforeLeavePage={buildFinalMix}
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

          <div className={styles.errorContainer}>{!data?.verseMixUrl && <p>Il manque votre mix du couplet !</p>}</div>

          {verseMixAudio && verseRecordAudio && (
            <>
              <div className={styles.draggableTrackContainer}>
                <DraggableTrack
                  currentTime={currentTime}
                  verseRecordDuration={data.classRecordTrack.sampleDuration}
                  verseMixDuration={verseMixDuration}
                  initialRecordStart={
                    data.classRecordTrack.sampleTrim?.start ? -data.classRecordTrack.sampleTrim.start : data.classRecordTrack.sampleStartTime
                  }
                  onRecordStartChange={(startTime) => {
                    handleSampleStart(startTime);
                  }}
                  onChangeEnd={(startTime) => {
                    handleSampleStart(startTime);
                    onRestart(Math.max(0, startTime), Math.max(0, -startTime));
                  }}
                  pauseAudios={onPause}
                />
              </div>
              <div className={styles.draggableTrackControls}>
                <div>
                  <p>Régler le volume des voix</p>
                  <VolumeControl
                    icon={microIcon}
                    volume={(data.classRecordTrack.sampleVolume ?? 1) / 2}
                    handleVolumeChange={(newVolume) => {
                      verseRecordAudio.volume = newVolume;
                      updateActivity({
                        data: {
                          ...data,
                          classRecordTrack: {
                            ...data.classRecordTrack,
                            sampleVolume: newVolume * 2,
                          },
                        },
                      });
                    }}
                  />
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
                    <Button variant="contained" onClick={() => onRestart()}>
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
