import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';

import Button from '@mui/material/Button';
import { Box } from '@mui/system';

import { Base } from 'src/components/Base';
import { PageLayout } from 'src/components/PageLayout';
import { GameContext } from 'src/contexts/gameContext';
import { GameType } from 'types/game.type';
import { PageLayout } from 'src/components/PageLayout';

const Mimique = () => {
  const router = useRouter();
  const { setGameType } = useContext(GameContext);

  useEffect(() => {
    setGameType(GameType.MIMIC);
  }, [setGameType]);

  return (
    <Base>
      <PageLayout>
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
        <Box display="flex" justifyContent="end">
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
              disableElevation
            >
              Faire découvrir 3 mimiques
            </Button>
          </Link>
        </Box>
      </PageLayout>
    </Base>
  );
};

export default Mimique;
