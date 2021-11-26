import { useRouter } from 'next/router';
import React from 'react';

import { Base } from 'src/components/Base';
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
  const router = useRouter();

  const [activitiesWithLinks] = React.useMemo(() => {
    if ('responseActivityId' in router.query && 'responseActivityType' in router.query) {
      return [
        activities.map((a) => ({
          ...a,
          href: `${a.href}?responseActivityId=${router.query.responseActivityId}&responseActivityType=${router.query.responseActivityType}`,
        })),
      ];
    }
    return [activities];
  }, [router.query]);

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <div className="width-900">
          <h1>Choisissez le jeu auquel vous souhaitez jouer</h1>
          <p className="text" style={{ fontSize: '1rem' }}>
            Jouez avec vos Pélicopains, pour découvrir et faire découvrir certains aspects de votre vie !
          </p>
          <ActivityChoice activities={activitiesWithLinks} />
        </div>
      </div>
    </Base>
  );
};

export default Jeu;
