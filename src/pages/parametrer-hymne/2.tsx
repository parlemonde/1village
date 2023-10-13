import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/router';
import React from 'react';

import type { AnthemData } from 'src/activity-types/anthem.types';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { AnthemEditor } from 'src/components/activities/content/editors/AnthemEditor';
import { ActivityContext } from 'src/contexts/activityContext';
import TrackIcon from 'src/svg/anthem/track.svg';
import Vocal from 'src/svg/anthem/vocal.svg';
import SoundIcon from 'src/svg/editor/sound_icon.svg';
import { concatAudios } from 'src/utils/audios';
import { axiosRequest } from 'src/utils/axiosRequest';
import { toTime } from 'src/utils/toTime';

const AnthemStep2 = () => {
  const router = useRouter();

  const { activity, updateActivity, save } = React.useContext(ActivityContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const data = (activity?.data as AnthemData) || null;
  const errorSteps = React.useMemo(() => {
    if (data && data.verseAudios.filter((c) => !!c.value).length !== 7) {
      return [0];
    }
    return [];
  }, [data]);

  const onUpdateIntroOutro = (index: number) => (newValue: string) => {
    const introOutro = [...data.introOutro];
    introOutro[index] = { ...introOutro[index], value: newValue, display: newValue === '' ? false : introOutro[index].display };
    updateActivity({ data: { ...data, introOutro } });
  };

  const onNext = async () => {
    setIsLoading(true);
    if (data.introOutro.filter((c) => !!c.value).length === 2 && errorSteps.length === 0) {
      const value = await concatAudios([data.introOutro[0], { value: data.finalVerse }, data.introOutro[1]], axiosRequest);
      updateActivity({ data: { ...data, finalMix: value } });
    }
    save().catch(console.error);
    setIsLoading(false);
    router.push('/parametrer-hymne/3');
  };

  if (!activity || !data) {
    return (
      <Base>
        <div></div>
      </Base>
    );
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={['Mix Couplet', 'Intro Outro', 'Couplet', 'Refrain', 'Prévisualiser']}
          errorSteps={errorSteps}
          activeStep={1}
          urls={['/parametrer-hymne/1?edit', '/parametrer-hymne/2', '/parametrer-hymne/3', '/parametrer-hymne/4', '/parametrer-hymne/5']}
        />
        <div className="width-900">
          <h1>Mettre en ligne les pistes sonores de l&apos;hymne</h1>
          <div style={{ height: '100%', width: '100%', objectFit: 'contain' }}>
            <p>
              Pour mémoire voici la structure de l&apos;hymne{' '}
              {data.introOutro[0].time > 0 && data.introOutro[1].time > 0 && data.verseTime > 0 && (
                <b>({toTime(data.introOutro[0].time + data.introOutro[1].time + data.verseTime)})</b>
              )}
              :
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <span>Intro : {data.introOutro[0].time > 0 && <b>({toTime(data.introOutro[0].time)})</b>}</span>
              <span>Couplet : {data.verseTime > 0 && <b>({toTime(data.verseTime)})</b>} </span>
              <span>Outro : {data.introOutro[1].time > 0 && <b>({toTime(data.introOutro[1].time)})</b>}</span>
            </div>
            <Vocal style={{ height: 'auto', width: '100%' }} />
          </div>
          <p style={{ margin: '25px 0 25px' }}>Mettre en ligne le fichier son de (intro + refrain chanté)</p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {data.introOutro.map((audio, idx) => (
              <React.Fragment key={idx}>
                {idx === 1 && <div style={{ margin: '25px 0 25px' }}>Mettre en ligne le fichier son de l&apos;outro</div>}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <TrackIcon />
                  <div style={{ width: '250px', marginLeft: '10px' }}>{audio.label} : </div>
                  <div>
                    {data.introOutro[idx].display && (
                      <AnthemEditor
                        key={`anthem-editChorus--${idx}`}
                        value={audio.value}
                        onChange={onUpdateIntroOutro(idx)}
                        onDelete={() => {
                          onUpdateIntroOutro(idx)('');
                        }}
                        setTime={(time) => {
                          data.introOutro[idx].time = time;
                          updateActivity({ data: { ...data } });
                        }}
                        idx={idx}
                        edit
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
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      <StepsButton prev="/parametrer-hymne/1?edit" next={onNext} />
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default AnthemStep2;
