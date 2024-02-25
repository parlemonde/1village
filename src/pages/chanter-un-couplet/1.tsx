import { useRouter } from 'next/router';
import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import type { Track } from 'src/activity-types/anthem.types';
import type { ClassAnthemData } from 'src/activity-types/verseRecord.types';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import type { AudioMixerTrack } from 'src/components/audio/AudioMixer';
import AudioMixer from 'src/components/audio/AudioMixer';
import { ActivityContext } from 'src/contexts/activityContext';
import { getLongestVerseSampleDuration } from 'src/utils/audios';

const SongStep1 = () => {
  const router = useRouter();
  const { activity, updateActivity, save } = React.useContext(ActivityContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const data = (activity?.data as ClassAnthemData) || null;

  const mixerRef = React.useRef();

  const audioMixerTracks: AudioMixerTrack[] = React.useMemo(() => {
    return data.verseTracks.slice(1).map((track) => {
      const audioElement = new Audio(track.sampleUrl);
      audioElement.volume = track.sampleVolume || 0;
      return {
        sampleVolume: track.sampleVolume || 0,
        label: track.label,
        iconUrl: track.iconUrl,
        audioElement: audioElement,
      };
    });
  }, []);

  const onNext = async () => {
    if (mixerRef.current) mixerRef.current.stopMixer();
    setIsLoading(true);
    save().catch(console.error);
    setIsLoading(false);
    router.push('/chanter-un-couplet/2');
  };

  const handleMixUpdate = async (volumes: number[]) => {
    setIsLoading(true);
    const tempMixedTrack: Track[] = data.verseTracks.slice(1).map((track, idx) => ({ ...track, sampleVolume: volumes[idx] }));
    tempMixedTrack.unshift(data.verseTracks[0]);
    updateActivity({ data: { ...data, verseTracks: tempMixedTrack } });
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
            ref={mixerRef}
            tracks={audioMixerTracks}
            verseTime={getLongestVerseSampleDuration(data.verseTracks)}
            handleMixUpdate={handleMixUpdate}
            audioSource={data.verseMixUrl}
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
