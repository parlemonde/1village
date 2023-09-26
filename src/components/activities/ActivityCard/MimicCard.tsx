import Link from 'next/link';
import router from 'next/router';
import React, { useState, useMemo, useEffect } from 'react';
import ReactPlayer from 'react-player';

import { Button } from '@mui/material';

import { CommentIcon } from './CommentIcon';
import type { ActivityCardProps } from './activity-card.types';
import { RedButton } from 'src/components/buttons/RedButton';
import { VillageContext } from 'src/contexts/villageContext';
import { useGameRequests } from 'src/services/useGames';
import { bgPage } from 'src/styles/variables.const';
import { LinkNotAllowedInPath } from 'types/activity.type';
import type { GameActivity } from 'types/game.type';
import { GameType } from 'types/game.type';

export const MimicCard = ({ activity, isSelf, noButtons, isDraft, showEditButtons, onDelete }: ActivityCardProps<GameActivity>) => {
  const { village } = React.useContext(VillageContext);
  const { getAllGamesByType, getAvailableGamesCount } = useGameRequests();
  const [totalMimicsCount, setTotalMimicsCount] = useState<number>(0);
  const [availableMimicsCount, setAvailableMimicsCount] = useState<number>(0);

  const latestGameUrl = useMemo(() => {
    const villageId = activity.villageId;
    const type = activity.type;
    return `/creer-un-jeu/mimique/jouer/?villageId=${villageId}&type=${type}`;
  }, [activity.villageId, activity.type]);

  useEffect(() => {
    if (village) {
      getAllGamesByType(GameType.MIMIC).then((count) => {
        if (Array.isArray(count)) {
          setTotalMimicsCount(count.length);
        } else {
          setTotalMimicsCount(0);
        }
      });
    }
  }, [getAllGamesByType, village]);

  useEffect(() => {
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
      {latestGameUrl && (
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
            {/* Link is disabled for reaction activity */}
            {router.pathname.includes(LinkNotAllowedInPath.REACTION) ? (
              <ReactPlayer width="100%" height="100%" light url={latestGameUrl} style={{ backgroundColor: 'black' }} />
            ) : (
              <Link href="/creer-un-jeu/mimique/jouer/" passHref>
                <ReactPlayer width="100%" height="100%" light url={latestGameUrl} style={{ backgroundColor: 'black' }} />
              </Link>
            )}
          </div>
        </div>
      )}
      <div style={{ margin: '0.25rem', flex: 1, minWidth: 0 }}>
        <p style={{ marginBottom: '2rem' }}>{activity.data.presentation} a relancé le jeu des mimiques</p>
        <p>
          Il y a actuellemment {totalMimicsCount} mimiques, dont {availableMimicsCount}{' '}
          {availableMimicsCount > 1 ? 'nouvelles mimiques' : 'nouvelle mimique'} à découvrir !{' '}
        </p>
        {noButtons || (
          <div style={{ textAlign: 'right' }}>
            {!showEditButtons && (
              <>
                <CommentIcon count={activity.commentCount} activityId={activity.id} />
                <Link href={latestGameUrl} passHref>
                  <Button component="a" color="primary" variant="outlined" href="/creer-un-jeu/mimique/jouer">
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
