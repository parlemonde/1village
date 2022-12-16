import { Button } from '@mui/material';
import Link from 'next/link';
import React from 'react';

import { Base } from 'src/components/Base';

const Story = () => {
  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <h1>Inventer votre histoire du village idéal</h1>
        <p className="text">Comme vous le savez déjà, je suis parti pour un long voyage autour du monde en novembre.</p>
        <p className="text">
          En parcourant le ciel à tire d’ailes, un nuage mystérieux m’a attiré et me voilà depuis plusieurs mois sur la toile à échanger avec vous,
          mes chers Pélicopains et Pélicopines.
        </p>
        <p className="text">
          Quel bonheur depuis, de découvrir votre culture et votre quotidien à travers vos questions, reportages, énigmes et défis !
        </p>
        <p className="text">
          Afin de fêter la fin de cette belle aventure, je vous propose de me rejoindre, vous et votre mascotte, dans mon monde imaginaire, afin de
          bâtir tous ensemble notre village idéal.
        </p>
        <p className="text">
          1, 2, 3 fermez les yeux... Et <strong>vous voilà arrivés dans notre village idéal.</strong> Je vous accueille chaleureusement et vous fait
          faire la visite !
        </p>
        <p className="text">
          J’ai beaucoup travaillé à rendre cet endroit idéal... et pour cela, je me suis attelé à réaliser les 17 objectifs du développement durable.
          (les ODDs) défini par toute l’humanité pour rendre le monde plus juste, solidaire et plus durable.
        </p>
        <p className="text">
          Pendant cette visite, je vous présente notamment un <strong>objet magique</strong> et un <strong>lieu extraodinaire</strong> qui nous ont
          permis d’atteindre <strong>un des 17 ODDs</strong> avec succès !<br></br>À présent, à votre tour de{' '}
          <strong>raconter cette visite inoubliable à vos Pélicopains !</strong>
        </p>
        <p className="text">
          Pour vous guider, je vous propose de commencer par choisir, décrire et dessiner un objet magique, un lieu extraordinaire et un des 17 ODDs
          de votre choix.
        </p>
        <p className="text">
          Laissez libre court à votre imagination ! Souvenez-vous que si l’objectif du développement durable est bien réel, l’objet et lieu que vous
          choisissez pour l’atteindre sont magiques !
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
