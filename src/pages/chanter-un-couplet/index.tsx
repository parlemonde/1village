import { useRouter } from 'next/router';
import React from 'react';

import type { AnthemData } from 'src/activity-types/anthem.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { ActivityContext } from 'src/contexts/activityContext';
import { VillageContext } from 'src/contexts/villageContext';
import { axiosRequest } from 'src/utils/axiosRequest';
import type { Activity } from 'types/activity.type';
import { ActivityType } from 'types/activity.type';

const emptyAnthemActivity: AnthemData = {
  verseAudios: [],
  introOutro: [],
  verseLyrics: [],
  chorus: [],
  finalVerse: '',
  finalMix: '',
  verseTime: 0,
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

    if (!newAnthemActivityData.finalMix) {
      router.push('/');
    }
  }, [router, village]);
  React.useEffect(() => {
    getAnthemData().catch(console.error);
  }, [getAnthemData]);

  const onNext = () => {
    const { chorus, verseAudios, introOutro, verseLyrics, verseTime } = anthemActivityData;
    createNewActivity(ActivityType.VERSE_RECORD, selectedPhase, undefined, {
      verseAudios,
      introOutro,
      verseTime,
      chorus,
      verseLyrics,
      verse: '',
      customizedMix: '',
      customizedMixBlob: null,
      mixWithoutLyrics: '',
      classRecord: '',
    });
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
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <div className="width-900">
          <h1>Découvrez l&apos;hymne de votre village idéal</h1>
          <div style={{ height: '100%', width: '100%', objectFit: 'contain' }}>
            <p>
              Que pensez-vous d’accompagner nos Olympiades de Pélico par un hymne ? Avec plusieurs de mes amies, nous avons imaginé un hymne pour le
              village-idéal et pour les OP. Je vous laisse le découvrir…{' '}
            </p>
            <audio controls src={anthemActivityData.finalMix} style={{ width: '100%', height: '40px' }} />
            <p>Notre hymne commence par une introduction, puis vient le refrain, un couplet, et la conclusion.</p>

            <p>
              Avez-vous remarqué qu’il manque quelque chose ? <b>Je n&apos;ai pas écrit les paroles du couplet ! </b> Et oui car c’est votre mission !{' '}
              <strong>
                Chaque classe de votre village-monde ainsi que la vôtre allez pouvoir écrire, chanter et enregistrer son propre couplet.
              </strong>{' '}
              À vous de raconter votre expérience d&apos;1Village et des OP en chanson 🎵
            </p>
            <p>
              Pour créer votre couplet, je vous propose de commencer par modifier la musique de votre couplet, en modulant le volume sonore de
              certains instruments. Tendez bien l&apos;oreille, en fonction de ces variations sur un même thème, l&apos;émotion de votre couplet
              change ! Ensuite, vous pourrez écrire votre couplet, enregistrer votre voix et le mettre en ligne.{' '}
            </p>
            <p>À la fin de l&apos;année, vous pourrez écouter l&apos;hymne composé des couplets de tous les pélicopains !</p>
          </div>
        </div>
      </div>
      <StepsButton next={onNext} />
    </Base>
  );
};

export default Anthem;
