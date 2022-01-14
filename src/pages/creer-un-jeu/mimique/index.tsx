import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import Button from '@mui/material/Button';

import { Base } from 'src/components/Base';
import { ActivityComments } from 'src/components/activities/ActivityComments';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { useGameRequests } from 'src/services/useGames';
import { useVillageUsers } from 'src/services/useVillageUsers';
import { serializeToQueryUrl } from 'src/utils';
import type { Activity } from 'types/activity.type';
import { ActivityType } from 'types/activity.type';
import { GameType } from 'types/game.type';
import type { User } from 'types/user.type';

const Mimique = () => {
  const router = useRouter();
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);
  const { getAvailableGamesCount } = useGameRequests();
  const { users } = useVillageUsers();
  const [mimicsCount, setMimicsCount] = React.useState<number>(0);
  const [activity, setActivity] = React.useState<Activity[]>([]);

  const usersMap = React.useMemo(() => {
    return users.reduce<{ [key: number]: User }>((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});
  }, [users]);

  //I thought fetching activity by using this useEffect.
  React.useEffect(() => {
    if (village) {
      axiosLoggedRequest({
        method: 'GET',
        url: `/activities${serializeToQueryUrl({
          villageId: village?.id,
          type: ActivityType.GAME,
        })}`,
      }).then((response) => {
        if (!response.error && response.data) {
          const activity = response.data;
          setActivity(activity as Activity[]);
        }
      });
    }
  }, [axiosLoggedRequest, village]);

  React.useEffect(() => {
    getAvailableGamesCount(GameType.MIMIC).then((count) => {
      setMimicsCount(count);
    });
  }, [getAvailableGamesCount]);

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem', marginTop: '2rem' }}>
        <h1>Qu’est-ce qu’une mimique ?</h1>
        <p style={{ marginBottom: '2rem' }}>
          Une mimique est un geste du corps qui exprime une émotion ou une pensée, et que l’on fait dans certaine situation. Par exemple, un signe des
          mains pour dire bonjour ! Ou bien, un mouvement du visage pour exprimer la colère. Pelico aime beaucoup les mimiques, parce qu’elles sont
          très parlantes… sans que l’on ait besoin de parler ! Certaines sont les mêmes partout sur terre, quand d’autres ne sont compréhensible que
          par les habitants d’un seul pays… ou même d’une seule région !
        </p>
        <h1>Faites découvrir vos mimiques aux Pélicopains !</h1>
        <p style={{ marginBottom: '2rem' }}>
          À vous de faire découvrir 3 mimiques que vous utilisez à vos Pélicopains ! À chaque étape, vous pourrez mettre en ligne une courte vidéo
          illustrant la mimique, une explication de sa signification et de son origine. Pour pimenter le jeu, à chaque étape vous devrez également
          inventer deux significations fausses … à vos Pélicopains de deviner ce qui signifie réellement vos mimiques !
        </p>
        <Link href="/creer-un-jeu/mimique/1" passHref>
          <Button
            component="a"
            onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
              event.preventDefault();
              router.push('/creer-un-jeu/mimique/1');
            }}
            href="/creer-un-jeu/mimique/1"
            color="primary"
            variant="outlined"
            style={{
              float: 'right',
            }}
            disableElevation
          >
            Faire découvrir 3 mimiques
          </Button>
        </Link>
        <h1 style={{ marginTop: '6rem' }}>Découvrez les mimiques de vos Pélicopains !</h1>

        <p style={{ marginBottom: '3rem' }}>
          Une fois que vous aurez décrit 3 mimiques, ça sera à vous de deviner ce que veulent dire les mimiques de vos Pélicopains ! Il y a
          actuellement {mimicsCount === 0 ? `${mimicsCount} nouvelle mimique` : `${mimicsCount} nouvelles mimiques`} à découvrir :
        </p>

        <Link href="/creer-un-jeu/mimique/jouer" passHref>
          <Button
            component="a"
            onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
              event.preventDefault();
              router.push('/creer-un-jeu/mimique/jouer');
            }}
            href="/creer-un-jeu/mimique/jouer"
            color="primary"
            variant="outlined"
            style={{
              float: 'right',
            }}
            disableElevation
            disabled={mimicsCount === 0}
          >
            Découvrir des mimiques
          </Button>
        </Link>
      </div>
      <div>
        <ActivityComments activityId={activity[0]?.id} activityType={GameType.MIMIC} activityPhase={2} usersMap={usersMap} />
      </div>
    </Base>
  );
};

export default Mimique;
