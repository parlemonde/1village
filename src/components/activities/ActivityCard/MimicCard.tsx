import Link from 'next/link';
import ReactPlayer from 'react-player';
import React from 'react';

import { Button } from '@mui/material';

import { RedButton } from 'src/components/buttons/RedButton';
import { VillageContext } from 'src/contexts/villageContext';
import { useGameRequests } from 'src/services/useGames';
import { bgPage } from 'src/styles/variables.const';
import type { GameActivity, MimicsData } from 'types/game.type';
import { GameType } from 'types/game.type';

import { CommentIcon } from './CommentIcon';
import type { ActivityCardProps } from './activity-card.types';

export const MimicCard = ({ activity, isSelf, noButtons, isDraft, showEditButtons, onDelete }: ActivityCardProps<GameActivity>) => {
  const { village } = React.useContext(VillageContext);
  const { getAvailableGamesCount } = useGameRequests();
  const [availableMimicsCount, setAvailableMimicsCount] = React.useState<number>(0);

  const activityMimic = activity.data as MimicsData;

  const randomVideoLink = React.useMemo(() => {
    const values = Object.values(activityMimic);
    values.shift(); //First element drafturl remove
    values.pop(); // Last element presentation remove
    const rdmMimicPick = values[Math.floor(Math.random() * values.length)]; // random game picked
    return rdmMimicPick.video;
  }, [activityMimic]);

  React.useEffect(() => {
    if (village) {
      getAvailableGamesCount(GameType.MIMIC).then((count) => {
        setAvailableMimicsCount(count);
      });
    }
  }, [getAvailableGamesCount, village]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
      }}
    >
      {randomVideoLink && (
        <div style={{ width: '40%', flexShrink: 0, padding: '0.25rem' }}>
          <div
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: bgPage,
              position: 'relative',
              cursor: 'pointer',
            }}
          >
            <Link href="/creer-un-jeu/mimique" passHref>
              <ReactPlayer width="100%" height="100%" light url={randomVideoLink} style={{ backgroundColor: 'black' }} />
            </Link>
          </div>
        </div>
      )}
      <div style={{ margin: '0.25rem', flex: 1, minWidth: 0 }}>
        <p>Il y a actuellement {availableMimicsCount} nouvelles mimiques à découvrir !</p>
        <p style={{ marginBottom: '4rem' }}>{activity.data.presentation} a relancé le jeu des mimiques</p>
        {noButtons || (
          <div style={{ textAlign: 'right' }}>
            {!showEditButtons && (
              <>
                <CommentIcon count={activity.commentCount} activityId={activity.id} />
                <Link href="/creer-un-jeu/mimique" passHref>
                  <Button component="a" color="primary" variant="outlined" href="/creer-un-jeu/mimique">
                    Jouer au jeu
                  </Button>
                </Link>
              </>
            )}
            {isSelf && showEditButtons && (
              <>
                <Link
                  href={
                    isDraft && activity.data.draftUrl
                      ? `${activity.data.draftUrl}?activity-id=${activity.id}`
                      : `/creer-un-jeu/mimique/4?activity-id=${activity.id}`
                  }
                  passHref
                >
                  <Button
                    component="a"
                    href={
                      isDraft && activity.data.draftUrl
                        ? `${activity.data.draftUrl}?activity-id=${activity.id}`
                        : `/creer-un-jeu/mimique/4?activity-id=${activity.id}`
                    }
                    color="secondary"
                    variant="contained"
                    style={{ marginLeft: '0.25rem' }}
                  >
                    Modifier
                  </Button>
                </Link>
                <RedButton style={{ marginLeft: '0.25rem' }} onClick={onDelete}>
                  Supprimer
                </RedButton>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
