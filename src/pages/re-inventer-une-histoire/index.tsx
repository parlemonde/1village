import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import AddIcon from '@mui/icons-material/Add';
import { TextField, Grid, ButtonBase, Button } from '@mui/material';

import { isStory } from 'src/activity-types/anyActivity';
import { DEFAULT_STORY_DATA } from 'src/activity-types/story.constants';
import { Base } from 'src/components/Base';
import { KeepRatio } from 'src/components/KeepRatio';
import { ImageModal } from 'src/components/activities/content/editors/ImageEditor/ImageModal';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { bgPage, primaryColor, errorColor } from 'src/styles/variables.const';
import { getQueryString } from 'src/utils';
import { serializeToQueryUrl } from 'src/utils';
import type { Activity } from 'types/activity.type';
import { ActivityStatus, ActivityType } from 'types/activity.type';
import type { StoriesData, StoryElement } from 'types/story.type';

// a) data vient de histoire inspirante => getActivites id
// b) UseEffect created si data est vide (en ce cas la on recupere que les images) => data {object, ...} StoriesData
// Useffect roulette =>
// 1) images roulette du data qui vient de getActivities Id
// 2) images pris alétoirement dans le cas où data vide et remplir le data avec les objects

const InspiredStory = () => {
  const router = useRouter();
  const { activity, updateActivity, createNewActivity, save } = React.useContext(ActivityContext);
  const activityId = React.useMemo(() => parseInt(getQueryString(router.query.id), 10) ?? null, [router]);
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);
  const [inspiredStoryActivity, setInspiredStoryActivity] = React.useState<Activity[]>([]);

  console.log({ activityId });
  React.useEffect(() => {
    if (village) {
      axiosLoggedRequest({
        method: 'GET',
        url: `/activities${serializeToQueryUrl({
          villageId: village?.id,
          type: ActivityType.STORY,
        })}`,
      }).then((response) => {
        if (!response.error && response.data) {
          const inspiredStoryActivity = response.data;
          setInspiredStoryActivity(inspiredStoryActivity as Activity[]);
        }
      });
    }
  }, [axiosLoggedRequest, village]);

  // Create the story activity.
  const created = React.useRef(false);
  React.useEffect(() => {
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
      } else if (activity && !isStory(activity)) {
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
  }, [activity, createNewActivity, router.query]);

  return (
    <>
      <Base>
        <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
          <h1>Inventer votre histoire du village idéal</h1>
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
            Commencer
          </Button>
        </Link>
      </Base>
    </>
  );
};

export default InspiredStory;
