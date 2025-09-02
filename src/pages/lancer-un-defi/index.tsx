import React from 'react';

import { Base } from 'src/components/Base';
import { PageLayout } from 'src/components/PageLayout';
import { ActivityChoice } from 'src/components/activities/ActivityChoice';
import CulinaireIcon from 'src/svg/defi/culinaire.svg';
import EcologiqueIcon from 'src/svg/defi/ecologique.svg';
import LinguistiqueIcon from 'src/svg/defi/linguistique.svg';

const activities = [
  {
    label: 'Défi linguistique',
    href: '/lancer-un-defi/linguistique/1',
    icon: LinguistiqueIcon,
    disabled: false,
    disabledText: 'Bientôt disponible',
  },
  {
    label: 'Défi culinaire',
    href: '/lancer-un-defi/culinaire/1',
    icon: CulinaireIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Défi écologique',
    href: '/lancer-un-defi/ecologique/1',
    icon: EcologiqueIcon,
    disabled: false,
    disabledText: 'Bientôt disponible',
  },
  {
    label: 'Créer un défi sur un thème libre',
    href: '/lancer-un-defi/1',
    disabled: false,
    disabledText: 'Bientôt disponible',
  },
];

const Defi = () => {
  return (
    <Base>
      <PageLayout>
        <div className="width-900">
          <h1>Choisissez le défi que vous souhaitez réaliser</h1>
          <br />
          <ActivityChoice activities={activities} />
        </div>
      </PageLayout>
    </Base>
  );
};

export default Defi;
