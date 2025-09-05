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
        <p style={{ marginBottom: '2rem' }}>
          Savez-vous qu’il existe beaucoup de monnaies différentes à travers le monde ? Selon le pays, les billets et les pièces n’ont pas les mêmes
          dessins, couleurs et ne représentent pas la même somme d’argent !
        </p>
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
