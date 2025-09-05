import React from 'react';

import { Base } from 'src/components/Base';
import { PageLayout } from 'src/components/PageLayout';
import { ActivityChoice } from 'src/components/activities/ActivityChoice';
import ArtIcon from 'src/svg/indice-culturel/art.svg';
import CuisineIcon from 'src/svg/indice-culturel/cuisine.svg';
import FloreFauneIcon from 'src/svg/indice-culturel/flore-faune.svg';
import LanguesIcon from 'src/svg/indice-culturel/langues.svg';
import LieuxIcon from 'src/svg/indice-culturel/lieux-de-vie.svg';
import LoisirsJeuxIcon from 'src/svg/indice-culturel/loisirs-jeux.svg';
import PaysagesIcon from 'src/svg/indice-culturel/paysages.svg';
import TraditionIcon from 'src/svg/indice-culturel/tradition.svg';

const reportages = [
  {
    label: 'Nos paysages',
    href: '/realiser-un-reportage/1?category=0',
    icon: PaysagesIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Nos arts',
    href: '/realiser-un-reportage/1?category=1',
    icon: ArtIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Nos lieux de vies',
    href: '/realiser-un-reportage/1?category=2',
    icon: LieuxIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Notre école',
    href: '/realiser-un-reportage/1?category=3',
    icon: LanguesIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Notre flore et faune',
    href: '/realiser-un-reportage/1?category=4',
    icon: FloreFauneIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Nos loisirs et jeux',
    href: '/realiser-un-reportage/1?category=5',
    icon: LoisirsJeuxIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Nos cuisines',
    href: '/realiser-un-reportage/1?category=6',
    icon: CuisineIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Nos traditions',
    href: '/realiser-un-reportage/1?category=7',
    icon: TraditionIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Créer un reportage sur un autre thème',
    href: '/realiser-un-reportage/1?category=-1',
    icon: null,
    disabled: false,
    disabledText: '',
  },
];

const Reportage = () => {
  return (
    <Base>
      <PageLayout>
        <div className="width-900">
          <h1 style={{ marginTop: '0.5rem' }}>Sur quel thème souhaitez-vous réaliser votre reportage ?</h1>
          <br />
          <ActivityChoice activities={reportages} />
        </div>
      </PageLayout>
    </Base>
  );
};

export default Reportage;
