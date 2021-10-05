import { useRouter } from 'next/router';
import React from 'react';

import { Base } from 'src/components/Base';
import { ActivityChoice } from 'src/components/activities/ActivityChoice';
import ObjetIcon from 'src/svg/enigme/objet-mystere.svg';

const activities = [
  {
    label: 'Un drapeau',
    href: '/symbole/1?category=0',
    icon: ObjetIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Un emblème',
    href: '/symbole/1?category=1',
    icon: ObjetIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Une fleur nationale',
    href: '/symbole/1?category=2',
    icon: ObjetIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Une devise',
    href: '/symbole/1?category=3',
    icon: ObjetIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Un hymne',
    href: '/symbole/1?category=4',
    icon: ObjetIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Un animal national',
    href: '/symbole/1?category=5',
    icon: ObjetIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Une figure symbolique',
    href: '/symbole/1?category=6',
    icon: ObjetIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Une monnaie',
    href: '/symbole/1?category=7',
    icon: ObjetIcon,
    disabled: false,
    disabledText: '',
  },
];

const Symbol = () => {
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
          <h1>Quel symbole allez-vous présenter ?</h1>
          <p className="text">
            Dans cette activité, nous vous proposons de présenter à vos Pélicopains une fleur, un emblème, un hymne, un drapeau... un symbole, qui
            représente le pays ou la région dans lequel vous habitez.
          </p>
          <p className="text">
            Commencez par choisir quel type de symbole vous souhaitez présenter, ou choisissez de présenter un autre type de symbole.
          </p>
          <ActivityChoice activities={activitiesWithLinks} />
        </div>
      </div>
    </Base>
  );
};

export default Symbol;