import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import Button from '@mui/material/Button';
import { Box } from '@mui/system';

import { Base } from 'src/components/Base';
import { PageLayout } from 'src/components/PageLayout';

const Monnaie = () => {
  const router = useRouter();

  return (
    <Base>
      <PageLayout>
        <h1>Jeu de la monnaie </h1>
        <p style={{ marginBottom: '2rem' }}>
          Savez-vous qu’il existe beaucoup de types de monnaies différentes selon les pays où vous vous rendez ? En fonction du type de monnaie les
          billets et les pièces ne seront pas les mêmes. Cela veut dire qu’elles n’ont pas les mêmes dessins ou couleurs mais aussi qu’ils ne vont pas
          représenter la même somme d’argent.
        </p>
        <h1>Faites découvrir votre monnaie aux pélicopains !</h1>
        <div style={{ marginTop: '1rem' }}>
          <strong>À vous de faire découvrir la valeur de 3 objets que vous utilisez à vos pélicopains ! </strong>
          <p>
            Dans ses voyages Pélico s’est rendu compte qu’un même objet ne coûte pas le même prix dans différents pays. Il s’amuse donc à essayer de
            deviner combien coûte des objets du quotidien dans chaque pays qu’il visite. C’est le jeu qu’il vous propose de faire aujourd’hui !
          </p>
        </div>
        <Box display="flex" justifyContent="end">
          <Link href="/creer-un-jeu/objet/1" passHref>
            <Button
              component="a"
              onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                event.preventDefault();
                router.push('/creer-un-jeu/objet/1');
              }}
              href="/creer-un-jeu/objet/1"
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
        </Box>
      </PageLayout>
    </Base>
  );
};

export default Monnaie;
