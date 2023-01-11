import { Button } from '@mui/material';
import Switch from '@mui/material/Switch';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';

import { AvatarImg } from './Avatar';
import { Flag } from 'src/components/Flag';
import { Modal } from 'src/components/Modal';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { useVillageRequests } from 'src/services/useVillages';
import AnthemIcon from 'src/svg/navigation/anthem-icon.svg';
import FreeContentIcon from 'src/svg/navigation/free-content-icon.svg';
import GameIcon from 'src/svg/navigation/game-icon.svg';
import HomeIcon from 'src/svg/navigation/home-icon.svg';
import IndiceIcon from 'src/svg/navigation/indice-culturel.svg';
import KeyIcon from 'src/svg/navigation/key-icon.svg';
import MusicIcon from 'src/svg/navigation/music-icon.svg';
import QuestionIcon from 'src/svg/navigation/question-icon.svg';
import ReactionIcon from 'src/svg/navigation/reaction-icon.svg';
import ReportageIcon from 'src/svg/navigation/reportage-icon.svg';
import RouletteIcon from 'src/svg/navigation/roulette-icon.svg';
import StoryIcon from 'src/svg/navigation/story-icon.svg';
import SymbolIcon from 'src/svg/navigation/symbol-icon.svg';
import TargetIcon from 'src/svg/navigation/target-icon.svg';
import UserIcon from 'src/svg/navigation/user-icon.svg';
import { serializeToQueryUrl } from 'src/utils';
import type { Activity } from 'types/activity.type';
import { ActivityStatus, ActivityType } from 'types/activity.type';
import type { Country } from 'types/country.type';
import { UserType } from 'types/user.type';

interface Tab {
  label: string;
  path: string;
  icon: React.ReactNode;
  phase?: number;
  disabled?: boolean;
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
const ANTHEM_PARAM: Tab = {
  label: "Paramétrer l'hymne",
  path: '/parametrer-hymne',
  icon: <AnthemIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
};

export const Navigation = (): JSX.Element => {
  const router = useRouter();
  const { village, selectedPhase } = React.useContext(VillageContext);
  const { user, axiosLoggedRequest } = React.useContext(UserContext);
  const isModerateur = user !== null && user.type >= UserType.MEDIATOR;
  const isObservator = user !== null && user.type === UserType.OBSERVATOR;
  const isTeacher = user !== null && user.type === UserType.TEACHER;
  const { editVillage } = useVillageRequests();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [firstStoryCreated, setFirstStoryCreated] = React.useState(false);
  const [mascotteActivity, setMascotteActivity] = React.useState<Activity | null>(null);

  const getStories = React.useCallback(async () => {
    if (!village) {
      setFirstStoryCreated(false);
      return;
    }
    const response = await axiosLoggedRequest({
      method: 'GET',
      url: `/activities${serializeToQueryUrl({
        villageId: village.id,
        type: ActivityType.STORY,
      })}`,
    });
    setFirstStoryCreated(response.data.length > 0);
  }, [axiosLoggedRequest, village]);

  React.useEffect(() => {
    getStories().catch(console.error);
  }, [getStories]);

  const getMascotte = React.useCallback(
    async (type: number) => {
      if (!village) {
        return;
      }
      const response = await axiosLoggedRequest({
        method: 'GET',
        url: `/activities/draft${serializeToQueryUrl({
          villageId: village.id,
          type,
        })}`,
      });
      if (response.error) {
        setMascotteActivity(null);
      } else {
        setMascotteActivity(response.data.draft);
      }
    },
    [village, axiosLoggedRequest],
  );

  // Get mascotte
  React.useEffect(() => {
    getMascotte(ActivityType.MASCOTTE).catch(console.error);
  }, [getMascotte]);

  // check color of icons
  const TABS_PER_PHASE = React.useMemo<Tab[]>(
    () => [
      // ---- PHASE 1 ----
      {
        label: 'Créer sa mascotte',
        path:
          mascotteActivity && mascotteActivity.id !== 0 && mascotteActivity.status === ActivityStatus.PUBLISHED
            ? `/mascotte/5?activity-id=${mascotteActivity?.id}`
            : mascotteActivity && mascotteActivity.status === ActivityStatus.DRAFT
            ? `${mascotteActivity.data.draftUrl}?activity-id=${mascotteActivity.id}`
            : '/mascotte/1',
        icon: <UserIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
        phase: 1,
        disabled: !isTeacher,
      },
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
        label: 'Inventer une histoire',
        path: '/creer-une-histoire',
        icon: <StoryIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
        phase: 3,
      },
      {
        label: 'Ré-inventer une histoire',
        path: '/re-inventer-une-histoire',
        icon: <RouletteIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
        phase: 3,
        disabled: firstStoryCreated === false,
      },
      {
        label: 'Chanter un couplet',
        path: '/chanter-un-couplet',
        icon: <MusicIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
        phase: 3,
        disabled: !village?.anthemId,
      },
    ],
    [firstStoryCreated, mascotteActivity, village, isTeacher],
  );

  const fixedTabs = React.useMemo<Tab[]>(
    () => [
      ACCUEIL,
      {
        label: 'Notre classe',
        path: '/ma-classe',
        icon: user && <AvatarImg user={user} size="extra-small" noLink noToolTip />,
      },
      ...(isModerateur ? (selectedPhase === 3 ? [FREE_CONTENT, ANTHEM_PARAM] : [FREE_CONTENT]) : []),
    ],
    [user, isModerateur, selectedPhase],
  );
  const phaseTabs = React.useMemo<Tab[]>(() => TABS_PER_PHASE.filter((t) => t.phase && t.phase === selectedPhase), [selectedPhase, TABS_PER_PHASE]);

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
            village.countries.map((country: Country) => (
              <Flag
                style={{ margin: '0.25rem' }}
                key={country.isoCode}
                country={country.isoCode}
                isMistery={
                  !village ||
                  !user ||
                  (selectedPhase === 1 && user.country?.isoCode.toUpperCase() !== country.isoCode && (!isModerateur || isObservator)) ||
                  (user.firstLogin < 2 && user.country?.isoCode.toUpperCase() !== country.isoCode && (!isModerateur || isObservator))
                }
              ></Flag>
            ))}
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
                  disabled={village === null || (tab.phase !== undefined && tab.phase > village.activePhase) || tab.disabled}
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
