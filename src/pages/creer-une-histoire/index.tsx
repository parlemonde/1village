import { Box, Button } from '@mui/material';

import Link from 'next/link';
import React from 'react';

import { Base } from 'src/components/Base';
import { PageLayout } from 'src/components/PageLayout';

const Story = () => {
  return (
    <Base>
      <PageLayout>
        <h1>Inventer l’histoire du village-monde idéal</h1>
        <p className="text">
          1, 2, 3 fermez les yeux... Vous voilà arrivés dans votre village-monde ! Eh oui, en plus de pouvoir aller dans votre village-monde avec un
          ordinateur, vous pouvez vous y rendre avec votre imagination !
        </p>
        <p className="text">
          Ce que je vous propose pour cette activité, c’est de rendre votre village-monde idéal ! Et pour cela, pourquoi ne pas se saisir des 17
          Objectifs du Développement Durable ? Ces objectifs, les ODDs, ont été définis par toute l’humanité pour rendre le monde plus juste,
          solidaire et plus durable.
        </p>
        <p className="text">
          Pour raconter comment est votre village-monde, je vous propose donc de choisir un objectif du développement durable, un objet magique et un
          lieu extraordinaire.Vous devrez décrire l’objet et le lieu de votre village-monde puis expliquer comment cet objet vous permet d’atteindre
          l’objectif du développement durable que vous avez choisi !
        </p>
        <p className="text">
          N’hésitez pas à dessiner chacun des éléments dont vous parlez dans votre histoire afin que les pélicopains et moi puissions mieux comprendre
          comment fonctionne le village-monde.
        </p>
        <p className="text">
          Laissez libre court à votre imagination ! Souvenez-vous que si l’objectif du développement durable est bien réel, l’objet et lieu que vous
          choisissez peuvent être magiques 🙂
        </p>
      </PageLayout>
      <Box sx={{ display: 'flex', justifyContent: 'end', pr: '1rem', mb: '1rem' }}>
        <Link href="/creer-une-histoire/1" passHref>
          <Button component="a" href="/creer-une-histoire/1" variant="outlined" color="primary">
            Commencer
          </Button>
        </Link>
      </Box>
    </Base>
  );
};

export default Story;
