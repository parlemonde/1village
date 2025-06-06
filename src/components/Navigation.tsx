import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';

import { Box, Button } from '@mui/material';

import { AvatarImg } from './Avatar';
import { VillageMonde } from './VillageMonde';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import AnthemIcon from 'src/svg/navigation/anthem-icon.svg';
import FreeContentIcon from 'src/svg/navigation/free-content-icon.svg';
import GameIcon from 'src/svg/navigation/game-icon.svg';
import HomeIcon from 'src/svg/navigation/home-icon.svg';
import KeyIcon from 'src/svg/navigation/key-icon.svg';
import MusicIcon from 'src/svg/navigation/music-icon.svg';
import QuestionIcon from 'src/svg/navigation/question-icon.svg';
import ReactionIcon from 'src/svg/navigation/reaction-icon.svg';
import ReportageIcon from 'src/svg/navigation/reportage-icon.svg';
import RouletteIcon from 'src/svg/navigation/roulette-icon.svg';
import StoryIcon from 'src/svg/navigation/story-icon.svg';
import TargetIcon from 'src/svg/navigation/target-icon.svg';
import UserIcon from 'src/svg/navigation/user-icon.svg';
import { serializeToQueryUrl } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';
import type { Activity } from 'types/activity.type';
import { ActivityStatus, ActivityType } from 'types/activity.type';
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
  const { user } = React.useContext(UserContext);
  //* NOTE: might be interesting to make a hook for this below
  const isPelico =
    (user !== null && user.type === UserType.MEDIATOR) ||
    (user !== null && user.type === UserType.ADMIN) ||
    (user !== null && user.type === UserType.SUPER_ADMIN);
  const isTeacher = user !== null && user.type === UserType.TEACHER;
  const isParent = user !== null && user.type === UserType.FAMILY;
  const [firstStoryCreated, setFirstStoryCreated] = React.useState(false);
  const [mascotteActivity, setMascotteActivity] = React.useState<Activity | null>(null);

  const getStories = React.useCallback(async () => {
    if (!village) {
      setFirstStoryCreated(false);
      return;
    }
    const response = await axiosRequest({
      method: 'GET',
      url: `/activities${serializeToQueryUrl({
        villageId: village.id,
        type: ActivityType.STORY,
      })}`,
    });
    setFirstStoryCreated(response.data.length > 0);
  }, [village]);

  React.useEffect(() => {
    getStories().catch(console.error);
  }, [getStories]);

  const getMascotte = React.useCallback(
    async (type: number) => {
      if (!village) {
        return;
      }
      const response = await axiosRequest({
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
    [village],
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
      // ---- Commenté pour l'année 2024 - 2025 d'1Village ----

      // {
      //   label: 'Présenter un indice culturel',
      //   path: '/indice-culturel',
      //   icon: <IndiceIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
      //   phase: 1,
      //   disabled: isParent,
      // },
      // {
      //   label: 'Présenter un symbole',
      //   path: '/symbole',
      //   icon: <SymbolIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
      //   phase: 1,
      //   disabled: isParent,
      // },
      // ---- PHASE 2 ----
      {
        label: 'Réaliser un reportage',
        path: '/realiser-un-reportage',
        icon: <ReportageIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
        phase: 2,
        disabled: isParent,
      },
      {
        label: 'Créer une énigme',
        path: '/creer-une-enigme',
        icon: <KeyIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
        phase: 2,
        disabled: isParent,
      },
      {
        label: 'Lancer un défi',
        path: '/lancer-un-defi',
        icon: <TargetIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
        phase: 2,
        disabled: isParent,
      },
      {
        label: 'Jouer ensemble',
        path: '/creer-un-jeu',
        icon: <GameIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
        phase: 2,
        disabled: isParent,
      },
      {
        label: 'Poser une question',
        path: '/poser-une-question/1',
        icon: <QuestionIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
        phase: 2,
        disabled: isParent,
      },
      {
        label: 'Réagir à une activité',
        path: '/reagir-a-une-activite/1',
        icon: <ReactionIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
        phase: 2,
        disabled: isParent,
      },
      {
        label: 'Inventer une histoire',
        path: '/creer-une-histoire',
        icon: <StoryIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
        phase: 2,
        disabled: isParent,
      },
      // ---- PHASE 3 ----
      {
        label: 'Chanter un couplet',
        path: '/chanter-un-couplet',
        icon: <MusicIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
        phase: 3,
        disabled: !village?.anthemId || isParent,
      },
      {
        label: 'Ré-inventer une histoire',
        path: '/re-inventer-une-histoire',
        icon: <RouletteIcon style={{ fill: 'currentcolor' }} width="1.4rem" />,
        phase: 3,
        disabled: firstStoryCreated === false || isParent,
      },
      ...(isTeacher
        ? [
            {
              ...FREE_CONTENT,
              phase: 3,
              disabled: false,
            },
          ]
        : []),
    ],
    [firstStoryCreated, mascotteActivity, village, isTeacher, isParent],
  );

  const fixedTabs = React.useMemo<Tab[]>(
    () => [
      ACCUEIL,
      {
        label: 'Notre classe et nos activités',
        path: '/ma-classe',
        icon: user && <AvatarImg user={user} size="extra-small" noLink noToolTip />,
        disabled: isParent,
      },
      ...(isPelico ? (selectedPhase === 3 ? [FREE_CONTENT, ANTHEM_PARAM] : [FREE_CONTENT]) : []),
    ],
    [user, isPelico, selectedPhase, isParent],
  );
  const phaseTabs = React.useMemo<Tab[]>(() => TABS_PER_PHASE.filter((t) => t.phase && t.phase === selectedPhase), [selectedPhase, TABS_PER_PHASE]);

  const currentPathName = router.pathname.split('/')[1] || '';

  if (!user) {
    return <div></div>;
  }

  return (
    <nav>
      <div style={{ marginRight: '1.5rem' }}>
        <Box mb={{ xs: '0', md: '20px' }}>
          <VillageMonde />
        </Box>
        {[fixedTabs, phaseTabs].map((tabs, index) => (
          <div
            key={`tabs_${index}`}
            className="with-shadow"
            style={{ backgroundColor: 'white', borderRadius: '10px', marginBottom: '10px', padding: '1rem 0.5rem 0.2rem 0.5rem' }}
          >
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
        <div
          style={{
            textAlign: 'center',
            paddingTop: '10px',
          }}
        >
          <Link href="/cgu">
            <a className="text text--small">{"Conditions générales d'utilisation"}</a>
          </Link>
        </div>
      </div>
    </nav>
  );
};
