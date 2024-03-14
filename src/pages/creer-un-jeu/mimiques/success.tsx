/* eslint-disable @next/next/no-html-link-for-pages */
import React from 'react';

import { Base } from 'src/components/Base';
import { bgPage } from 'src/styles/variables.const';
import PelicoSouriant from 'src/svg/pelico/pelico-souriant.svg';

const PresentationSuccess = () => {
  return (
    <Base>
      <div style={{ width: '100%', maxWidth: '20rem', margin: '4rem auto', backgroundColor: bgPage, padding: '1rem', borderRadius: '10px' }}>
        <p className="text">{'Vos mimiques ont bien été publiées !'}</p>
        <PelicoSouriant style={{ width: '60%', height: 'auto', margin: '0 20%' }} />
        <p className="text" style={{ textDecorationLine: 'underline', margin: '0 25%' }}>
          <a href="/">{"Revenir à l'accueil"}</a>
        </p>
      </div>
      <p className="text" style={{ display: 'flex', justifyContent: 'center', textDecorationLine: 'underline' }}>
        <a href="/creer-un-jeu/mimiques/displayList">{'Ou découvrez les jeux des autres Pélicopains !'}</a>
      </p>
    </Base>
  );
};

export default PresentationSuccess;
