import { Box } from '@mui/material';
import React from 'react';

import AnimalNationalIcon from '../../svg/symbole/animal-national.svg';
import DeviseIcon from '../../svg/symbole/devise.svg';
import DrapeauIcon from '../../svg/symbole/drapeau.svg';
import EmblemeIcon from '../../svg/symbole/embleme.svg';
import FigureSymboliqueIcon from '../../svg/symbole/figure-symbolique.svg';
import FleurNationaleIcon from '../../svg/symbole/fleur-nationale.svg';
import HymneIcon from '../../svg/symbole/hymne.svg';
import MonnaieIcon from '../../svg/symbole/monnaie.svg';
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
  {
    label: 'Un drapeau',
    href: '/indice-culturel/1?category=8',
    icon: DrapeauIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Un emblème',
    href: '/indice-culturel/1?category=9',
    icon: EmblemeIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Une fleur nationale',
    href: '/indice-culturel/1?category=10',
    icon: FleurNationaleIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Une devise',
    href: '/indice-culturel/1?category=11',
    icon: DeviseIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Un hymne',
    href: '/indice-culturel/1?category=12',
    icon: HymneIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Un animal national',
    href: '/indice-culturel/1?category=13',
    icon: AnimalNationalIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Une figure symbolique',
    href: '/indice-culturel/1?category=14',
    icon: FigureSymboliqueIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Une monnaie',
    href: '/indice-culturel/1?category=15',
    icon: MonnaieIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Présenter un autre indice',
    href: '/indice-culturel/1?category=-1',
    icon: null,
    disabled: false,
    disabledText: '',
  },
];

const Indice = () => {
  return (
    <Base>
      <Box
        sx={{
          width: '100%',
          padding: {
            xs: '0',
            md: '0.5rem 1rem 1rem 1rem',
          },
        }}
      >
        <div className="width-900">
          <h1 style={{ marginTop: '0.5rem' }}>Quel aspect de culture allez-vous présenter ?</h1>
          <p className="text">
            Dans cette activité, nous vous proposons de présenter à vos pélicopains un paysage, un hymne, une danse, un emblème, un vêtement... un
            indice qui représente le pays ou la région dans lequel vous habitez.
          </p>
          <p className="text">
            Commencez par choisir quel type d&apos;indice vous souhaitez présenter, ou choisissez de présenter un autre type d&apos;indice.
          </p>
          <ActivityChoice activities={indices} />
        </div>
      </Box>
    </Base>
  );
};

export default Indice;
