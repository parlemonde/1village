import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import Button from '@mui/material/Button';
import { Box } from '@mui/system';

import { Base } from 'src/components/Base';
import { PageLayout } from 'src/components/PageLayout';

const Expression = () => {
  const router = useRouter();

  return (
    <Base>
      <PageLayout>
        <h1>Qu’est-ce qu’une expression ?</h1>
        <p style={{ marginBottom: '2rem' }}>
          Une expression est une formule toute faite qu’on utilise le plus souvent à l’oral pour commenter une situation ou exprimer un jugement. Par
          exemple, pour dire qu’il pleut beaucoup, on peut dire en français “il pleut comme vache qui pisse” alors qu’en anglais on dit “it’s raining
          cats and dogs” (il pleut des chats et des chiens).
        </p>
        <Box display="flex" justifyContent="end">
          <Link href="/creer-un-jeu/expression/1" passHref>
            <Button
              component="a"
              onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                event.preventDefault();
                router.push('/creer-un-jeu/expression/1');
              }}
              href="/creer-un-jeu/expression/1"
              color="primary"
              variant="outlined"
              style={{
                float: 'right',
              }}
              disableElevation
            >
              Créer 3 expressions
            </Button>
          </Link>
        </Box>
      </PageLayout>
    </Base>
  );
};

export default Expression;
