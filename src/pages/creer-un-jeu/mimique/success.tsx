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
          <p className="text">{'Vos mimiques ont bien été publiées !'}</p>
          <PelicoSouriant style={{ width: '60%', height: 'auto', margin: '0 20%' }} />
          {hasMimicsAvailable ? (
            <p className="text" style={{ textDecorationLine: 'underline', margin: '0 25%' }}>
              <Link href="/" passHref>
                {"Revenir à l'accueil"}
              </Link>
            </p>
          ) : (
            <p className="text">{''}</p>
          )}
        </div>
        <div className="text-center">
          {hasMimicsAvailable ? (
            <Link href="/creer-un-jeu/mimique/jouer" passHref>
              <Button component="a" href="/creer-un-jeu/mimique/jouer" variant="outlined" color="primary">
                Découvrir les mimiques de vos Pélicopains !
              </Button>
            </Link>
          ) : (
            <Link href="/" passHref>
              <Button component="a" href="/" variant="outlined" color="primary">
                Revenir à l&apos;accueil
              </Button>
            </Link>
          )}
        </div>
      </PageLayout>
    </Base>
  );
};

export default PresentationSuccess;
