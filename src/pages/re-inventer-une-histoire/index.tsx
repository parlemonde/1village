import { useRouter } from 'next/router';
import React from 'react';

import { isStory } from 'src/activity-types/anyActivity';
import { DEFAULT_STORY_DATA } from 'src/activity-types/story.constants';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import StoryPictureWheel from 'src/components/storyPictureWheel/storyPictureWheel';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { getQueryString } from 'src/utils';
import { ActivityType } from 'types/activity.type';
import type { StoryElement, StoriesData } from 'types/story.type';

const InspiredStory = () => {
  const router = useRouter();
  const activityId = React.useMemo(() => parseInt(getQueryString(router.query.activityId), 10) ?? null, [router]);
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const { activity, createNewActivity, save } = React.useContext(ActivityContext);
  const { village } = React.useContext(VillageContext);

  const [inspiredStoryActivity, setInspiredStoryActivity] = React.useState<StoriesData>();

  //Creation of new empty story activity no matter what
  const created = React.useRef(false);
  React.useEffect(() => {
    if (!created.current) {
      if (!('edit' in router.query)) {
        created.current = true;
        createNewActivity(
          ActivityType.RE_INVENT_STORY,
          undefined,
          {
            ...DEFAULT_STORY_DATA,
          },
          null,
          null,
          undefined,
        );
      }
    }
  }, [activity, activityId, createNewActivity, router.query]);

  const onImagesChange = (objectTransformed: StoryElement, placeTransformed: StoryElement, oddTransformed: StoryElement) => {
    if (activity && activity.data) {
      activity.data.object = objectTransformed;
      activity.data.place = placeTransformed;
      activity.data.odd = oddTransformed;
    }
  };

  //Get data from Inspiring story
  const getInspiringStory = React.useCallback(async () => {
    if (village && activityId) {
      const response = await axiosLoggedRequest({
        method: 'GET',
        url: `/activities/${activityId}`,
      });
      if (!response.error && response.data) {
        setInspiredStoryActivity(response.data.data as StoriesData);
      }
    }
  }, [activityId, axiosLoggedRequest, village]);

  //Retrieve data from Inspiring story if activityId in url
  React.useEffect(() => {
    if (activityId) {
      getInspiringStory();
    }
  }, [activity, activityId, getInspiringStory]);

  const updateData = (data: StoriesData) => {
    if (activity && activity.data) {
      const { object, place, odd } = activity.data as StoriesData;
      //update imageUrl
      object.imageUrl = data.object.imageUrl;
      place.imageUrl = data.place.imageUrl;
      odd.imageUrl = data.odd.imageUrl;
      //update imageId
      object.imageId = data.object.imageId;
      place.imageId = data.place.imageId;
      odd.imageId = data.odd.imageId;
      //update inspiredStoryId to trace images
      object.inspiredStoryId = data.object.inspiredStoryId;
      place.inspiredStoryId = data.place.inspiredStoryId;
      odd.inspiredStoryId = data.odd.inspiredStoryId;
    }
  };

  //Set imageUrl from inspiredStoryActivity or imagesRandom in activity
  React.useEffect(() => {
    if (inspiredStoryActivity && activity && activity.data) {
      updateData(inspiredStoryActivity);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity, inspiredStoryActivity]);

  const onNext = () => {
    save().catch(console.error);
    router.push('/re-inventer-une-histoire/1');
  };

  if (activity === null || !isStory(activity)) {
    return <div></div>;
  }

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
          objectImage={activity.data.object}
          placeImage={activity.data.place}
          oddImage={activity.data.odd}
          onImagesChange={onImagesChange}
        />
        <StepsButton next={onNext} />
      </Base>
    </>
  );
};

export default InspiredStory;
