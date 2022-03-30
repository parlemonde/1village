import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import AddIcon from '@mui/icons-material/Add';
import { TextField, Grid, ButtonBase, Button, Card, CardMedia, Typography } from '@mui/material';

import { isStory } from 'src/activity-types/anyActivity';
import { DEFAULT_STORY_DATA } from 'src/activity-types/story.constants';
import { Base } from 'src/components/Base';
import { KeepRatio } from 'src/components/KeepRatio';
import { ImageModal } from 'src/components/activities/content/editors/ImageEditor/ImageModal';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { useImageStoryRequests } from 'src/services/useImagesStory';
import { bgPage, primaryColor, errorColor } from 'src/styles/variables.const';
import { getQueryString } from 'src/utils';
import { serializeToQueryUrl } from 'src/utils';
import type { Activity } from 'types/activity.type';
import { ActivityStatus, ActivityType } from 'types/activity.type';
import type { ImagesRandomData, StoriesData, StoryElement } from 'types/story.type';

// a) data vient de histoire inspirante => getActivites id ---->  DONE
// b) UseEffect created si data est vide (en ce cas la on recupere que les images) => data {object, ...} StoriesData ---->  DONE
// Useffect roulette =>
// 1) images roulette du data qui vient de getActivities Id
// 2) images pris alétoirement dans le cas où data vide et remplir le data avec les objects ==> s'inspirer de game pour recevoir un truc random

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
  console.log({ activity });

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

  //Get Random Images fom DB
  const getRandomImages = React.useCallback(async () => {
    if (village && activity) {
      const images = await getRandomImagesStory();
      console.log({ images });
      setImagesRandom(images);
    }
  }, [activity, getRandomImagesStory, village]);
  console.log({ imagesRandom });

  React.useEffect(() => {
    getRandomImages().catch();
  }, [getRandomImages]);

  //Retrieve data from Inspiring story
  React.useEffect(() => {
    if (activityId) {
      getInspiringStory();
    }
  }, [activity, activityId, getInspiringStory]);
  console.log({ inspiredStoryActivity });

  const created = React.useRef(false);
  React.useEffect(() => {
    if (!created.current) {
      if (!('edit' in router.query) && inspiredStoryActivity && Object.keys(inspiredStoryActivity).length > 0) {
        created.current = true;
        createNewActivity(
          ActivityType.STORY,
          undefined,
          {
            ...inspiredStoryActivity,
          },
          null,
          null,
          undefined,
        );
      } else {
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
    // }
  }, [activity, activityId, createNewActivity, inspiredStoryActivity, router.query]);

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
        {imagesRandom && (
          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={1}>
            <Grid
              container
              spacing={1}
              xs={5}
              style={{ border: 'solid 8px', borderRadius: '1rem', color: 'grey', boxSizing: 'border-box', width: 'inherit', paddingRight: '8px' }}
            >
              {imagesRandom.object.imageUrl && imagesRandom.place.imageUrl && imagesRandom.odd.imageUrl && (
                <>
                  <Grid item xs>
                    <Card sx={{ mb: 1 }}>
                      <Typography sx={{ mb: 1.5, p: 2, textAlign: 'center', borderRadius: '0.5rem', backgroundColor: '#DEDBDB' }} variant={'h3'}>
                        Objet
                      </Typography>
                      <CardMedia
                        sx={{ borderRadius: '0.5rem', mt: 1 }}
                        component="img"
                        height="150"
                        image={imagesRandom.object.imageUrl}
                        alt="objet de l'histoire"
                      />
                    </Card>
                  </Grid>
                  <Grid item xs>
                    <Card sx={{ mb: 1 }}>
                      <Typography sx={{ mb: 1.5, p: 2, textAlign: 'center', borderRadius: '0.5rem', backgroundColor: '#DEDBDB' }} variant={'h3'}>
                        Lieu
                      </Typography>{' '}
                      <CardMedia
                        sx={{ borderRadius: '0.5rem', mt: 1 }}
                        component="img"
                        height="150"
                        image={imagesRandom.place.imageUrl}
                        alt="lieu de l'histoire"
                      />
                    </Card>
                  </Grid>
                  <Grid item xs>
                    <Card sx={{ mb: 1 }}>
                      <Typography sx={{ mb: 1.5, p: 2, textAlign: 'center', borderRadius: '0.5rem', backgroundColor: '#DEDBDB' }} variant={'h3'}>
                        ODD
                      </Typography>
                      <CardMedia
                        sx={{ borderRadius: '0.5rem', mt: 1 }}
                        component="img"
                        height="150"
                        image={imagesRandom.odd.imageUrl}
                        alt="Objectifs de développement durable de l'histoire"
                      />
                    </Card>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
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
