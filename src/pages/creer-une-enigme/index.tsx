import { useRouter } from 'next/router';
import React from 'react';

import { Base } from 'src/components/Base';
import { SuggestionCarousel } from 'src/components/SuggestionCarousel';
import { ActivityChoice } from 'src/components/activities/ActivityChoice';
import EvenementIcon from 'src/svg/enigme/evenement-mystere.svg';
import ObjetIcon from 'src/svg/enigme/objet-mystere.svg';
import PersonaliteIcon from 'src/svg/enigme/personalite-mystere.svg';

const suggestions = [
  {
    title: 'Objet mystère',
    button: 'Objet',
    href: '/creer-une-enigme/1?category=0',
    text: 'Créez une énigme sur un objet mystère !',
    imageUrl: '/static-images/objet-mystere.png',
    disabled: false,
  },
  {
    title: 'Événement mystère',
    button: 'Événement',
    href: '/creer-une-enigme/1?category=1',
    text: 'Créez une énigme sur un événement mystère !',
    icon: EvenementIcon,
    disabled: false,
  },
  {
    title: 'Personalité mystère',
    button: 'Personalité',
    href: '/creer-une-enigme/1?category=2',
    text: 'Créez une énigme sur une personalité mystère !',
    icon: PersonaliteIcon,
    disabled: false,
  },
];

const activities = [
  {
    label: 'Objet mystère',
    href: '/creer-une-enigme/1?category=0',
    icon: ObjetIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Événement mystère',
    href: '/creer-une-enigme/1?category=1',
    icon: EvenementIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Personalité mystère',
    href: '/creer-une-enigme/1?category=2',
    icon: PersonaliteIcon,
    disabled: false,
    disabledText: '',
  },
];

const Enigme: React.FC = () => {
  const router = useRouter();

  const [activitiesWithLinks, suggestionsWithLinks] = React.useMemo(() => {
    if ('responseActivityId' in router.query && 'responseActivityType' in router.query) {
      return [
        activities.map((a) => ({
          ...a,
          href: `${a.href}&responseActivityId=${router.query.responseActivityId}&responseActivityType=${router.query.responseActivityType}`,
        })),
        suggestions.map((s) => ({
          ...s,
          href: `${s.href}&responseActivityId=${router.query.responseActivityId}&responseActivityType=${router.query.responseActivityType}`,
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
          <h1>Choisissez votre énigme</h1>
          <ActivityChoice activities={activitiesWithLinks} />
        </div>
      </div>
    </Base>
  );
};

export default Enigme;
