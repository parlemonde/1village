import { useRouter } from 'next/router';
import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import type { VerseRecordData } from 'src/activity-types/verseRecord.types';
import { Base } from 'src/components/Base';
import { DraggableTrack } from 'src/components/DraggableTrack';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import AudioEditor from 'src/components/activities/content/editors/AudioEditor/AudioEditor';
import { ActivityContext } from 'src/contexts/activityContext';
import SoundIcon from 'src/svg/editor/sound_icon.svg';
import { audioBufferSlice, audioBufferToWav, mixAudios } from 'src/utils/audios';
import { axiosRequest } from 'src/utils/axiosRequest';

const SongStep4 = () => {
  const router = useRouter();

  const { activity, updateActivity, save } = React.useContext(ActivityContext);
  const [trackDuration, setTrackDuration] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const data = (activity?.data as VerseRecordData) || null;
  const [displayEditor, setDisplayEditor] = React.useState(!!data?.classRecord);
  const [verseStart, setVerseStart] = React.useState(data?.verseStart ? data?.verseStart : 0);
  const [customizedMixAudio, setCustomizedMix] = React.useState<HTMLAudioElement>();
  const customizedMix = data?.customizedMix;
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const errorSteps = React.useMemo(() => {
    const errors: number[] = [];
    if (data !== null && !data?.customizedMix) {
      errors.push(0);
    }

    return errors;
  }, [data]);

  React.useEffect(() => {
    setCustomizedMix(new Audio(customizedMix));
  }, [customizedMix]);

  if (!activity || !data) {
    return (
      <Base>
        <div></div>
      </Base>
    );
  }

  const onNext = () => {
    audioRef.current?.pause();
    customizedMixAudio?.pause();
    setIsLoading(true);
    if (data.classRecord) {
      audioBufferSlice(data.classRecord, verseStart * 1000, (verseStart + data?.verseTime) * 1000, async (slicedAudioBuffer: AudioBuffer) => {
        const formData = new FormData();
        formData.append('audio', new Blob([audioBufferToWav(slicedAudioBuffer)], { type: 'audio/vnd.wav' }), 'classRecordAcapella.wav');
        const response = await axiosRequest({
          method: 'POST',
          url: '/audios',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const verse = await mixAudios([{ value: data.customizedMix }, { value: response.data.url }], axiosRequest);
        updateActivity({ data: { ...data, verse, slicedRecord: response.data.url } });
      });
    }
    setIsLoading(false);
    save().catch(console.error);
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
        {!data?.customizedMix && (
          <p>
            <b>Il manque votre mix du couplet !</b>
          </p>
        )}
        <div className="width-900">
          {(!trackDuration || !data.classRecord) && (
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
            data.classRecord &&
            (data?.verseTime < trackDuration ? (
              <div style={{ height: '200px' }}>
                <DraggableTrack
                  trackDuration={trackDuration}
                  coupletDuration={data?.verseTime}
                  initialCoupletStart={verseStart}
                  onCoupletStartChange={(coupletStart) => {
                    if (!audioRef.current) {
                      return;
                    }
                    audioRef.current.currentTime = coupletStart;
                    audioRef.current.pause();
                    customizedMixAudio?.pause();
                    setVerseStart(coupletStart);
                  }}
                  onChangeEnd={(coupletStart) => {
                    if (!audioRef.current || !customizedMixAudio) {
                      return;
                    }
                    audioRef.current.currentTime = coupletStart;
                    customizedMixAudio.currentTime = 0;
                    audioRef.current.play();
                    customizedMixAudio.play();
                    updateActivity({ data: { ...data, verseStart: coupletStart } });
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
            {/* {(displayEditor || data?.classRecord) && (
              <AudioEditor
                value={data?.classRecord}
                onChange={(value: string) => {
                  audioRef?.current?.pause();
                  customizedMixAudio?.pause();
                  updateActivity({ data: { ...data, classRecord: value } });
                }}
                setTime={(time) => {
                  setTrackDuration(time);
                }}
                edit
                onPause={() => {
                  audioRef?.current?.pause();
                  customizedMixAudio?.pause();
                }}
                onPlay={() => {
                  audioRef?.current?.play();
                  customizedMixAudio?.play();
                }}
                onDelete={() => {
                  updateActivity({ data: { ...data, classRecord: '' } });
                  setDisplayEditor(false);
                }}
                ref={audioRef}
              />
            )} */}
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
