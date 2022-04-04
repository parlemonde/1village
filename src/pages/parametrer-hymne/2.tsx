import { useRouter } from 'next/router';
import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import type { AnthemData, Sample } from 'src/activity-types/anthem.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { AnthemEditor } from 'src/components/activities/content/editors/AnthemEditor';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import TrackIcon from 'src/svg/anthem/track.svg';
import SoundIcon from 'src/svg/editor/sound_icon.svg';
import { concatAudios } from 'src/utils/audios';

const AnthemStep2 = () => {
  const router = useRouter();
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const { activity, updateActivity, deleteContent } = React.useContext(ActivityContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const data = (activity?.data as AnthemData) || null;
  const errorSteps = React.useMemo(() => {
    if (data && data.verseAudios.filter((c) => !!c.value).length !== 7) {
      return [0];
    }
    return [];
  }, [activity]);

  const updateContent = (content: Sample[]): void => {
    if (!activity) {
      return;
    }
    updateActivity({ data: { ...data, introOutro: content } });
  };

  const onChangeContent = (index: number) => (newValue: string) => {
    data.introOutro[index].value = newValue;
    updateContent(data.introOutro);
  };

  const onNext = async () => {
    setIsLoading(true);
    if (data.introOutro.filter((c) => !!c.value).length === 2 && errorSteps.length === 0) {
      const value = await concatAudios([data.introOutro[0], { value: data.finalVerse }, data.introOutro[1]], axiosLoggedRequest);
      updateActivity({ data: { ...data, finalMix: value } });
    }
    setIsLoading(false);
    router.push('/parametrer-hymne/3');
  };

  const onClose = (idx: number) => {
    data.introOutro[idx].display = false;
    updateActivity({ data: { ...data } });
  };

  if (!activity) {
    return (
      <Base>
        <div></div>
      </Base>
    );
  }
  const toTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    let seconds: string | number = Math.trunc(time - minutes * 60);

    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    return minutes + ':' + seconds;
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps steps={['Mix Couplet', 'Intro Outro', 'Couplet', 'Refrain', 'Prévisualiser']} errorSteps={errorSteps} activeStep={1} />
        <div className="width-900">
          <h1>Mettre en ligne les pistes sonores de l&apos;hymne</h1>
          <div style={{ height: '100%', width: '100%', objectFit: 'contain' }}>
            <p>
              Pour mémoire voici la structure de l&apos;hymne{' '}
              {data.introOutro[0].time && data.introOutro[1].time && data.verseTime && (
                <b>({toTime(data.introOutro[0].time + data.introOutro[1].time + data.verseTime)})</b>
              )}
              :
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <span>Intro : {data.introOutro[0].time && <b>({toTime(data.introOutro[0].time)})</b>}</span>
              <span>Couplet : {data.verseTime && <b>({toTime(data.verseTime)})</b>} </span>
              <span>Outro : {data.introOutro[1].time && <b>({toTime(data.introOutro[1].time)})</b>}</span>
            </div>
            <img src="/static-images/vocal.png" style={{ height: '100%', width: '100%', objectFit: 'contain' }} />
          </div>
          <p style={{ margin: '25px 0 25px' }}>Mettre en ligne le fichier son de (intro + refrain chanté)</p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {data?.introOutro.map((audio, idx) => (
              <>
                {idx === 1 && <div style={{ margin: '25px 0 25px' }}>Mettre en ligne le fichier son de l&apos;outro</div>}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <TrackIcon />
                  <div style={{ width: '250px', marginLeft: '10px' }}>{audio.label} : </div>
                  <div>
                    {data?.introOutro[idx].display && (
                      <AnthemEditor
                        key={`anthem-editChorus--${idx}`}
                        value={audio.value}
                        onChange={onChangeContent(idx)}
                        onDelete={() => {
                          deleteContent(idx);
                        }}
                        setTime={(time) => {
                          data.introOutro[idx].time = time;
                          updateActivity({ data: { ...data } });
                        }}
                        onClose={onClose}
                        idx={idx}
                      />
                    )}
                    {!audio.value && (
                      <Button
                        onClick={() => {
                          data.introOutro[idx].display = true;
                          updateActivity({ data: { ...data } });
                        }}
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
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
      <StepsButton prev="/parametrer-hymne/1" next={onNext} />
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default AnthemStep2;
