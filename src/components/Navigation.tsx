import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';

import Switch from '@mui/material/Switch';
import { Button } from '@mui/material';

import { Flag } from 'src/components/Flag';
import { Modal } from 'src/components/Modal';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { useVillageRequests } from 'src/services/useVillages';
import FreeContentIcon from 'src/svg/navigation/free-content-icon.svg';
import GameIcon from 'src/svg/navigation/game-icon.svg';
import HomeIcon from 'src/svg/navigation/home-icon.svg';
import IndiceIcon from 'src/svg/navigation/indice-culturel.svg';
import KeyIcon from 'src/svg/navigation/key-icon.svg';
import QuestionIcon from 'src/svg/navigation/question-icon.svg';
import ReactionIcon from 'src/svg/navigation/reaction-icon.svg';
import ReportageIcon from 'src/svg/navigation/reportage-icon.svg';
import SymbolIcon from 'src/svg/navigation/symbol-icon.svg';
import TargetIcon from 'src/svg/navigation/target-icon.svg';
import UserIcon from 'src/svg/navigation/user-icon.svg';
import type { Country } from 'types/country.type';
import { UserType } from 'types/user.type';

import { AvatarImg } from './Avatar';

interface Tab {
  label: string;
  path: string;
  icon: React.ReactNode;
  phase?: number;
}

const ACCUEIL: Tab = {
  label: 'Accueil',
  path: '/',
  icon: <HomeIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
};
const FREE_CONTENT: Tab = {
  label: 'Publier un contenu libre',
  path: '/contenu-libre',
  icon: <FreeContentIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
};

// check color of icons
const TABS_PER_PHASE: Tab[] = [
  // ---- PHASE 1 ----
  {
    label: 'Présenter un indice culturel',
    path: '/indice-culturel',
    icon: <IndiceIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
    phase: 1,
  },
  {
    label: 'Présenter un symbole',
    path: '/symbole',
    icon: <SymbolIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
    phase: 1,
  },
  {
    label: 'Poser une question',
    path: '/poser-une-question/1',
    icon: <QuestionIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
    phase: 1,
  },
  // ---- PHASE 2 ----
  {
    label: 'Réaliser un reportage',
    path: '/realiser-un-reportage',
    icon: <ReportageIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
    phase: 2,
  },
  {
    label: 'Lancer un défi',
    path: '/lancer-un-defi',
    icon: <TargetIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
    phase: 2,
  },
  {
    label: 'Jouer ensemble',
    path: '/creer-un-jeu',
    icon: <GameIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
    phase: 2,
  },
  {
    label: 'Créer une énigme',
    path: '/creer-une-enigme',
    icon: <KeyIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
    phase: 2,
  },
  {
    label: 'Poser une question',
    path: '/poser-une-question/1',
    icon: <QuestionIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
    phase: 2,
  },
  {
    label: 'Réagir à une activité',
    path: '/reagir-a-une-activite/1',
    icon: <ReactionIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
    phase: 2,
  },
  // ---- PHASE 3 ----
  {
    label: 'Jouer ensemble',
    path: '/creer-un-jeu',
    icon: <GameIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
    phase: 3,
  },
];

export const Navigation = (): JSX.Element => {
  const router = useRouter();
  const { village, selectedPhase } = React.useContext(VillageContext);
  const { user } = React.useContext(UserContext);
  const isModerateur = user !== null && user.type >= UserType.MEDIATOR;
  const { editVillage } = useVillageRequests();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const fixedTabs = React.useMemo(
    () => [
      ACCUEIL,
      {
        label: 'Notre classe',
        path: '/ma-classe',
        icon:
          user && user.avatar ? <AvatarImg user={user} size="extra-small" noLink /> : <UserIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
      },
      ...(isModerateur ? [FREE_CONTENT] : []),
    ],
    [user, isModerateur],
  );
  const phaseTabs = React.useMemo(() => TABS_PER_PHASE.filter((t) => t.phase && t.phase === selectedPhase), [selectedPhase]);

  const currentPathName = router.pathname.split('/')[1] || '';

  return (
    <nav className="navigation">
      <div style={{ position: 'relative' }}>
        <div
          className="navigation__content navigation__content--is-header with-shadow"
          style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
        >
          <h2 style={{ margin: '0 0.55rem 0 0.8rem' }}>Village-monde </h2>
          {village &&
            village.countries.map((country: Country) =>
              user?.type === UserType.OBSERVATOR && selectedPhase === 2 ? (
                <Flag style={{ margin: '0.25rem' }} key={country.isoCode} country={country.isoCode} />
              ) : (
                <Flag
                  style={{ margin: '0.25rem' }}
                  key={country.isoCode}
                  country={country.isoCode}
                  isMistery={
                    !village ||
                    !user ||
                    (selectedPhase === 1 && user.country.isoCode.toUpperCase() !== country.isoCode && !isModerateur) ||
                    (user.firstLogin < 2 && user.country.isoCode.toUpperCase() !== country.isoCode && !isModerateur)
                  }
                ></Flag>
              ),
            )}
        </div>
        {[fixedTabs, phaseTabs].map((tabs, index) => (
          <div key={`tabs_${index}`} className="navigation__content with-shadow" style={{ padding: '1rem 0.5rem 0.2rem 0.5rem' }}>
            {tabs.map((tab) => (
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
                  variant={tab.path.split('/')[1] === currentPathName ? 'contained' : 'outlined'}
                  className="navigation__button full-width"
                  style={{
                    justifyContent: 'flex-start',
                    paddingRight: '0.1rem',
                    marginBottom: '0.8rem',
                    width: tab.path.split('/')[1] === currentPathName ? '108%' : '100%',
                  }}
                  disableElevation
                  disabled={village === null || (tab.phase !== undefined && tab.phase > village.activePhase)}
                >
                  {tab.label}
                </Button>
              </Link>
            ))}
          </div>
        ))}
        {village && isModerateur && selectedPhase >= 2 && (
          <div
            className="navigation__content with-shadow"
            style={{ padding: '0 0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
          >
            {village.activePhase >= selectedPhase ? 'Désactiver' : 'Activer'} la phase{' '}
            <strong style={{ marginLeft: '0.25rem' }}>{selectedPhase}</strong>
            <Switch checked={village.activePhase >= selectedPhase} onChange={() => setIsModalOpen(true)} color="primary" />
          </div>
        )}
        <Link href="/cgu">
          <a className="navigation__cgu-link text text--small">{"Conditions générales d'utilisation"}</a>
        </Link>
      </div>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={async () => {
          if (!village) {
            return;
          }
          setLoading(true);
          await editVillage({
            id: village.id,
            activePhase: village.activePhase >= selectedPhase ? selectedPhase - 1 : selectedPhase,
          });
          setLoading(false);
          setIsModalOpen(false);
          window.location.reload();
        }}
        noCloseButton
        noCloseOutsideModal={loading}
        ariaDescribedBy={'activate-phase-desc'}
        ariaLabelledBy={'activate-phase'}
        title={`Êtes vous sûr de vouloir ${
          (village?.activePhase || 0) >= selectedPhase ? 'désactiver' : 'activer'
        } la phase numéro ${selectedPhase} ?`}
        cancelLabel="Annuler"
        confirmLabel="Confirmer"
        loading={loading}
      />
    </nav>
  );
};
