import React from 'react';

import { Base } from 'src/components/Base';
import { PageLayout } from 'src/components/PageLayout';
import { ActivityChoice } from 'src/components/activities/ActivityChoice';
import ExpressionIcon from 'src/svg/jeu/expression.svg';
import MimiqueIcon from 'src/svg/jeu/mimique.svg';
import MonnaieIcon from 'src/svg/jeu/monnaie.svg';
import { GameType } from 'types/game.type';

const activities = [
  {
    label: 'Jeu des mimiques',
    href: '/creer-un-jeu/mimique',
    icon: MimiqueIcon,
    gameType: GameType.MIMIC,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Jeu de la monnaie',
    href: '/creer-un-jeu/objet',
    icon: MonnaieIcon,
    gameType: GameType.MONEY,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Jeu des expressions',
    href: '/creer-un-jeu/expression',
    icon: ExpressionIcon,
    gameType: GameType.EXPRESSION,
    disabled: false,
    disabledText: '',
  },
];

const Jeu = () => {
  return (
    <Base>
      <PageLayout>
        <div className="width-900">
          <h1>Choisissez le jeu que vous souhaitez créer</h1>
          <ActivityChoice activities={activities} />
        </div>
      </PageLayout>
    </Base>
  );
};

export default Jeu;
