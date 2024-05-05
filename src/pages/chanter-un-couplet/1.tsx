import { useRouter } from 'next/router';
import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import styles from '../../styles/chanter-un-couplet.module.css';
import { postMixAudio } from 'src/api/audio/audio-mix.post';
import { deleteAudio } from 'src/api/audio/audio.delete';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import type { AudioMixerTrack } from 'src/components/audio/AudioMixer/AudioMixer';
import AudioMixer from 'src/components/audio/AudioMixer/AudioMixer';
import { ActivityContext } from 'src/contexts/activityContext';
import { getLongestVerseSampleDuration, getVerseTracks } from 'src/utils/audios';
import { ActivityStatus } from 'types/activity.type';
import { TrackType } from 'types/anthem.type';
import type { Track } from 'types/anthem.type';
import type { ClassAnthemData } from 'types/classAnthem.types';

const SongStep1 = () => {
  const router = useRouter();
  const { activity, updateActivity, save } = React.useContext(ActivityContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isTracks, setIsTracks] = React.useState(false);
  const data = (activity?.data as ClassAnthemData) || null;

  const mixerRef = React.useRef<{ stopMixer: () => void }>();

  React.useEffect(() => {
    if (data && data.anthemTracks.length > 0) {
      setIsTracks(true);
    }
  }, [data]);

  const audioMixerTracks: AudioMixerTrack[] = React.useMemo(() => {
    return isTracks
      ? getVerseTracks(data.anthemTracks).map((track) => {
          const audioElement = new Audio(track.sampleUrl);
          audioElement.volume = track.sampleVolume ?? 0.5;
          return {
            sampleVolume: track.sampleVolume ?? 0.5,
            label: track.label,
            iconUrl: track.iconUrl,
            audioElement: audioElement,
          };
        })
      : [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTracks]);

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
    const tempMixedTrack: Track[] = getVerseTracks(data.anthemTracks).map((track, idx) => ({ ...track, sampleVolume: volumes[idx] }));
    tempMixedTrack.unshift(data.anthemTracks[TrackType.VOCALS]);
    tempMixedTrack.unshift(data.anthemTracks[TrackType.INTRO_CHORUS]);
    tempMixedTrack.push(data.anthemTracks[TrackType.OUTRO]);
    updateActivity({ data: { ...data, anthemTracks: tempMixedTrack } });
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
      <div className={styles.mainContainer}>
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
              verseTime={getLongestVerseSampleDuration(getVerseTracks(data.anthemTracks))}
              handleMixUpdate={handleMixUpdate}
            />
          )}
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
