import { useRouter } from 'next/router';
import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { TrackType } from 'src/activity-types/anthem.types';
import type { VerseRecordData } from 'src/activity-types/verseRecord.types';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import AudioMixer from 'src/components/audio/Mixer';
import { ActivityContext } from 'src/contexts/activityContext';
import { getLongestVerseSampleDuration } from 'src/utils/audios';
import { axiosRequest } from 'src/utils/axiosRequest';

const SongStep1 = () => {
  const router = useRouter();
  const { activity, updateActivity, save } = React.useContext(ActivityContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const data = (activity?.data as VerseRecordData) || null;
  const onNext = async () => {
    save().catch(console.error);
    router.push('/chanter-un-couplet/2');
  };
  const onUpdateAudioMix = async (newAudioMix: Blob) => {
    setIsLoading(true);
    if (newAudioMix.size > 0) {
      const formData = new FormData();
      formData.append('audio', newAudioMix, 'classVerse.webm');
      const response = await axiosRequest({
        method: 'POST',
        url: '/audios',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      //use ffmpeg-audio-mixer package for displaying
      // const customizedMixWithVocals = await mixAudios([data?.verseAudios[0], { value: response.data.url }], axiosRequest);
      // const mixWithoutLyrics = await concatAudios([data.introOutro[0], { value: response.data.url }, data.introOutro[1]], axiosRequest);
      const customizedMixWithVocals = '';
      const mixWithoutLyrics = '';

      updateActivity({ data: { ...data, mixWithoutLyrics, customizedMixWithVocals, customizedMix: response.data.url, customizedMixBlob: null } });
    }
    setIsLoading(false);
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
          steps={['Mixer', 'Écrire', 'Enregistrer', 'Synchroniser', 'Prévisualiser']}
          activeStep={0}
          urls={['/chanter-un-couplet/1', '/chanter-un-couplet/2', '/chanter-un-couplet/3', '/chanter-un-couplet/4', '/chanter-un-couplet/5']}
        />
        <div className="width-900">
          <h1>Mixez votre couplet</h1>
          <p>
            Avant de composer votre couplet et de l&apos;enregistrer, je vous propose de moduler la musique de notre hymne, en jouant avec cette table
            de montage simplifiée.{' '}
          </p>
          <p>
            Lancez l&apos;enregistrement de votre couplet en appuyant sur le bouton bleu &quot;Enregistrer&quot; sous la table de mixage. Une fois
            l&apos;enregistrement lancé, il vous faut enregistrer toute la durée du couplet indiqué par le minuteur.
          </p>
          <p>
            Vous pourrez alors écouter votre mix avant de passer à la prochaine étape d&apos;écriture de votre couplet. Libre à vous de recommencer
            votre mix avant de passer à cette étape suivante !
          </p>
          <AudioMixer
            onUpdateAudioMix={onUpdateAudioMix}
            verseTime={getLongestVerseSampleDuration(data.tracks)}
            verseAudios={data.tracks.filter((track) => track.type !== TrackType.INTRO_CHORUS && track.type !== TrackType.OUTRO)}
            audioSource={data.customizedMix}
          />
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
