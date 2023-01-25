import React from 'react';

import { Base } from 'src/components/Base';
import { ActivityChoice } from 'src/components/activities/ActivityChoice';
import CulinaireIcon from 'src/svg/defi/culinaire.svg';
import EcologiqueIcon from 'src/svg/defi/ecologique.svg';
import LinguistiqueIcon from 'src/svg/defi/linguistique.svg';

const activities = [
  {
    label: 'Défi linguistique',
    href: '/lancer-un-defi/linguistique/1',
    icon: LinguistiqueIcon,
    disabled: true,
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
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <div className="width-900">
          <h1>Choisissez le défi que vous souhaitez réaliser</h1>
          <p className="text" style={{ fontSize: '1rem' }}>
            {'Dans cette activité, nous vous proposons de lancer un défi aux Pélicopains. Cela peut être un défi linguistique, culinaire ou même '}
            écologique. Par exemple, vous pouvez partager une action en vous filmant en train de la réaliser et ensuite demander aux autres classes de
            la réaliser à leur tour !
          </p>
          <ActivityChoice activities={activities} />
        </div>
      </div>
    </Base>
  );
};

export default Defi;
