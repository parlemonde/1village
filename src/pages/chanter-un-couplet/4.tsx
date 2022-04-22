import { useRouter } from 'next/router';
import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import type { VerseRecordData } from 'src/activity-types/verseRecord.types';
import { Base } from 'src/components/Base';
import { DraggableTrack } from 'src/components/DraggableTrack';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { AnthemEditor } from 'src/components/activities/content/editors/AnthemEditor';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import SoundIcon from 'src/svg/editor/sound_icon.svg';
import { audioBufferSlice, audioBufferToWav, mixAudios } from 'src/utils/audios';

const SongStep4 = () => {
  const router = useRouter();
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const { activity, updateActivity, save } = React.useContext(ActivityContext);
  const [trackDuration, setTrackDuration] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const data = (activity?.data as VerseRecordData) || null;
  const [displayEditor, setDisplayEditor] = React.useState(!!data?.classRecord);
  const [verseStart, setVerseStart] = React.useState(data?.verseStart ? data?.verseStart : 0);
  const [classRecordAudio, setClassRecordAudio] = React.useState<HTMLAudioElement>();
  const [customizedMixAudio, setCustomizedMix] = React.useState<HTMLAudioElement>();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const classRecord = data?.classRecord;
  const customizedMix = data?.customizedMix;

  const errorSteps = React.useMemo(() => {
    const errors: number[] = [];
    if (activity !== null && !data?.customizedMix) {
      errors.push(0);
    }

    return errors;
  }, [activity, data?.customizedMix]);

  React.useEffect(() => {
    setClassRecordAudio(new Audio(classRecord));
    setCustomizedMix(new Audio(customizedMix));
  }, [classRecord, customizedMix]);

  const onNext = () => {
    setIsLoading(true);
    if (data?.classRecord) {
      audioBufferSlice(data?.classRecord, verseStart * 1000, (verseStart + data?.verseTime) * 1000, async (slicedAudioBuffer: AudioBuffer) => {
        const formData = new FormData();

        formData.append('audio', new Blob([audioBufferToWav(slicedAudioBuffer)], { type: 'audio/vnd.wav' }), 'classRecordAcapella.wav');
        const response = await axiosLoggedRequest({
          method: 'POST',
          url: '/audios',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const verse = await mixAudios([{ value: data?.customizedMix }, { value: response.data.url }], axiosLoggedRequest);
        await updateActivity({ data: { ...data, verse, slicedRecord: response.data.url } });
      });
    }
    save().catch(console.error);
    setIsLoading(false);
    router.push('/chanter-un-couplet/5');
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={['Mixer', 'Écrire', 'Enregistrer', 'Synchroniser', 'Prévisualiser']}
          activeStep={3}
          errorSteps={errorSteps}
          urls={['/chanter-un-couplet/1', '/chanter-un-couplet/2', '/chanter-un-couplet/3', '/chanter-un-couplet/4', '/chanter-un-couplet/5']}
        />
        <h1>Synchronisez votre voix sur l&apos;hymne</h1>
        <p> Avez-vous bien chanter en rythme ?</p>
        <p>Pour le savoir, mettez en ligne le fichier son contenant vos voix, et déplacez-le avec votre souris pour le caler sur l&apos;hymne !</p>
        <p>
          Pour lancer le mix avec votre enregistrement couplés, appuyer sur le bouton <b>Jouer</b>
        </p>
        {!data?.customizedMix && (
          <p>
            <b>Il manque votre mix du couplet !</b>
          </p>
        )}
        <div className="width-900">
          {!trackDuration && (
            <Button
              onClick={() => setDisplayEditor(true)}
              variant="text"
              className="navigation__button full-width"
              style={{
                justifyContent: 'flex-start',
                width: 'auto',
                boxShadow: '0px 4px 7px rgba(0, 0, 0, 0.1)',
                color: 'black',
                fontWeight: 'bold',
              }}
              endIcon={<SoundIcon />}
            >
              Ajouter un son
            </Button>
          )}
          {trackDuration > 0 &&
            (data?.verseTime < trackDuration ? (
              <div style={{ height: '200px' }}>
                <DraggableTrack
                  trackDuration={trackDuration}
                  coupletDuration={data?.verseTime}
                  initialCoupletStart={verseStart}
                  onCoupletStartChange={(coupletStart) => {
                    classRecordAudio?.pause();
                    customizedMixAudio?.pause();
                    setVerseStart(coupletStart);
                  }}
                  onChangeEnd={(coupletStart) => {
                    if (classRecordAudio !== undefined && customizedMixAudio !== undefined) {
                      classRecordAudio.currentTime = coupletStart;
                      customizedMixAudio.currentTime = 0;
                      classRecordAudio?.play();
                      customizedMixAudio?.play();
                      setIsPlaying(true);
                      updateActivity({ data: { ...data, verseStart: coupletStart } });
                    }
                  }}
                />
              </div>
            ) : (
              <p>Votre enregistrement ne dure pas assez longtemps !</p>
            ))}
          <div
            style={{
              width: '60%',
              margin: 'auto',
              padding: '10px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            {displayEditor && (
              <AnthemEditor
                value={data?.classRecord}
                onChange={(value) => {
                  classRecordAudio?.pause();
                  customizedMixAudio?.pause();
                  setIsPlaying(false);
                  updateActivity({ data: { ...data, classRecord: value } });
                }}
                setTime={(time) => {
                  setTrackDuration(time);
                }}
                edit
              />
            )}
            {trackDuration > 0 && (
              <Button
                variant="contained"
                style={{ height: '40px' }}
                onClick={() => {
                  if (isPlaying) {
                    classRecordAudio?.pause();
                    customizedMixAudio?.pause();
                    setIsPlaying(false);
                  } else {
                    classRecordAudio?.play();
                    customizedMixAudio?.play();
                    setIsPlaying(true);
                  }
                }}
              >
                {isPlaying ? `Pause` : `Jouer`}
              </Button>
            )}
          </div>
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
