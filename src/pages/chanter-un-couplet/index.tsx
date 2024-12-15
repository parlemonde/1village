import { useRouter } from 'next/router';
import React from 'react';

import { Base } from 'src/components/Base';
import { PageLayout } from 'src/components/PageLayout';
import { StepsButton } from 'src/components/StepsButtons';
import { AudioPlayer } from 'src/components/audio/AudioPlayer';
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
          <h1>Et si on créait tous ensemble l’hymne du village-monde ?</h1>
          <div style={{ height: '100%', width: '100%', objectFit: 'contain' }}>
            <p>Avec plusieurs de mes amies, nous avons imaginé un hymne pour le village-monde. Je vous laisse le découvrir…</p>
            <p>Notre hymne commence par une introduction, puis vient le refrain, un couplet et une conclusion. </p>
            <AudioPlayer src={anthemActivityData.fullMixUrl} style={{ width: '100%', height: '40px' }} />
            <p>Notre hymne commence par une introduction, puis vient le refrain, un couplet, et la conclusion.</p>
            <p>
              Avez-vous remarqué qu’il manque quelque chose ? <b>Je n&apos;ai pas écrit les paroles du couplet ! </b> Et oui car c’est votre mission !{' '}
              <strong>
                Chaque classe de votre village-monde ainsi que la vôtre allez pouvoir écrire, chanter et enregistrer votre propre couplet.
              </strong>{' '}
              A vous de raconter votre expérience d’1Village et vos souvenirs avec les pélicopains en chanson !
            </p>
            <p>
              Pour créer votre couplet, je vous propose de commencer par le mixer en modifiant le volume de certains instruments. Tendez bien
              l’oreille, l’émotion de votre couplet change selon votre mix ! Ensuite vous pourrez écrire les paroles de votre couplet, enregistrer
              votre voix et le mettre en ligne.{' '}
            </p>
            <p>À la fin de l&apos;année, vous pourrez écouter l&apos;hymne composé des couplets de tous les pélicopains !</p>
          </div>
        </div>
      </PageLayout>
      <StepsButton next={onNext} />
    </Base>
  );
};

export default Anthem;
