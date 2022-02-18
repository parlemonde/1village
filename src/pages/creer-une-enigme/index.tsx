import React from 'react';

import { Base } from 'src/components/Base';
import { ActivityChoice } from 'src/components/activities/ActivityChoice';
import EvenementIcon from 'src/svg/enigme/evenement-mystere.svg';
import LocationIcon from 'src/svg/enigme/location.svg';
import ObjetIcon from 'src/svg/enigme/objet-mystere.svg';
import PersonaliteIcon from 'src/svg/enigme/personalite-mystere.svg';

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
    label: 'Personnalité mystère',
    href: '/creer-une-enigme/1?category=2',
    icon: PersonaliteIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Lieu mystère',
    href: '/creer-une-enigme/1?category=3',
    icon: LocationIcon,
    disabled: false,
    disabledText: '',
  },
  {
    label: 'Créer une énigme sur un autre thème',
    href: '/creer-une-enigme/1?category=-1',
    icon: null,
    disabled: false,
    disabledText: '',
  },
];

const Enigme = () => {
  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <div className="width-900">
          <h1>Qu&apos;allez vous faire deviner à vos Pélicopains ?</h1>
          <div className="width-900" style={{ margin: '2rem 0' }}>
            <span>Dans cette activité, vous allez créer une énigme pour faire deviner ...</span>
          </div>

          <ActivityChoice activities={activities} />
        </div>
      </div>
    </Base>
  );
};

export default Enigme;
