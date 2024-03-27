import Link from 'next/link';
import React from 'react';

import { Button } from '@mui/material';

import { Base } from 'src/components/Base';

const Story = () => {
  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <h1>Inventer l’histoire du village-idéal</h1>
        <p className="text">
          Comme vous le savez déjà, les Olympiades de Pélico ont commencé et elles ont lieu dans le village-idéal, l’endroit où tout est possible…
          C’est en parcourant le ciel à la quête d’un lieu pour les OP qu’un nuage mystérieux m’a attiré vers cet endroit magique !
        </p>
        <p className="text">
          1, 2, 3 fermez les yeux... Et <strong>vous voilà arrivés dans notre village idéal !</strong> Même si les OP en ce moment ont lieu, il faut
          tout de même travailler à rendre cet endroit idéal... et pour cela, pourquoi ne pas se saisir des 17 objectifs du développement durable ?
          Ces objectifs, les ODDs, ont été définis par toute l’humanité pour rendre le monde plus juste, solidaire et plus durable.
        </p>
        <p className="text">
          Pour raconter l’histoire du village-idéal, je vous propose donc de choisir un objectif du développement durable, un objet magique et
          d’imaginer à quoi ressemble le village-idéal, ce lieu extraordinaire.
          <strong>
            Vous devrez décrire l’objet magique ainsi que le village-idéal, puis expliquer comment cet objet nous permet d’atteindre l’objectif du
            développement durable que vous avez choisi !
          </strong>
        </p>
        <p className="text">
          N’hésitez pas à dessiner chacun des éléments dont vous parlez dans votre histoire afin que les pélicopains et moi puissions mieux comprendre
          comment fonctionne le village-idéal.
        </p>
        <p className="text">
          Laissez libre court à votre imagination ! Souvenez-vous que si l’objectif du développement durable est bien réel, l’objet et lieu que vous
          choisissez pour l’atteindre sont magiques 🙂
        </p>
      </div>
      <Link href="/creer-une-histoire/1" passHref>
        <Button
          component="a"
          href="/creer-une-histoire/1"
          variant="outlined"
          color="primary"
          style={{
            float: 'right',
            marginBottom: '3rem',
          }}
        >
          Commencer
        </Button>
      </Link>
    </Base>
  );
};

export default Story;
