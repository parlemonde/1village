import React from 'react';

import { Base } from 'src/components/Base';
import { PageLayout } from 'src/components/PageLayout';
import { ActivityChoice } from 'src/components/activities/ActivityChoice';
import MimiqueIcon from 'src/svg/jeu/mimique.svg';
import MonnaieIcon from 'src/svg/jeu/monnaie.svg';

const activities = [
  {
    label: 'Jeu des mimiques',
    href: '/creer-un-jeu/mimique',
    icon: MimiqueIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Jeu de la monnaie',
    href: '/creer-un-jeu/monnaie',
    icon: MonnaieIcon,
    disabled: true,
    disabledText: 'Bientôt disponible',
  },
];

const Jeu = () => {
  return (
    <Base>
      <PageLayout>
        <div className="width-900">
          <h1>Choisissez le jeu auquel vous souhaitez jouer</h1>
          <p className="text" style={{ fontSize: '1rem' }}>
            Jouez avec vos Pélicopains, pour découvrir et faire découvrir certains aspects de votre vie !
          </p>
          <ActivityChoice activities={activities} />
        </div>
      </PageLayout>
    </Base>
  );
};

export default Jeu;
