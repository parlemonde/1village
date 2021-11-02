import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import Button from '@material-ui/core/Button';

import { Base } from 'src/components/Base';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { serializeToQueryUrl } from 'src/utils';
import { GameType } from 'types/game.type';

const Money: React.FC = () => {
  const router = useRouter();
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);
  const [ableToPlay, setAbleToPlay] = React.useState<boolean>(false);
  const [count, setCount] = React.useState<number>(0);

  React.useMemo(() => {
    if (village) {
      axiosLoggedRequest({
        method: 'GET',
        url: `/games/ableToPlay${serializeToQueryUrl({
          villageId: village.id,
          type: GameType.MONEY,
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

  //change dynamically the name of the countries
  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem', marginTop: '2rem' }}>
        <h1>Jeu de la monnaie</h1>
        <p style={{ marginBottom: '2rem' }}>
          Savez-vous qu’il existe beaucoup de types de monnaies différentes selon les pays où vous vous rendez ? En fonction du type de monnaie les
          billets et les pièces ne seront pas les mêmes. Cela veut dire qu’elles n’ont pas les mêmes dessins ou couleurs mais aussi qu’ils ne vont pas
          représenter la même somme d’argent. Dans ses voyages Pélico s’est rendu compte qu’un même objet ne coûte pas le même prix dans différents
          pays. Il s’amuse donc à essayer de deviner combien coûte des pays du quotidien dans chaque pays qu’il visite. C’est le jeu qu’il vous
          propose de faire aujourd’hui !
        </p>
        <h1>Faites découvrir votre monnaie aux Pélicopains !</h1>
        <p style={{ marginBottom: '2rem' }}>
          À vous de faire découvrir la valeur de 3 objets que vous utilisez à vos Pélicopains ! Choisissez 4 objets avec une valeur différente (d’un
          objet très peu cher à un objet très cher). Vous pouvez prendre des objets du quotidien comme un aliment, un jouet, un livre ou encore un
          instrument de musique !
        </p>
        <Link href="/creer-un-jeu/monnaie/1">
          <Button
            component="a"
            onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
              event.preventDefault();
              router.push('/creer-un-jeu/monnaie/1');
            }}
            href="/creer-un-jeu/monnaie/1"
            color="primary"
            variant="outlined"
            style={{
              float: 'right',
            }}
            disableElevation
          >
            Faire découvrir 3 objets
          </Button>
        </Link>
        <h1 style={{ marginTop: '6rem' }}>Découvrez les monnaies de vos Pélicopains !</h1>
        <p style={{ marginBottom: '3rem' }}>
          Une fois que vous aurez décrit le prix de 4 objets, ça sera à vous de deviner le prix des objets de vos Pélicopains français et lilbanais !
          Il y a actuellement {count} nouveaux objets à découvrir :
        </p>
        <Link href="/creer-un-jeu/monnaie/jouer">
          <Button
            component="a"
            onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
              event.preventDefault();
              router.push('/creer-un-jeu/monnaie/jouer');
            }}
            href="/creer-un-jeu/monnaie/jouer"
            color="primary"
            variant="outlined"
            style={{
              float: 'right',
            }}
            disableElevation
            disabled={!ableToPlay}
          >
            Jouer
          </Button>
        </Link>
      </div>
    </Base>
  );
};

export default Money;
