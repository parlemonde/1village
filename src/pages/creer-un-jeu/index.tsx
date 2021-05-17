import { useRouter } from 'next/router';
import React from 'react';

import { Base } from 'src/components/Base';
import { SuggestionCarousel } from 'src/components/SuggestionCarousel';
import { ActivityChoice } from 'src/components/activities/ActivityChoice';
import MimiqueIcon from 'src/svg/jeu/mimique.svg';
import MonnaieIcon from 'src/svg/jeu/monnaie.svg';

const suggestions = [
  {
    title: 'Jeu des mimiques',
    button: 'Mimique',
    href: '/creer-un-jeu/mimique',
    text: 'Jouez aux mimiques !',
    icon: MimiqueIcon,
    disabled: false,
  }
];

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
  }
];

const Jeu: React.FC = () => {
  const router = useRouter();

  const [activitiesWithLinks, suggestionsWithLinks] = React.useMemo(() => {
    if ('responseActivityId' in router.query && 'responseActivityType' in router.query) {
      return [
        activities.map((a) => ({
          ...a,
          href: `${a.href}?responseActivityId=${router.query.responseActivityId}&responseActivityType=${router.query.responseActivityType}`,
        })),
        suggestions.map((s) => ({
          ...s,
          href: `${s.href}?responseActivityId=${router.query.responseActivityId}&responseActivityType=${router.query.responseActivityType}`,
        })),
      ];
    }
    return [activities, suggestions];
  }, [router.query]);

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <div className="width-900">
          <h1>{"Suggestions d'activités"}</h1>
          <div style={{ padding: '1rem', textAlign: 'center' }}>
            <SuggestionCarousel suggestions={suggestionsWithLinks} />
          </div>
          <h1>Choisissez le défi que vous souhaitez réaliser</h1>
          <p className="text" style={{ fontSize: '1rem' }}>
            {'Dans cette activité, nous vous proposons de lancer un défi aux Pélicopains. Cela peut être un défi linguistique, culinaire ou même '}
            écologique. Par exemple, vous pouvez partager une action en vous filmant en train de la réaliser et ensuite demander aux autres classes de
            la réaliser à leur tour !
          </p>
          <ActivityChoice activities={activitiesWithLinks} />
        </div>
      </div>
    </Base>
  );
};

export default Jeu;
