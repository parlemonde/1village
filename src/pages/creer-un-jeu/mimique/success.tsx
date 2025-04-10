/* eslint-disable @next/next/no-html-link-for-pages */
import React from 'react';

import { Base } from 'src/components/Base';
import { PageLayout } from 'src/components/PageLayout';
import { bgPage } from 'src/styles/variables.const';
import PelicoSouriant from 'src/svg/pelico/pelico-souriant.svg';

const PresentationSuccess = () => {
  return (
    <Base>
      <PageLayout>
        <div style={{ width: '100%', maxWidth: '20rem', margin: '4rem auto', backgroundColor: bgPage, padding: '1rem', borderRadius: '10px' }}>
          <p style={{ paddingLeft: '20px' }} className="text">
            {'Vos mimiques ont bien été publiées !'}
          </p>
          <PelicoSouriant style={{ width: '60%', height: 'auto', margin: '0 20%' }} />
          <p className="text" style={{ textDecorationLine: 'underline', margin: '0 25%' }}>
            <a href="/">{"Revenir à l'accueil"}</a>
          </p>
        </div>
        <p className="text" style={{ display: 'flex', justifyContent: 'center', textDecorationLine: 'underline' }}>
          <a href="/creer-un-jeu/mimique/displayList">{'Ou découvrez les jeux des autres pélicopains !'}</a>
        </p>
      </PageLayout>
    </Base>
  );
};

export default PresentationSuccess;
