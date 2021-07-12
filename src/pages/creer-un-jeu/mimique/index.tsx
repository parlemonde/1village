import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { Base } from 'src/components/Base';
import Button from '@material-ui/core/Button';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { serializeToQueryUrl } from 'src/utils';

const Mimique: React.FC = () => {
  const router = useRouter();
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);
  const [ableToPlay, setAbleToPlay] = React.useState<boolean>(false);
  const [count, setCount] = React.useState<number>(0);

  React.useMemo(() => {
    if (village) {
      axiosLoggedRequest({
        method: 'GET',
        url: `/mimiques/ableToPlay${serializeToQueryUrl({
          villageId: village.id,
        })}`,
      }).then((response) => {
        if (!response.error && response.data) {
          setAbleToPlay(response.data.ableToPlay as boolean);
          setCount(response.data.count as number);
        } else {
          setAbleToPlay(false);
        }
      });
    }
  }, [village]);

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
        <Link href="/creer-un-jeu/mimique/1">
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
          actuellement {count} nouvelles mimiques à découvrir :
        </p>
        <Link href="/creer-un-jeu/mimique/jouer">
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
            disabled={!ableToPlay}
          >
            Découvrir des mimiques
          </Button>
        </Link>
      </div>
    </Base>
  );
};

export default Mimique;
