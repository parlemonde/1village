import React from 'react';

import { Base } from 'src/components/Base';
import { ActivityChoice } from 'src/components/activities/ActivityChoice';
import ArtIcon from 'src/svg/indice-culturel/art.svg';
import CuisineIcon from 'src/svg/indice-culturel/cuisine.svg';
import FloreFauneIcon from 'src/svg/indice-culturel/flore-faune.svg';
import LanguesIcon from 'src/svg/indice-culturel/langues.svg';
import LieuxIcon from 'src/svg/indice-culturel/lieux-de-vie.svg';
import LoisirsJeuxIcon from 'src/svg/indice-culturel/loisirs-jeux.svg';
import PaysagesIcon from 'src/svg/indice-culturel/paysages.svg';
import TraditionIcon from 'src/svg/indice-culturel/tradition.svg';

const indices = [
  {
    label: 'Nos paysages',
    href: '/indice-culturel/1?category=0',
    icon: PaysagesIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Nos arts',
    href: '/indice-culturel/1?category=1',
    icon: ArtIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Nos lieux de vies',
    href: '/indice-culturel/1?category=2',
    icon: LieuxIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Nos langues',
    href: '/indice-culturel/1?category=3',
    icon: LanguesIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Notre flore et faune',
    href: '/indice-culturel/1?category=4',
    icon: FloreFauneIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Nos loisirs et jeux',
    href: '/indice-culturel/1?category=5',
    icon: LoisirsJeuxIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Nos cuisines',
    href: '/indice-culturel/1?category=6',
    icon: CuisineIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Nos traditions',
    href: '/indice-culturel/1?category=7',
    icon: TraditionIcon,
    disabled: false,
    disabledText: '',
  },
];

const Indice = () => {
  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <div className="width-900">
          <h1>Quel aspect de culture allez-vous présenter ?</h1>
          <p className="text">
            Dans cette activité, nous vous proposons de présenter à vos Pélicopains un paysage, une danse, un vêtement, une musique... un indice
            culturel, qui représnte le pays ou la région dans lequel vous habitez.
          </p>
          <p className="text">
            Commencez par choisir quel type d&apos;indice culturel vous souhaitez présenter, ou choisissez de présenter un autre type d&apos;indice
            culturel.
          </p>
          <ActivityChoice activities={indices} />
        </div>
      </div>
    </Base>
  );
};

export default Indice;
