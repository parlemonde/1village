import { useRouter } from 'next/router';
import React from 'react';

import { Base } from 'src/components/Base';
import { SuggestionCarousel } from 'src/components/SuggestionCarousel';
import { ActivityChoice } from 'src/components/activities/ActivityChoice';
import CulinaireIcon from 'src/svg/defi/culinaire.svg';
import EcologiqueIcon from 'src/svg/defi/ecologique.svg';
import LinguistiqueIcon from 'src/svg/defi/linguistique.svg';

const suggestions = [
  {
    title: 'Défi linguistique',
    button: 'Linguistique',
    href: '/lancer-un-defi/linguistique/1',
    text: 'Créez une défi linguistique !',
    icon: LinguistiqueIcon,
    disabled: true,
  },
  {
    title: 'Défi culinaire',
    button: 'Culinaire',
    href: '/lancer-un-defi/culinaire/1',
    text: 'Créez une défi culinaire !',
    icon: CulinaireIcon,
    disabled: false,
  },
  {
    title: 'Défi écologique',
    button: 'Écologique',
    href: '/lancer-un-defi/ecologique/1',
    text: 'Créez une défi écologique !',
    icon: EcologiqueIcon,
    disabled: false,
  },
];

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
];

const Defi: React.FC = () => {
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
            Dans cette activité, nous vous proposons de lancer un défi aux Pélicopains. C'est peut être un défi linguistique, culinaire ou même
            écologique. Par exemple, vous pouvez partager une action en vous filmant en train de la réaliser et ensuite demander aux autres classes de
            la réaliser à leur tour !
          </p>
          <ActivityChoice activities={activitiesWithLinks} />
        </div>
      </div>
    </Base>
  );
};

export default Defi;
