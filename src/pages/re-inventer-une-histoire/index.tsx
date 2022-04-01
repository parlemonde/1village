import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { Grid, Button, Card, CardMedia, Typography } from '@mui/material';

import { DEFAULT_STORY_DATA } from 'src/activity-types/story.constants';
import { Base } from 'src/components/Base';
import StoryPictureWheel from 'src/components/storyPictureWheel/storyPictureWheel';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { useImageStoryRequests } from 'src/services/useImagesStory';
import { getQueryString } from 'src/utils';
import { serializeToQueryUrl } from 'src/utils';
import { ActivityType } from 'types/activity.type';
import type { ImagesRandomData, StoriesData } from 'types/story.type';

// a) data vient de histoire inspirante => getActivites id ---->  DONE
// b) UseEffect created si data est vide (en ce cas la on recupere que les images) => data {object, ...} StoriesData ---->  DONE
// Useffect roulette =>
// 1) images roulette du data qui vient de getActivities Id ---->  DONE
// 2) images pris alétoirement dans le cas où data vide et remplir le data avec les objects ==> s'inspirer de game pour recevoir un truc random ---->  DONE

const InspiredStory = () => {
  const router = useRouter();
  const { activity, updateActivity, createNewActivity, save } = React.useContext(ActivityContext);
  const activityId = React.useMemo(() => parseInt(getQueryString(router.query.activityId), 10) ?? null, [router]);
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);
  const { getRandomImagesStory } = useImageStoryRequests();
  const [inspiredStoryActivity, setInspiredStoryActivity] = React.useState<StoriesData>();
  const [imagesRandom, setImagesRandom] = React.useState<ImagesRandomData>();

  console.log({ activityId });
  console.log({ 'activity avant creation': activity });

  //Creation of new empty story activity no matter what
  const created = React.useRef(false);
  React.useEffect(() => {
    console.log('je suis dans creation');
    if (!created.current) {
      if (!('edit' in router.query)) {
        created.current = true;
        createNewActivity(
          ActivityType.STORY,
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
  }, [activity, activityId, createNewActivity, inspiredStoryActivity, router.query]);

  console.log({ 'activity après creation': activity });

  //Get data from Inspiring story
  const getInspiringStory = React.useCallback(async () => {
    if (village && activityId) {
      const response = await axiosLoggedRequest({
        method: 'GET',
        url: `/activities${serializeToQueryUrl({
          villageId: village?.id,
          type: ActivityType.STORY,
          id: activityId,
        })}`,
      });
      if (!response.error && response.data) {
        setInspiredStoryActivity(response.data[0].data as StoriesData);
      }
    }
  }, [activityId, axiosLoggedRequest, village]);

  //Get Random Images from DB
  const getRandomImages = React.useCallback(async () => {
    if (village && activity && activity.data) {
      const images = await getRandomImagesStory();
      setImagesRandom(images);
    }
  }, [activity, getRandomImagesStory, village]);
  console.log({ imagesRandom });

  //Get ramdom images when index page is launch only if no activityId in url
  //or when wheel is operated
  React.useEffect(() => {
    if (!activityId) {
      getRandomImages().catch();
    }
  }, [activityId, getRandomImages]);

  //Set imageUrl from imagesRandom in activity
  React.useEffect(() => {
    if (imagesRandom && activity && activity.data) {
      console.log('je suis dans le if imagesRandom');
      const { object, place, odd } = activity.data as StoriesData;
      object.imageUrl = imagesRandom.object.imageUrl;
      place.imageUrl = imagesRandom.place.imageUrl;
      odd.imageUrl = imagesRandom.odd.imageUrl;
    }
    console.log({ 'activity après getRamdomImages': activity?.data });
  }, [activity, getRandomImages, imagesRandom]);

  //Retrieve data from Inspiring story if activityId in url
  React.useEffect(() => {
    if (activityId) {
      getInspiringStory();
    }
  }, [activity, activityId, getInspiringStory]);
  console.log({ inspiredStoryActivity });

  //Set imageUrl from inspiredStoryActivity in activity
  React.useEffect(() => {
    if (inspiredStoryActivity && activity && activity.data) {
      console.log('je suis dans le if inspiredStoryActivity');
      const { object, place, odd } = activity.data as StoriesData;
      object.imageUrl = inspiredStoryActivity.object.imageUrl;
      place.imageUrl = inspiredStoryActivity.place.imageUrl;
      odd.imageUrl = inspiredStoryActivity.odd.imageUrl;
    }
    console.log({ 'activity après getInspiringStory': activity?.data });
  }, [activity, inspiredStoryActivity]);

  const onClick = () => {
    console.log('je passe dans le onClick');
    //to avoid having inspiredStoryActivity in state and imagesRandom in state at the same time
    setInspiredStoryActivity(undefined);
    getRandomImages().catch();
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
            bâtir tous ensemble notre village idéal.
          </p>
          <p className="text">
            1, 2, 3 fermez les yeux... Et <strong>vous voilà arrivés dans notre village idéal.</strong> Je vous accueille chaleureusement et vous fait
            faire la visite !
          </p>
          <p className="text">
            J’ai beaucoup travaillé à rendre cet endroit idéal... et pour cela, je me suis attelé à réaliser les 17 objectifs du développement
            durable. (les ODDs) défini par toute l’humanité pour rendre le monde plus juste, solidaire et plus durable.
          </p>
          <p className="text">
            Pendant cette visite, je vous présente notamment un <strong>objet magique</strong> et un <strong>lieu extraodinaire</strong> qui nous ont
            permis d’atteindre <strong>un des 17 ODDs</strong> avec succès !<br></br>À présent, à votre tour de{' '}
            <strong>raconter cette visite inoubliable à vos Pélicopains !</strong>
          </p>
          <p className="text">
            Pour vous guider, je vous propose de commencer par choisir, décrire et dessiner un objet magique, un lieu extraordinaire et un des 17 ODDs
            de votre choix.
          </p>
          <p className="text">
            Laissez libre court à votre imagination ! Souvenez-vous que si l’objectif du développement durable est bien réel, l’objet et lieu que vous
            choisissez pour l’atteindre sont magiques !
          </p>
        </div>
        {/* Roulette images */}
        {inspiredStoryActivity ? (
          <StoryPictureWheel images={inspiredStoryActivity} onClick={onClick} />
        ) : (
          imagesRandom && <StoryPictureWheel images={imagesRandom} onClick={onClick} />
        )}
        <Link href="/re-inventer-une-histoire/1" passHref>
          <Button
            component="a"
            href="/re-inventer-une-histoire/1"
            variant="outlined"
            color="primary"
            style={{
              float: 'right',
              marginBottom: '3rem',
            }}
          >
            Étape suivante
          </Button>
        </Link>
      </Base>
    </>
  );
};

export default InspiredStory;
