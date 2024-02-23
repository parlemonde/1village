import { useRouter } from 'next/router';
import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import type { ClassAnthemData } from 'src/activity-types/verseRecord.types';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import AudioMixer from 'src/components/audio/AudioMixer';
import { ActivityContext } from 'src/contexts/activityContext';

const SongStep1 = () => {
  const router = useRouter();
  const { activity, updateActivity, save } = React.useContext(ActivityContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const data = (activity?.data as ClassAnthemData) || null;

  const volumes = React.useRef<number[]>([]);

  React.useEffect(() => {
    if (volumes.current.length === 0) {
      volumes.current = data.verseTracks.slice(1).map((track) => track.sampleVolume || 0.5);
    }
  }, [data]);

  const onNext = async () => {
    setIsLoading(true);

    const mixedVerseTracks = data.verseTracks.map((track, idx) => {
      return { ...track, sampleVolume: volumes[idx] };
    });

    updateActivity({ data: { ...data, verseTracks: mixedVerseTracks } });
    save().catch(console.error);
    setIsLoading(false);
    router.push('/chanter-un-couplet/2');
  };

  const handleMixVolumesUpdate = (idx: number, volume: number) => {
    const tempVolumes = volumes.current;
    tempVolumes[idx] = volume;
    volumes.current = tempVolumes;
    console.log(volumes.current);
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
          <AudioMixer tracks={data.verseTracks.slice(1)} handleMixVolumesUpdate={handleMixVolumesUpdate} audioSource={data.verseMixUrl} />
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
