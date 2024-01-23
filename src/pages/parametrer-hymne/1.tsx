import { useRouter } from 'next/router';
import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import styles from './parametrer-hymne.module.css';
import { DEFAULT_ANTHEM_DATA } from 'src/activity-types/anthem.constants';
import type { AnthemData, Track } from 'src/activity-types/anthem.types';
import { TrackType } from 'src/activity-types/anthem.types';
import { isAnthem } from 'src/activity-types/anyActivity';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import AnthemTrack from 'src/components/activities/anthem/AnthemTrack/AnthemTrack';
import { ActivityContext } from 'src/contexts/activityContext';
import { VillageContext } from 'src/contexts/villageContext';
import { ActivityType } from 'types/activity.type';

const AnthemStep1 = () => {
  const router = useRouter();

  const { activity, createActivityIfNotExist, updateActivity, save } = React.useContext(ActivityContext);
  const { selectedPhase } = React.useContext(VillageContext);

  const [isLoading, setIsLoading] = React.useState(false);
  const [isEqualDurationTracks, setIsEqualDurationTracks] = React.useState(false);

  const data = (activity?.data as AnthemData) || null;
  const [tempTracks, setTempTracks] = React.useState<Track[]>([]);

  const created = React.useRef(false);

  React.useEffect(() => {
    if (!created.current) {
      if (!('activity-id' in router.query) && !('edit' in router.query)) {
        created.current = true;
        createActivityIfNotExist(ActivityType.ANTHEM, selectedPhase, undefined, DEFAULT_ANTHEM_DATA, true);
      } else if (activity && !isAnthem(activity)) {
        created.current = true;
        createActivityIfNotExist(ActivityType.ANTHEM, selectedPhase, undefined, DEFAULT_ANTHEM_DATA, true);
      }
    }
  }, [activity, createActivityIfNotExist, router, selectedPhase]);

  React.useEffect(() => {
    if (data && tempTracks.length === 0) {
      setTempTracks(data.tracks.filter((track) => track.type !== TrackType.INTRO_CHORUS && track.type !== TrackType.OUTRO));
      setIsEqualDurationTracks(true);
    } else if (tempTracks.length > 1) {
      const filteredTracksDuration = tempTracks.map((track) => track.sampleDuration).filter((duration) => duration > 1);
      setIsEqualDurationTracks(() => filteredTracksDuration.every((duration) => duration === filteredTracksDuration[0]));
    }
  }, [data, tempTracks]);

  const handleTrackUpdate = (updatedTrack: Track) => {
    const tracks = [...data.tracks].map((track) => (track.type === updatedTrack.type ? updatedTrack : track));
    setTempTracks(tracks);
  };

  const updateTrackInActivity = (updatedTrack: Track) => {
    const tracks = tempTracks.map((track) => (track.type === updatedTrack.type ? updatedTrack : track));
    updateActivity({ data: { ...data, tracks } });
  };

  const onNext = async () => {
    setIsLoading(true);

    if (activity !== null && data.tracks.filter((track) => !!track.sampleUrl).length === 7) {
      // const sampleUrl = await mixAudios(data.tracks, axiosRequest);
      // updateActivity({ data: { ...data, verseTime:  } });
    }
    save().catch(console.error);
    setIsLoading(false);
    router.push('/parametrer-hymne/2');
  };

  return !activity || !data ? (
    <Base>
      <div></div>
    </Base>
  ) : (
    <Base>
      <div className={styles.mainContainer}>
        <Steps
          steps={['Mix Couplet', 'Intro Outro', 'Couplet', 'Refrain', 'Prévisualiser']}
          activeStep={0}
          urls={['/parametrer-hymne/1', '/parametrer-hymne/2', '/parametrer-hymne/3', '/parametrer-hymne/4', '/parametrer-hymne/5']}
        />
        <div className={styles.trackSelectionContainer}>
          <h1>Mettre en ligne les pistes sonores du couplet</h1>
          <p> Commencez le paramétrage en mettant en ligne les différentes pistes sonores du couplet : </p>
          <div>
            <p className={styles.trackSelectionTitle}>La piste vocal du couplet, La La.</p>
            {tempTracks &&
              tempTracks
                .filter((track) => track.type !== TrackType.INTRO_CHORUS && track.type !== TrackType.OUTRO)
                .map((track, idx) => (
                  <React.Fragment key={idx}>
                    {idx === 1 && <div className={styles.trackSelectionTitle}>Les différentes pistes sonores du couplet (utiles au mixage)</div>}
                    <AnthemTrack track={track} handleTrackUpdate={handleTrackUpdate}></AnthemTrack>
                  </React.Fragment>
                ))}
          </div>
        </div>
      </div>
      <StepsButton next={onNext} />
      <Backdrop className={styles.trackSelectionBackdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default AnthemStep1;
