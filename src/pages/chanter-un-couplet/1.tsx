import { useRouter } from 'next/router';
import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import styles from '../../styles/chanter-un-couplet.module.css';
import { postMixAudio } from 'src/api/audio/audio-mix.post';
import { deleteAudio } from 'src/api/audio/audio.delete';
import { Base } from 'src/components/Base';
import { PageLayout } from 'src/components/PageLayout';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import type { AudioMixerTrack } from 'src/components/audio/AudioMixer/AudioMixer';
import AudioMixer from 'src/components/audio/AudioMixer/AudioMixer';
import { ActivityContext } from 'src/contexts/activityContext';
import { getLongestVerseSampleDuration, getVerseTracks } from 'src/utils/audios';
import { ActivityStatus } from 'types/activity.type';
import { TrackType } from 'types/anthem.type';
import type { ClassAnthemData } from 'types/classAnthem.types';

const SongStep1 = () => {
  const router = useRouter();
  const { activity, updateActivity, save } = React.useContext(ActivityContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const data = (activity?.data as ClassAnthemData) || null;

  const mixerRef = React.useRef<{ stopMixer: () => void }>();

  const verseTracks = data ? getVerseTracks(data.anthemTracks) : [];

  // Use a state variable to store the current verse tracks URLs in a changing array to trigger a re-render
  const [verseTracksUrls, setVerseTracksUrls] = React.useState(verseTracks.map((track) => track.sampleUrl));
  const verseTracksVolumeRef = React.useRef(verseTracks.map((track) => track.sampleVolume));
  if (verseTracksUrls.join(', ') !== verseTracks.map((track) => track.sampleUrl).join(', ')) {
    setVerseTracksUrls(verseTracks.map((track) => track.sampleUrl));
    verseTracksVolumeRef.current = verseTracks.map((track) => track.sampleVolume);
  }
  const audioElements: HTMLAudioElement[] = React.useMemo(() => {
    return verseTracksUrls.map((sampleUrl, idx) => {
      const audioElement = new Audio(sampleUrl);
      audioElement.volume = (verseTracksVolumeRef.current[idx] ?? 1) / 2;
      return audioElement;
    });
  }, [verseTracksUrls]);
  const audioMixerTracks: AudioMixerTrack[] = verseTracks.map((track, idx) => {
    return {
      sampleVolume: track.sampleVolume ?? 1,
      label: track.label,
      iconUrl: track.iconUrl,
      audioElement: audioElements[idx],
    };
  });

  const buildVerseUrl = async () => {
    // -- clean previous mix if draft
    if (activity?.status === ActivityStatus.DRAFT) {
      if (data.verseMixUrl) {
        await deleteAudio(data.verseMixUrl).catch(console.error);
      }
      if (data.verseMixWithVocalsUrl) {
        await deleteAudio(data.verseMixWithVocalsUrl).catch(console.error);
      }
      if (data.verseMixWithIntroUrl) {
        await deleteAudio(data.verseMixWithIntroUrl).catch(console.error);
      }
      if (data.verseFinalMixUrl) {
        await deleteAudio(data.verseFinalMixUrl).catch(console.error);
      }
    }

    const tracks = data.anthemTracks.filter((t) => t.sampleUrl !== '');

    // [1] Mix the verse
    const verseTracks = tracks.filter((t) => t.type !== TrackType.VOCALS && t.type !== TrackType.INTRO_CHORUS && t.type !== TrackType.OUTRO);
    const verseMixUrl = verseTracks.length > 0 ? await postMixAudio(verseTracks) : '';

    // [2] Mix the verse with vocals
    const vocals = tracks.find((t) => t.type === TrackType.VOCALS);
    let verseMixWithVocalsUrl: string;
    if (vocals) {
      const verseWithVocalsTracks = [vocals, ...verseTracks];
      verseMixWithVocalsUrl = await postMixAudio(verseWithVocalsTracks);
    } else {
      verseMixWithVocalsUrl = verseMixUrl;
    }

    // [3] Mix the verse with intro
    const intro = tracks.find((t) => t.type === TrackType.INTRO_CHORUS);
    let verseMixWithIntroUrl: string;
    if (intro) {
      const verseWithIntroTracks = [
        intro,
        ...verseTracks.map((t) => ({
          ...t,
          sampleStartTime: intro.sampleDuration,
        })),
      ];
      verseMixWithIntroUrl = await postMixAudio(verseWithIntroTracks);
    } else {
      verseMixWithIntroUrl = verseMixUrl;
    }

    // [4] Mix the final verse if the class already recorded it
    let verseFinalMixUrl;
    if (data.classRecordTrack.sampleUrl) {
      verseFinalMixUrl = await postMixAudio([...verseTracks, data.classRecordTrack]);
    } else {
      verseFinalMixUrl = '';
    }

    updateActivity({ data: { ...data, verseMixUrl, verseMixWithVocalsUrl, verseMixWithIntroUrl, verseFinalMixUrl } });
  };

  const onNext = async () => {
    if (mixerRef.current) mixerRef.current.stopMixer();
    setIsLoading(true);
    await buildVerseUrl();
    save().catch(console.error);
    setIsLoading(false);
    router.push('/chanter-un-couplet/2');
  };

  const handleMixUpdate = (volumes: number[]) => {
    const newVerseTracks = [...verseTracks];
    newVerseTracks.forEach((track, idx) => {
      track.sampleVolume = volumes[idx];
    });

    const newTracks = data.anthemTracks.map((track) => {
      const newTrack = newVerseTracks.find((t) => t.type === track.type);
      return newTrack || track;
    });

    updateActivity({ data: { ...data, anthemTracks: newTracks } });
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
      <PageLayout>
        <Steps
          steps={['Mixer', 'Écrire', 'Enregistrer', 'Synchroniser', 'Prévisualiser']}
          activeStep={0}
          urls={['/chanter-un-couplet/1', '/chanter-un-couplet/2', '/chanter-un-couplet/3', '/chanter-un-couplet/4', '/chanter-un-couplet/5']}
          onBeforeLeavePage={buildVerseUrl}
        />
        <div className={styles.contentContainer}>
          <h1>Mixez votre couplet</h1>
          <p>
            Avant de composer votre couplet et de l&apos;enregistrer, je vous propose de moduler la musique de notre hymne, en jouant avec cette table
            de montage simplifiée.
          </p>
          <p>
            Placez les curseurs là où vous le souhaitez, puis écoutez votre mix avant de passer à la prochaine étape d&apos;écriture de votre couplet.
            Libre à vous de recommencer votre mix avant de passer à cette étape suivante !
          </p>
          {audioMixerTracks.length > 0 && (
            <AudioMixer
              ref={mixerRef}
              tracks={audioMixerTracks}
              verseTime={getLongestVerseSampleDuration(verseTracks)}
              handleMixUpdate={handleMixUpdate}
            />
          )}
        </div>
      </PageLayout>
      <StepsButton next={onNext} />
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default SongStep1;
