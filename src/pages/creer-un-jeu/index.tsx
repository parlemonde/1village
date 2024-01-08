import React from 'react';

import { Base } from 'src/components/Base';
import { ActivityChoice } from 'src/components/activities/ActivityChoice';
import ExpressionIcon from 'src/svg/jeu/expression.svg';
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
    disabled: false,
    disabledText: 'Bientôt disponible',
  },
  {
    label: "Jeu de l'expression",
    href: '/creer-un-jeu/expression',
    icon: ExpressionIcon,
    disabled: false,
    disabledText: 'Bientôt disponible',
  },
];

const Jeu = () => {
  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <div className="width-900">
          <h1>Choisissez le jeu auquel vous souhaitez jouer</h1>
          <p className="text" style={{ fontSize: '1rem' }}>
            Jouez avec vos Pélicopains, pour découvrir et faire découvrir certains aspects de votre vie !
          </p>
          <ActivityChoice activities={activities} />
        </div>
      </div>
    </Base>
  );
};

export default Jeu;
