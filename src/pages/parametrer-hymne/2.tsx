import { useRouter } from 'next/router';
import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import styles from '../../styles/parametrer-hymne.module.css';
import { postMixAudio } from 'src/api/audio/audio-mix.post';
import { deleteAudio } from 'src/api/audio/audio.delete';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import AnthemTrack from 'src/components/activities/anthem/AnthemTrack/AnthemTrack';
import { InstrumentSvg } from 'src/components/activities/anthem/InstrumentSvg/InstrumentSvg';
import { getErrorSteps } from 'src/components/activities/anthemChecks';
import { ActivityContext } from 'src/contexts/activityContext';
import Vocal from 'src/svg/anthem/vocal.svg';
import { getLongestVerseSampleDuration } from 'src/utils/audios';
import instruments from 'src/utils/instruments';
import { toTime } from 'src/utils/toTime';
import { ActivityStatus } from 'types/activity.type';
import { TrackType } from 'types/anthem.type';
import type { AnthemData, Track } from 'types/anthem.type';

const AnthemStep2 = () => {
  const router = useRouter();

  const { activity, updateActivity, save } = React.useContext(ActivityContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const data = (activity?.data as AnthemData) || null;

  const errorSteps = React.useMemo(() => {
    if (data !== null) {
      return getErrorSteps(data, 1);
    }
    return [];
  }, [data]);

  const buildFullMixUrl = async () => {
    // -- clean previous mix
    if (data.fullMixUrl && activity?.status === ActivityStatus.DRAFT) {
      await deleteAudio(data.fullMixUrl).catch(console.error);
    }

    const verseTracks = data.tracks.filter((t) => t.type !== TrackType.INTRO_CHORUS && t.type !== TrackType.OUTRO && t.sampleUrl !== '');
    const intro = data.tracks.find((t) => t.type === TrackType.INTRO_CHORUS && t.sampleUrl !== '');
    const outro = data.tracks.find((t) => t.type === TrackType.OUTRO && t.sampleUrl !== '');
    const fullTracks = [];
    if (intro && intro.sampleUrl) {
      fullTracks.push(intro);
      fullTracks.push(...verseTracks.map((t) => ({ ...t, sampleStartTime: (t.sampleStartTime || 0) + (intro.sampleDuration || 0) })));
    } else {
      fullTracks.push(...verseTracks);
    }
    if (outro && outro.sampleUrl) {
      fullTracks.push({ ...outro, sampleStartTime: Math.max(...fullTracks.map((t) => (t.sampleStartTime || 0) + (t.sampleDuration || 0))) });
    }
    const fullMixUrl = fullTracks.length > 0 ? await postMixAudio(fullTracks) : '';
    updateActivity({ data: { ...data, fullMixUrl } });
  };

  const onNext = async () => {
    setIsLoading(true);
    // [1] Build the full url
    await buildFullMixUrl();

    // [2] Update the activity
    save().catch(console.error);
    setIsLoading(false);
    router.push('/parametrer-hymne/3');
  };

  const displayableInstruments = React.useMemo(() => {
    return instruments.map((instrument) => {
      return { ...instrument, svg: <InstrumentSvg instrumentName={instrument.value} /> };
    });
  }, []);

  const updateTrackInActivity = (updatedTrack: Track) => {
    const tracks = [...data.tracks].map((track) => (track.type === updatedTrack.type ? updatedTrack : track));
    updateActivity({ data: { ...data, tracks } });
  };

  if (!activity || !data) {
    return (
      <Base>
        <div></div>
      </Base>
    );
  }

  const introChorus = data.tracks.find((t) => t.type === TrackType.INTRO_CHORUS);
  const introChorusDuration = introChorus?.sampleDuration || 0;
  const outro = data.tracks.find((t) => t.type === TrackType.OUTRO);
  const outroDuration = outro?.sampleDuration || 0;

  return (
    <Base>
      <div className={styles.mainContainer}>
        <Steps
          steps={['Mix Couplet', 'Intro Outro', 'Couplet', 'Refrain', 'Prévisualiser']}
          errorSteps={errorSteps}
          activeStep={1}
          urls={['/parametrer-hymne/1?edit', '/parametrer-hymne/2', '/parametrer-hymne/3', '/parametrer-hymne/4', '/parametrer-hymne/5']}
          onBeforeLeavePage={buildFullMixUrl}
        />
        <div className={styles.contentContainer}>
          <h1>Mettre en ligne les pistes sonores de l&apos;hymne</h1>
          <div className={styles.anthemStructureContainer}>
            <p>
              Pour mémoire voici la structure de l&apos;hymne
              {introChorusDuration > 0 && outroDuration > 0 && (
                <b> ({toTime(introChorusDuration + outroDuration + getLongestVerseSampleDuration(data.tracks))})</b>
              )}
              :
            </p>
            <div className={styles.anthemStructureVocalContainer}>
              <span>Intro : {<b>{toTime(introChorusDuration)}</b>}</span>
              <span>Couplet : {<b>{toTime(getLongestVerseSampleDuration(data.tracks))}</b>}</span>
              <span>Outro : {<b>{toTime(outroDuration)}</b>}</span>
            </div>
            <Vocal className={styles.anthemStructureVocal} />
          </div>

          <div className={styles.trackSelectionContainer}>
            <p className={styles.trackSelectionTitle}>Mettre en ligne le fichier son de (intro + refrain chanté)</p>
            <AnthemTrack
              track={
                introChorus || {
                  type: TrackType.INTRO_CHORUS,
                  label: 'Piste intro + refrain chanté',
                  sampleUrl: '',
                  sampleDuration: 0,
                  iconUrl: 'accordion',
                  sampleStartTime: 0,
                  sampleVolume: 0.5,
                }
              }
              handleTrackUpdate={updateTrackInActivity}
              instruments={displayableInstruments}
            ></AnthemTrack>
            <p className={styles.trackSelectionTitle}>Mettre en ligne le fichier son de l&apos;outro</p>
            <AnthemTrack
              track={
                outro || {
                  type: TrackType.OUTRO,
                  label: 'Piste outro',
                  sampleUrl: '',
                  sampleDuration: 0,
                  iconUrl: 'accordion',
                  sampleStartTime: 0,
                  sampleVolume: 0.5,
                }
              }
              handleTrackUpdate={updateTrackInActivity}
              instruments={displayableInstruments}
            ></AnthemTrack>
          </div>
        </div>
      </div>
      <StepsButton prev="/parametrer-hymne/1?edit" next={onNext} />
      <Backdrop className={styles.trackSelectionBackdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default AnthemStep2;
