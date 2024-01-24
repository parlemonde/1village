import { useRouter } from 'next/router';
import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { red } from '@mui/material/colors';

import styles from './parametrer-hymne.module.css';
import type { AnthemData, Track } from 'src/activity-types/anthem.types';
import { TrackType } from 'src/activity-types/anthem.types';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import AnthemTrack from 'src/components/activities/anthem/AnthemTrack/AnthemTrack';
import { ActivityContext } from 'src/contexts/activityContext';
import Vocal from 'src/svg/anthem/vocal.svg';
import { concatAudios } from 'src/utils/audios';
import { axiosRequest } from 'src/utils/axiosRequest';
import { toTime } from 'src/utils/toTime';

const AnthemStep2 = () => {
  const router = useRouter();

  const { activity, updateActivity, save } = React.useContext(ActivityContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const data = (activity?.data as AnthemData) || null;
  // compare error steps with master and try to understand logic
  const errorSteps = React.useMemo(() => {
    if (data && data.tracks.length !== 9) {
      return [0];
    }
    return [];
  }, [data]);

  const onNext = async () => {
    setIsLoading(true);
    if (data.tracks.filter((c) => !!c.sampleUrl).length === 2 && errorSteps.length === 0) {
      // const value = await concatAudios([data.tracks[0], { value: data.finalVerse }, data.tracks[8]], axiosRequest);
      // updateActivity({ data: { ...data, finalMix: value } });
    }
    save().catch(console.error);
    setIsLoading(false);
    router.push('/parametrer-hymne/3');
  };

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
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={['Mix Couplet', 'Intro Outro', 'Couplet', 'Refrain', 'Prévisualiser']}
          errorSteps={errorSteps}
          activeStep={1}
          urls={['/parametrer-hymne/1?edit', '/parametrer-hymne/2', '/parametrer-hymne/3', '/parametrer-hymne/4', '/parametrer-hymne/5']}
        />
        <div className={styles.trackSelectionContainer}>
          <h1>Mettre en ligne les pistes sonores de l&apos;hymne</h1>
          <div style={{ height: '100%', width: '100%', objectFit: 'contain' }}>
            <p>
              Pour mémoire voici la structure de l&apos;hymne
              {data.tracks[TrackType.INTRO_CHORUS].sampleDuration > 0 && data.tracks[TrackType.OUTRO].sampleDuration > 0 && (
                <b>
                  {' '}
                  (
                  {toTime(
                    data.tracks[TrackType.INTRO_CHORUS].sampleDuration +
                      data.tracks[TrackType.OUTRO].sampleDuration +
                      data.tracks[TrackType.VOCALS].sampleDuration,
                  )}
                  )
                </b>
              )}
              :
            </p>
            <div className={styles.trackVocalContainer}>
              <span>
                Intro :{' '}
                {data.tracks[TrackType.INTRO_CHORUS].sampleDuration > 0 && <b>({toTime(data.tracks[TrackType.INTRO_CHORUS].sampleDuration)})</b>}
              </span>
              <span>
                Couplet : {data.tracks[TrackType.VOCALS].sampleDuration > 0 && <b>({toTime(data.tracks[TrackType.VOCALS].sampleDuration)})</b>}{' '}
              </span>
              <span>Outro : {data.tracks[TrackType.OUTRO].sampleDuration > 0 && <b>({toTime(data.tracks[TrackType.OUTRO].sampleDuration)})</b>}</span>
            </div>
            <Vocal className={styles.trackVocal} />
          </div>
          {data.tracks.filter((track) => track.type === TrackType.INTRO_CHORUS || track.type === TrackType.OUTRO).length === 2 && (
            <div className={styles.trackSelectionContainer}>
              <p className={styles.trackSelectionTitle}>Mettre en ligne le fichier son de (intro + refrain chanté)</p>
              <AnthemTrack track={data.tracks[TrackType.INTRO_CHORUS]} handleTrackUpdate={updateTrackInActivity}></AnthemTrack>
              <p className={styles.trackSelectionTitle}>Mettre en ligne le fichier son de l&apos;outro</p>
              <AnthemTrack track={data.tracks[TrackType.OUTRO]} handleTrackUpdate={updateTrackInActivity}></AnthemTrack>
            </div>
          )}
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
