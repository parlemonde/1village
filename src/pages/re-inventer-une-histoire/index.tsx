import { useRouter } from 'next/router';
import React from 'react';

import { DEFAULT_STORY_DATA } from 'src/activity-types/story.constants';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import StoryPictureWheel from 'src/components/storyPictureWheel/storyPictureWheel';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { getQueryString } from 'src/utils';
import { ActivityType } from 'types/activity.type';
import type { StoryElement, StoriesData } from 'types/story.type';

const InspiredStory = () => {
  const router = useRouter();
  const inspiredActivityId = React.useMemo(() => parseInt(getQueryString(router.query.activityId), 10) ?? null, [router]);
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const { createNewActivity } = React.useContext(ActivityContext);

  const [inspiredImages, setInspiredImages] = React.useState<{ object: StoryElement; place: StoryElement; odd: StoryElement } | null>(null);
  const [storyData, setStoryData] = React.useState<StoriesData>(DEFAULT_STORY_DATA);

  const onImagesChange = React.useCallback((object: StoryElement, place: StoryElement, odd: StoryElement) => {
    setStoryData((prevStoryData) => ({
      ...prevStoryData,
      object: { ...object, description: prevStoryData.object.description },
      place: { ...place, description: prevStoryData.place.description },
      odd: { ...odd, description: prevStoryData.odd.description },
    }));
  }, []);

  // Get data from Inspiring story
  const getInspiringStory = React.useCallback(async () => {
    if (inspiredActivityId) {
      const response = await axiosLoggedRequest({
        method: 'GET',
        url: `/activities/${inspiredActivityId}`,
      });
      if (!response.error && response.data) {
        setInspiredImages(response.data.data);
      }
    }
  }, [inspiredActivityId, axiosLoggedRequest]);

  //Retrieve data from Inspiring story if activityId in url
  React.useEffect(() => {
    if (inspiredActivityId) {
      getInspiringStory();
    }
  }, [inspiredActivityId, getInspiringStory]);

  const onNext = () => {
    createNewActivity(ActivityType.RE_INVENT_STORY, undefined, storyData);
    router.push('/re-inventer-une-histoire/1');
  };

  return (
    <>
      <Base>
        <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
          <h1>Ré-inventer votre histoire du village idéal</h1>
          <p className="text">Comme vous le savez déjà, je suis parti pour un long voyage autour du monde en novembre.</p>
          <p className="text">
            En parcourant le ciel à tire d’ailes, un nuage mystérieux m’a attiré et me voilà depuis plusieurs mois sur la toile à échanger avec vous,
            mes chers Pélicopains et Pélicopines.
          </p>
          <p className="text">
            Quel bonheur depuis, de découvrir votre culture et votre quotidien à travers vos questions, reportages, énigmes et défis !
          </p>
          <p className="text">
            Afin de fêter la fin de cette belle aventure, je vous propose de me rejoindre, vous et votre mascotte, dans mon monde imaginaire, afin de
            bâtir tous ensemble notre village idéal.{' '}
          </p>
          <p className="text">
            1, 2, 3 fermez les yeux... Et <strong>vous voilà arrivés dans notre village idéal.</strong> Je vous accueille chaleureusement et vous fait
            faire la visite !
          </p>
          <p className="text">
            J’ai beaucoup travaillé à rendre cet endroit idéal... et pour cela, je me suis attelé à réaliser les 17 objectifs du développement durable
            (les ODDs) défini par toute l’humanité pour rendre le monde plus juste, solidaire et plus durable.{' '}
          </p>
          <p className="text">
            Pendant cette visite, je vous présente notamment un <strong>objet magique</strong> et un <strong>lieu extraodinaire</strong> qui nous ont
            permis d’atteindre <strong>un des 17 ODDs</strong> avec succès !<br></br>À présent, à votre tour de{' '}
            <strong>raconter cette visite inoubliable à vos Pélicopains !</strong>
          </p>
          <p className="text">
            Pour vous guider, je vous propose de commencer par choisir, décrire et dessiner un objet magique, un lieu extraordinaire et un des 17 ODDs
            de votre choix. Puisez votre inspiration parmi les éléments déjà imaginés par vos Pélicopains !<br></br>
            Actionnez la manette autant de fois que vous le souhaitez pour choisir différentes sources d’inspirations, tirées de toutes les histoires
            déjà proposées par tes Pélicopains.
          </p>
          <p className="text">
            Laissez libre court à votre imagination ! Souvenez-vous que si l’objectif du développement durable est bien réel, l’objet et lieu que vous
            choisissez pour l’atteindre sont <i>magiques</i> !
          </p>
        </div>
        {/* Roulette images */}
        <StoryPictureWheel
          initialObjectImage={inspiredImages ? inspiredImages.object : null}
          initialPlaceImage={inspiredImages ? inspiredImages.place : null}
          initialOddImage={inspiredImages ? inspiredImages.odd : null}
          onImagesChange={onImagesChange}
        />
        <StepsButton next={onNext} />
      </Base>
    </>
  );
};

export default InspiredStory;
