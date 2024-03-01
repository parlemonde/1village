import { useRouter } from 'next/router';
import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import styles from './parametrer-hymne.module.css';
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

  const onNext = async () => {
    setIsLoading(true);
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

  return (
    <Base>
      <div className={styles.mainContainer}>
        <Steps
          steps={['Mix Couplet', 'Intro Outro', 'Couplet', 'Refrain', 'Prévisualiser']}
          errorSteps={errorSteps}
          activeStep={1}
          urls={['/parametrer-hymne/1?edit', '/parametrer-hymne/2', '/parametrer-hymne/3', '/parametrer-hymne/4', '/parametrer-hymne/5']}
        />
        <div className={styles.contentContainer}>
          <h1>Mettre en ligne les pistes sonores de l&apos;hymne</h1>
          <div className={styles.anthemStructureContainer}>
            <p>
              Pour mémoire voici la structure de l&apos;hymne
              {data.tracks[TrackType.INTRO_CHORUS].sampleDuration > 0 && data.tracks[TrackType.OUTRO].sampleDuration > 0 && (
                <b>
                  {' '}
                  (
                  {toTime(
                    data.tracks[TrackType.INTRO_CHORUS].sampleDuration +
                      data.tracks[TrackType.OUTRO].sampleDuration +
                      getLongestVerseSampleDuration(data.tracks),
                  )}
                  )
                </b>
              )}
              :
            </p>
            <div className={styles.anthemStructureVocalContainer}>
              <span>Intro : {<b>{toTime(data.tracks[TrackType.INTRO_CHORUS].sampleDuration)}</b>}</span>
              <span>Couplet : {<b>{toTime(getLongestVerseSampleDuration(data.tracks))}</b>}</span>
              <span>Outro : {<b>{toTime(data.tracks[TrackType.OUTRO].sampleDuration)}</b>}</span>
            </div>
            <Vocal className={styles.anthemStructureVocal} />
          </div>
          {data.tracks.filter((track) => track.type === TrackType.INTRO_CHORUS || track.type === TrackType.OUTRO).length === 2 && (
            <div className={styles.trackSelectionContainer}>
              <p className={styles.trackSelectionTitle}>Mettre en ligne le fichier son de (intro + refrain chanté)</p>
              <AnthemTrack
                track={data.tracks[TrackType.INTRO_CHORUS]}
                handleTrackUpdate={updateTrackInActivity}
                instruments={displayableInstruments}
              ></AnthemTrack>
              <p className={styles.trackSelectionTitle}>Mettre en ligne le fichier son de l&apos;outro</p>
              <AnthemTrack
                track={data.tracks[TrackType.OUTRO]}
                handleTrackUpdate={updateTrackInActivity}
                instruments={displayableInstruments}
              ></AnthemTrack>
            </div>
          )}
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
