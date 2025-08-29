import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';

import Button from '@mui/material/Button';
import { Box } from '@mui/system';

import { Base } from 'src/components/Base';
import { PageLayout } from 'src/components/PageLayout';
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
      <PageLayout>
        <h1>Qu’est-ce qu’une mimique ?</h1>
        <p style={{ marginBottom: '2rem' }}>
          Une mimique est un geste du corps qui exprime une émotion, une pensée et que l’on fait dans certaine situation. Par exemple, un signe des
          mains pour dire bonjour ! Ou bien, un mouvement du visage pour exprimer la colère.
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
