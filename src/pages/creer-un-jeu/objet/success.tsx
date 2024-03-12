import Link from 'next/link';
import React from 'react';

import { Base } from 'src/components/Base';
import { bgPage } from 'src/styles/variables.const';
import PelicoSouriant from 'src/svg/pelico/pelico-souriant.svg';

const PresentationSuccess = () => {
  return (
    <Base>
      <div style={{ width: '100%', maxWidth: '20rem', margin: '4rem auto', backgroundColor: bgPage, padding: '1rem', borderRadius: '10px' }}>
        <p className="text">{'Vos objets ont bien été publiés !'}</p>
        <PelicoSouriant style={{ width: '60%', height: 'auto', margin: '0 20%' }} />
        <p className="text" style={{ textDecorationLine: 'underline', margin: '0 25%' }}>
          <Link href="/" passHref>
            {"Revenir à l'accueil"}
          </Link>
        </p>
      </div>
      <p className="text" style={{ display: 'flex', justifyContent: 'center', textDecorationLine: 'underline' }}>
        <Link href="/creer-un-jeu/objet/displayList" passHref>
          {'Ou découvrez les jeux des autres Pélicopains !'}
        </Link>
      </p>
    </Base>
  );
};

export default PresentationSuccess;
