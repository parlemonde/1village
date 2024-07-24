import { useRouter } from 'next/router';
import React from 'react';

import { Box } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import styles from '../../../../../styles/parametrer-hymne.module.css';
import { DEFAULT_ANTHEM_DATA } from 'src/activity-types/anthem.constants';
import { isAnthem } from 'src/activity-types/anyActivity';
import { postMixAudio } from 'src/api/audio/audio-mix.post';
import { deleteAudio } from 'src/api/audio/audio.delete';
import { PageLayout } from 'src/components/PageLayout';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import AnthemTrack from 'src/components/activities/anthem/AnthemTrack/AnthemTrack';
import { InstrumentSvg } from 'src/components/activities/anthem/InstrumentSvg/InstrumentSvg';
import { ActivityContext } from 'src/contexts/activityContext';
import { VillageContext } from 'src/contexts/villageContext';
import { useActivityRequests } from 'src/services/useActivity';
import instruments from 'src/utils/instruments';
import { ActivityStatus, ActivityType } from 'types/activity.type';
import { TrackType } from 'types/anthem.type';
import type { AnthemData, Track } from 'types/anthem.type';

const AnthemStep1 = () => {
  const router = useRouter();

  const { activity, createActivityIfNotExist, updateActivity, save } = React.useContext(ActivityContext);
  const { selectedPhase } = React.useContext(VillageContext);

  const { deleteActivity } = useActivityRequests();

  const [isLoading, setIsLoading] = React.useState(false);
  const data = (activity?.data as AnthemData) || null;

  const created = React.useRef(false);

  const displayableInstruments = React.useMemo(() => {
    return instruments.map((instrument) => {
      return { ...instrument, svg: <InstrumentSvg instrumentName={instrument.value} /> };
    });
  }, []);

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

    // améliorer vérification du type
    if (activity && isAnthem(activity) && !Object.prototype.hasOwnProperty.call(data, 'fullMixUrl')) {
      deleteActivity(activity.id, !!activity.status);
      created.current = true;
      createActivityIfNotExist(ActivityType.ANTHEM, selectedPhase, undefined, DEFAULT_ANTHEM_DATA, true);
    }
  }, [activity, createActivityIfNotExist, data, deleteActivity, router, selectedPhase]);

  const handleTrackUpdate = (updatedTrack: Track) => {
    const tracks = [...data.tracks].map((track) => (track.type === updatedTrack.type ? updatedTrack : track));
    updateActivity({ data: { ...data, tracks } });
  };

  const buildVerseUrl = async () => {
    // -- clean previous mix
    if (activity?.status === ActivityStatus.DRAFT) {
      if (data.mixUrl) {
        await deleteAudio(data.mixUrl).catch(console.error);
      }
      if (data.fullMixUrl) {
        await deleteAudio(data.fullMixUrl).catch(console.error);
      }
    }

    const verseTracks = data.tracks.filter((t) => t.type !== TrackType.INTRO_CHORUS && t.type !== TrackType.OUTRO && t.sampleUrl !== '');
    const mixUrl = verseTracks.length > 0 ? await postMixAudio(verseTracks) : '';

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

    updateActivity({ data: { ...data, mixUrl, fullMixUrl } });
  };

  const onNext = async () => {
    setIsLoading(true);
    // [1] Build the verse url
    await buildVerseUrl();

    // [2] Save the activity
    save().catch(console.error);
    setIsLoading(false);
    router.push('/admin/newportal/create/parametrer-hymne/2');
  };

  return !activity || !data ? (
    <div></div>
  ) : (
    <>
      <PageLayout>
        <Steps
          steps={['Mix Couplet', 'Intro Outro', 'Couplet', 'Refrain', 'Prévisualiser']}
          activeStep={0}
          urls={[
            '/admin/newportal/create/parametrer-hymne/1?edit',
            '/admin/newportal/create/parametrer-hymne/2',
            '/admin/newportal/create/parametrer-hymne/3',
            '/admin/newportal/create/parametrer-hymne/4',
            '/admin/newportal/create/parametrer-hymne/5',
          ]}
          onBeforeLeavePage={buildVerseUrl}
        />
        <Box className={styles.contentContainer}>
          <h1>Mettre en ligne les pistes sonores du couplet</h1>
          <p> Commencez le paramétrage en mettant en ligne les différentes pistes sonores du couplet : </p>
          <div>
            <p className={styles.trackSelectionTitle}>La piste vocal du couplet, La La.</p>
            {data.tracks &&
              (data.tracks || [])
                .filter((track) => track.type !== TrackType.INTRO_CHORUS && track.type !== TrackType.OUTRO)
                .map((track) =>
                  track.type === TrackType.VOCALS ? (
                    <>
                      <AnthemTrack track={track} handleTrackUpdate={handleTrackUpdate} instruments={displayableInstruments}></AnthemTrack>
                      <div className={styles.trackSelectionTitle}>Les différentes pistes sonores du couplet (utiles au mixage)</div>
                    </>
                  ) : (
                    <AnthemTrack track={track} handleTrackUpdate={handleTrackUpdate} instruments={displayableInstruments}></AnthemTrack>
                  ),
                )}
          </div>
        </Box>
      </PageLayout>
      <StepsButton next={onNext} />
      <Backdrop className={styles.trackSelectionBackdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default AnthemStep1;
