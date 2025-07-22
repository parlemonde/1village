import { useRouter } from 'next/router';
import React from 'react';

import { DEFAULT_STORY_DATA } from 'src/activity-types/story.constants';
import { Base } from 'src/components/Base';
import { PageLayout } from 'src/components/PageLayout';
import { StepsButton } from 'src/components/StepsButtons';
import StoryPictureWheel from 'src/components/storyPictureWheel/storyPictureWheel';
import { ActivityContext } from 'src/contexts/activityContext';
import { VillageContext } from 'src/contexts/villageContext';
import { getQueryString } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';

import { ActivityType } from 'types/activity.type';
import type { StoryElement, StoriesData } from 'types/story.type';

const InspiredStory = () => {
  const router = useRouter();
  const inspiredActivityId = React.useMemo(() => parseInt(getQueryString(router.query.activityId), 10) ?? null, [router]);

  const { createNewActivity } = React.useContext(ActivityContext);
  const { selectedPhase } = React.useContext(VillageContext);

  const [inspiredImages, setInspiredImages] = React.useState<{ odd: StoryElement; object: StoryElement; place: StoryElement } | null>(null);
  const [storyData, setStoryData] = React.useState<StoriesData>(DEFAULT_STORY_DATA);

  const onImagesChange = React.useCallback((odd: StoryElement, object: StoryElement, place: StoryElement) => {
    setStoryData((prevStoryData) => ({
      ...prevStoryData,
      odd: { ...odd, description: prevStoryData.odd.description },
      object: { ...object, description: prevStoryData.object.description },
      place: { ...place, description: prevStoryData.place.description },
    }));
  }, []);

  // Get data from Inspiring story
  const getInspiringStory = React.useCallback(async () => {
    if (inspiredActivityId) {
      const response = await axiosRequest({
        method: 'GET',
        url: `/activities/${inspiredActivityId}`,
      });
      if (!response.error && response.data) {
        setInspiredImages(response.data.data);
      }
    }
  }, [inspiredActivityId]);

  //Retrieve data from Inspiring story if activityId in url
  React.useEffect(() => {
    if (inspiredActivityId) {
      getInspiringStory();
    }
  }, [inspiredActivityId, getInspiringStory]);

  const onNext = () => {
    //TODO: implement first time and only one story in db
    createNewActivity(ActivityType.RE_INVENT_STORY, selectedPhase, undefined, storyData);
    router.push('/re-inventer-une-histoire/1');
  };

  return (
    <>
      <Base>
        <PageLayout>
          <h1>Ré-inventer l’histoire du village-monde idéal !</h1>
          <p className="text">
            Si vous vous souvenez bien, en phase 2 vous avez peut-être inventé l’histoire du village-monde idéal… Et bien j’ai tellement adoré cette
            activité que je voulais vous proposer de la réécrire. Mais bien sûr, un peu différemment !{' '}
          </p>
          <p className="text">
            Cette fois, je vous propose de l’écrire en puisant votre inspiration parmi les éléments déjà imaginés par vos pélicopains.{' '}
          </p>
          <p className="text">
            Pour rappel, votre histoire doit décrire comment votre objet magique et votre lieu extraordinaire permettent d’atteindre un des 17
            Objectifs du Développement Durable pour que votre village-monde soit idéal.{' '}
            <strong>
              Actionner la manette autant de fois que vous le souhaitez pour choisir différentes parties d’histoire inventées par les pélicopains !
              Puis inspirez-vous de ce qu’ils ont dessiné et laissez libre court à votre imagination pour écrire l’histoire…
            </strong>
          </p>
          {/* <p className="text">
            Une fois que vous aurez sélectionné les images des histoires écrites par les pélicopains, vous pourrez de nouveau choisir un objectif du
            développement durable et imaginer l’objet magique ainsi que le lieu idéal.
          </p>
          <p className="text">
            Inspirez-vous de ce qu’ils ont dessiné et laissez libre court à votre imagination ! Souvenez-vous que si l’objectif du développement
            durable est bien réel, l’objet et lieu que vous choisissez pour l’atteindre sont magiques 🙂
          </p> */}
        </PageLayout>
        {/* Roulette images */}
        <StoryPictureWheel
          initialOddImage={inspiredImages ? inspiredImages.odd : null}
          initialObjectImage={inspiredImages ? inspiredImages.object : null}
          initialPlaceImage={inspiredImages ? inspiredImages.place : null}
          onImagesChange={onImagesChange}
        />
        <StepsButton next={onNext} />
      </Base>
    </>
  );
};

export default InspiredStory;
