import { useRouter } from 'next/router';
import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import { DEFAULT_ANTHEM_DATA } from 'src/activity-types/anthem.constants';
import type { AnthemData, Sample } from 'src/activity-types/anthem.types';
import { isAnthem } from 'src/activity-types/anyActivity';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { AnthemEditor } from 'src/components/activities/content/editors/AnthemEditor';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import DrumIcon from 'src/svg/anthem/drum.svg';
import DrumkitIcon from 'src/svg/anthem/drumkit.svg';
import FluteIcon from 'src/svg/anthem/flute.svg';
import GuitareIcon from 'src/svg/anthem/guitare.svg';
import MicroIcon from 'src/svg/anthem/micro.svg';
import PianoIcon from 'src/svg/anthem/piano.svg';
import TrumpetIcon from 'src/svg/anthem/trumpet.svg';
import SoundIcon from 'src/svg/editor/sound_icon.svg';
import { mixAudios } from 'src/utils/audios';
import { ActivityType } from 'types/activity.type';

const AnthemStep1 = () => {
  const router = useRouter();
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const { activity, createNewActivity, updateActivity, deleteContent } = React.useContext(ActivityContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const data = (activity?.data as AnthemData) || null;
  const musicIcons = [MicroIcon, PianoIcon, GuitareIcon, TrumpetIcon, FluteIcon, DrumIcon, DrumkitIcon];
  const updateContent = (verseLyrics: Sample[]): void => {
    if (!activity) {
      return;
    }
    updateActivity({ data: { ...data, verseAudios: verseLyrics } });
  };

  const onChangeContent = (index: number) => (newValue: string) => {
    data.verseAudios[index].value = newValue;
    updateContent(data.verseAudios);
  };

  const onNext = async () => {
    setIsLoading(true);
    if (activity !== null && data.verseAudios.filter((c) => !!c.value).length === 7) {
      const value = await mixAudios(data.verseAudios, axiosLoggedRequest);
      updateActivity({ data: { ...data, finalVerse: value } });
    }
    setIsLoading(false);
    router.push('/parametrer-hymne/2');
  };

  const created = React.useRef(false);

  React.useEffect(() => {
    if (!created.current) {
      if (!activity && !('activity-id' in router.query) && localStorage.getItem('activity') === null && !('edit' in router.query)) {
        created.current = true;
        createNewActivity(ActivityType.ANTHEM, undefined, DEFAULT_ANTHEM_DATA);
      } else if (activity && !isAnthem(activity)) {
        created.current = true;
        createNewActivity(ActivityType.ANTHEM, undefined, DEFAULT_ANTHEM_DATA);
      }
    }
  }, [activity, createNewActivity, router]);

  if (!activity) {
    return (
      <Base>
        <div></div>
      </Base>
    );
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps steps={['Mix Couplet', 'Intro Outro', 'Couplet', 'Refrain', 'Prévisualiser']} activeStep={0} />
        <div className="width-900">
          <h1>Mettre en ligne les pistes sonores du couplet</h1>
          <p> Commencez le paramétrage en mettant en ligne les différentes pistes sonores du couplet : </p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ margin: '25px 0 25px' }}>La piste vocal du couplet, La La.</p>
            {data &&
              data?.verseAudios?.map((audio, idx) => (
                <>
                  {idx === 1 && <div style={{ margin: '25px 0 25px' }}>Les différentes pistes sonores du couplet (utiles au mixage)</div>}
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    {React.createElement(musicIcons[idx], { key: `descimg--${idx}` })}
                    <div style={{ width: '200px', marginLeft: '10px' }}>{audio.label} : </div>
                    <div>
                      {data.verseAudios[idx].display && (
                        <AnthemEditor
                          key={`anthem-edit--${idx}`}
                          value={audio.value}
                          onChange={onChangeContent(idx)}
                          onDelete={() => {
                            deleteContent(idx);
                          }}
                          setTime={(time) => {
                            data.verseTime = time;
                            updateActivity({ data: { ...data } });
                          }}
                          idx={idx}
                          edit
                        />
                      )}
                      {!audio.value && (
                        <Button
                          onClick={() => {
                            data.verseAudios[idx].display = true;
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
      <StepsButton next={onNext} />
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default AnthemStep1;
