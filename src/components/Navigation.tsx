import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import Button from '@material-ui/core/Button';

// import { UserContext } from 'src/contexts/userContext';
import AgendaIcon from 'src/svg/navigation/agenda-icon.svg';
import GameIcon from 'src/svg/navigation/game-icon.svg';
import HomeIcon from 'src/svg/navigation/home-icon.svg';
import IndiceIcon from 'src/svg/navigation/indice-culturel.svg';
import KeyIcon from 'src/svg/navigation/key-icon.svg';
import Map from 'src/svg/navigation/map.svg';
import QuestionIcon from 'src/svg/navigation/question-icon.svg';
import TargetIcon from 'src/svg/navigation/target-icon.svg';
import UserIcon from 'src/svg/navigation/user-icon.svg';

// import { UserType } from 'types/user.type';

interface Tab {
  label: string;
  path: string;
  icon: React.ReactNode;
  disabled: boolean;
}

const tabs: Tab[] = [
  {
    label: 'Accueil',
    path: '/',
    icon: <HomeIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
    disabled: false,
  },
  {
    label: 'Se présenter',
    path: '/se-presenter',
    icon: <UserIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
    disabled: false,
  },
  {
    label: 'Présenter un indice culturel',
    path: '/indice-culturel',
    icon: <IndiceIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
    disabled: false,
  },
  {
    label: 'Créer une énigme',
    path: '/creer-une-enigme',
    icon: <KeyIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
    disabled: false,
  },
  {
    label: 'Lancer un défi',
    path: '/lancer-un-defi',
    icon: <TargetIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
    disabled: false,
  },
  {
    label: 'Poser une question',
    path: '/poser-une-question',
    icon: <QuestionIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
    disabled: false,
  },
  {
    label: 'Créer un jeu',
    path: '/creer-un-jeu',
    icon: <GameIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
    disabled: true,
  },
  {
    label: 'Voir mes activités',
    path: '/mes-activites',
    icon: <AgendaIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
    disabled: false,
  },
];

export const Navigation = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = React.useState(-1);
  // const { user } = React.useContext(UserContext);
  // const isModerateur = user !== null && user.type >= UserType.MEDIATOR;

  React.useEffect(() => {
    let index = tabs.findIndex((tab) => tab.path.split('/')[1] === router.pathname.split('/')[1]);
    if (router.pathname.split('/')[1] === 'activity') {
      index = 0;
    }
    setSelectedTab(index);
  }, [router.pathname]);

  return (
    <nav className="navigation">
      <div style={{ position: 'relative' }}>
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
              <Link key={tab.path} href={tab.path} passHref>
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
                  disabled={tab.disabled}
                >
                  {tab.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
        <Link href="/cgu">
          <a className="navigation__cgu-link text text--small">{"Conditions générales d'utilisation"}</a>
        </Link>
      </div>
    </nav>
  );
};
