import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';

import Button from '@mui/material/Button';

import { Base } from 'src/components/Base';
import { GameContext } from 'src/contexts/gameContext';
import { GameType } from 'types/game.type';

const Mimique = () => {
  const router = useRouter();
  const { setGameType } = useContext(GameContext);

  useEffect(() => {
    setGameType(GameType.MIMIC);
  }, [setGameType]);

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
      </div>
    </Base>
  );
};

export default Mimique;
