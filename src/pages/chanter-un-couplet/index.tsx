import { useRouter } from 'next/router';
import React from 'react';

import { Base } from 'src/components/Base';
import { PageLayout } from 'src/components/PageLayout';
import { StepsButton } from 'src/components/StepsButtons';
import { ActivityContext } from 'src/contexts/activityContext';
import { VillageContext } from 'src/contexts/villageContext';
import { axiosRequest } from 'src/utils/axiosRequest';
import type { Activity } from 'types/activity.type';
import { ActivityType } from 'types/activity.type';
import { TrackType } from 'types/anthem.type';
import type { AnthemData, Track } from 'types/anthem.type';
import type { ClassAnthemData } from 'types/classAnthem.types';

const emptyAnthemActivity: AnthemData = {
  tracks: [],
  verseLyrics: [],
  chorusLyrics: [],
  mixUrl: '',
  fullMixUrl: '',
};

const Anthem = () => {
  const router = useRouter();
  const { createNewActivity } = React.useContext(ActivityContext);
  const { village, selectedPhase } = React.useContext(VillageContext);
  const [anthemActivityData, setAnthemActivityData] = React.useState<AnthemData>(emptyAnthemActivity);

  const getAnthemData = React.useCallback(async () => {
    if (!village || !village.anthemId) {
      router.push('/');
      return;
    }
    const response = await axiosRequest({
      method: 'GET',
      url: `/activities/${village.anthemId}`,
    });
    if (response.error) {
      router.push('/');
      return;
    }
    const newAnthemActivityData = (response.data as Activity<AnthemData>).data;
    setAnthemActivityData(newAnthemActivityData);
    if (!newAnthemActivityData.fullMixUrl) {
      router.push('/');
    }
  }, [router, village]);

  React.useEffect(() => {
    getAnthemData().catch(console.error);
  }, [getAnthemData]);

  const onNext = () => {
    const { tracks, verseLyrics, chorusLyrics } = anthemActivityData;
    const classRecordTrack = {
      type: TrackType.CLASS_RECORD,
      label: 'Piste vocale de la classe',
      sampleUrl: '',
      sampleDuration: 0,
      iconUrl: '',
      sampleStartTime: 0,
      sampleVolume: 1,
    } as Track;

    const newData: ClassAnthemData = {
      anthemTracks: tracks,
      classRecordTrack: classRecordTrack,
      verseMixUrl: '',
      verseMixWithIntroUrl: '',
      verseMixWithVocalsUrl: '',
      verseFinalMixUrl: '',
      verseLyrics: verseLyrics,
      chorusLyrics: chorusLyrics,
    };
    createNewActivity(ActivityType.CLASS_ANTHEM, selectedPhase, undefined, newData);
    router.push('/chanter-un-couplet/1');
  };
  if (!anthemActivityData) {
    return (
      <Base>
        <div></div>
      </Base>
    );
  }
  return (
    <Base>
      <PageLayout>
        <div className="width-900">
          <h1>Voici l’hymne de votre village-monde : </h1>
          <div style={{ height: '100%', width: '100%', objectFit: 'contain' }}>
            <p>
              Avez-vous remarqué qu’il manque quelque chose ? Il n’y a pas les paroles du couplet ! C’est à vous de les imaginer, les écrire puis les
              chanter. Pour cela, repensez à votre expérience d’1Village, ce que vous avez aimé, ce que vous retenez…
            </p>
          </div>
        </div>
      </PageLayout>
      <StepsButton next={onNext} />
    </Base>
  );
};

export default Anthem;
