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
          Une expression est une formule toute faite qu’on utilise le plus souvent à l’oral pour commenter une situation, ou exprimer un jugement.
          Pelico aime beaucoup les expressions, car elles sont souvent très imagées... En voyageant, Pelico a remarqué que ces images sont parfois les
          mêmes d’une langue à l’autre, et parfois très différentes. Par exemple, pour dire qu’il pleut beaucoup, on peut dire en français “il pleut
          comme vache qui pisse” ... alors qu’en anglais on dit “it’s raining cats and dogs” (il pleut des chats et des chiens)
        </p>
        <h1>Faites découvrir vos expressions aux Pélicopains !</h1>
        <div style={{ marginTop: '1rem' }}>
          <strong>À vous de faire découvrir 3 expressions imagées que vous utilisez à vos Pélicopains !</strong>
          <p>
            Vous pourrez d’abord choisir la langue dans laquelle l’expression existe. À chaque étape, vous pourrez ensuite mettre en ligne un dessin
            illustrant l’expression, et sa signification. Pour pimenter le jeu, à chaque étape vous devrez également inventer deux significations
            fausses … à vos Pélicopains de deviner ce que signifie réellement vos expressions !
          </p>
        </div>
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
