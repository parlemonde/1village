import { useRouter } from 'next/router';
import React from 'react';

import { Base } from 'src/components/Base';
import { ActivityChoice } from 'src/components/activities/ActivityChoice';
import ObjetIcon from 'src/svg/enigme/objet-mystere.svg';

const activities = [
  {
    label: 'Nos paysage',
    href: '/indice-culturel/1?category=0',
    icon: ObjetIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Nos arts',
    href: '/indice-culturel/1?category=1',
    icon: ObjetIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Nos lieux de vies',
    href: '/indice-culturel/1?category=2',
    icon: ObjetIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Nos langues',
    href: '/indice-culturel/1?category=3',
    icon: ObjetIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Notre flore et faune',
    href: '/indice-culturel/1?category=4',
    icon: ObjetIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Nos loisirs et jeux',
    href: '/indice-culturel/1?category=5',
    icon: ObjetIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Nos cuisines',
    href: '/indice-culturel/1?category=6',
    icon: ObjetIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Nos traditions',
    href: '/indice-culturel/1?category=7',
    icon: ObjetIcon,
    disabled: false,
    disabledText: '',
  },
];

const Indice = () => {
  const router = useRouter();

  const [activitiesWithLinks] = React.useMemo(() => {
    if ('responseActivityId' in router.query && 'responseActivityType' in router.query) {
      return [
        activities.map((a) => ({
          ...a,
          href: `${a.href}&responseActivityId=${router.query.responseActivityId}&responseActivityType=${router.query.responseActivityType}`,
        })),
      ];
    }
    return [activities];
  }, [router.query]);

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
          <ActivityChoice activities={activitiesWithLinks} />
        </div>
      </div>
    </Base>
  );
};

export default Indice;
