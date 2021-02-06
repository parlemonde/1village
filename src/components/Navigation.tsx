import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import Button from '@material-ui/core/Button';

import AgendaIcon from 'src/svg/navigation/agenda-icon.svg';
import GameIcon from 'src/svg/navigation/game-icon.svg';
import HomeIcon from 'src/svg/navigation/home-icon.svg';
import KeyIcon from 'src/svg/navigation/key-icon.svg';
import Map from 'src/svg/navigation/map.svg';
import QuestionIcon from 'src/svg/navigation/question-icon.svg';
import TargetIcon from 'src/svg/navigation/target-icon.svg';
import UserIcon from 'src/svg/navigation/user-icon.svg';

interface Tab {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  {
    label: 'Accueil',
    path: '/',
    icon: <HomeIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
  },
  {
    label: 'Se présenter',
    path: '/se-presenter',
    icon: <UserIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
  },
  {
    label: 'Créer une énigme',
    path: '/creer-une-enigme',
    icon: <KeyIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
  },
  {
    label: 'Lancer un défi',
    path: '/lancer-un-defi',
    icon: <TargetIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
  },
  {
    label: 'Poser une question',
    path: '/poser-une-question',
    icon: <QuestionIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
  },
  {
    label: 'Créer un jeu',
    path: '/creer-un-jeu',
    icon: <GameIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
  },
  {
    label: 'Mes activités',
    path: '/mes-activites',
    icon: <AgendaIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
  },
];

export const Navigation: React.FC = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = React.useState(-1);

  React.useEffect(() => {
    const index = tabs.findIndex((tab) => tab.path.split('/')[1] === router.pathname.split('/')[1]);
    setSelectedTab(index);
  }, [router.pathname]);

  return (
    <nav className="navigation">
      <div className="navigation__content with-shadow">
        <div style={{ padding: '10% 15%', position: 'relative' }}>
          <Map width="100%" height="100%" />
          <div className="absolute-center">
            <Button className="navigation__button" color="primary" variant="contained">
              Voir sur la carte
            </Button>
          </div>
        </div>
        <div style={{ padding: '0 5%', position: 'relative' }}>
          {tabs.map((tab, index) => (
            <Link key={tab.path} href={tab.path} prefetch={false}>
              <Button
                component="a"
                onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                  event.preventDefault();
                  router.push(tab.path);
                }}
                href={tab.path}
                color="primary"
                startIcon={tab.icon}
                variant={index === selectedTab ? 'contained' : 'outlined'}
                className="navigation__button full-width"
                style={{
                  justifyContent: 'flex-start',
                  paddingRight: '0.1rem',
                  marginBottom: '0.4rem',
                  width: index === selectedTab ? '112%' : '100%',
                }}
                disableElevation
              >
                {tab.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};
