import { useRouter } from 'next/router';
import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import type { VerseRecordData } from 'src/activity-types/verseRecord.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import AudioMixer from 'src/components/audio/Mixer';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { concatAudios } from 'src/utils/audios';

const SongStep1 = () => {
  const router = useRouter();
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const { activity, updateActivity } = React.useContext(ActivityContext);
  const [isLoading, setIsLoading] = React.useState(false);

  const data = (activity?.data as VerseRecordData) || null;
  data?.verseAudios.length === 7 && data?.verseAudios?.shift();

  const onNext = async () => {
    setIsLoading(true);
    if (data.customizedMixBlob) {
      const formData = new FormData();
      formData.append('audio', data.customizedMixBlob, 'classVerse.webm');
      const response = await axiosLoggedRequest({
        method: 'POST',
        url: '/audios',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const value = await concatAudios([data.introOutro[0], { value: response.data.url }, data.introOutro[1]], axiosLoggedRequest);
      updateActivity({ data: { ...data, mixWithoutLyrics: value, customizedMix: response.data.url } });
    }
    setIsLoading(false);
    router.push('/chanter-un-couplet/2');
  };

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
        <Steps steps={['Mixer', 'Écrire', 'Enregistrer', 'Synchroniser', 'Prévisualiser']} activeStep={0} />
        <div className="width-900">
          <h1>Mixez votre couplet</h1>
          <p>
            Avant de composer votre couplet et de l&apos;enregistrer, je vous propose de moduler la musique de notre hymne, en jouant avec cette table
            de montage simplifiée.{' '}
          </p>
          {data && <AudioMixer data={data?.verseAudios?.map((audio) => ({ value: audio.value, volume: 0.5 }))} time={data?.verseTime} />}
        </div>
      </div>
      <StepsButton next={onNext} />
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default SongStep1;
