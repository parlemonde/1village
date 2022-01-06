import Link from 'next/link';
import ReactPlayer from 'react-player';
import React from 'react';

import { Button } from '@mui/material';

import { KeepRatio } from 'src/components/KeepRatio';
import { RedButton } from 'src/components/buttons/RedButton';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { bgPage } from 'src/styles/variables.const';
import { serializeToQueryUrl } from 'src/utils';
import type { GameActivity, MimicsData } from 'types/game.type';
import { GameType } from 'types/game.type';

import { CommentIcon } from './CommentIcon';
import type { ActivityCardProps } from './activity-card.types';

export const MimicCard = ({ activity, isSelf, noButtons, isDraft, showEditButtons, onDelete }: ActivityCardProps<GameActivity>) => {
  const { village } = React.useContext(VillageContext);
  const [count, setCount] = React.useState<number>(0);

  const { axiosLoggedRequest } = React.useContext(UserContext);
  const activityMimic = activity.data as MimicsData;

  const randomVideoLink = React.useMemo(() => {
    const values = Object.values(activityMimic);
    values.shift(); //First element drafturl remove
    values.pop(); // Last element presentation remove
    const rdmMimicPick = values[Math.floor(Math.random() * values.length)]; // random game picked
    return rdmMimicPick.video;
  }, [activityMimic]);

  React.useMemo(() => {
    if (village) {
      axiosLoggedRequest({
        method: 'GET',
        url: `/games/ableToPlay${serializeToQueryUrl({
          villageId: village.id,
          type: GameType.MIMIC,
        })}`,
      }).then((response) => {
        if (!response.error && response.data) {
          setCount(response.data.count as number);
        }
      });
    }
  }, [axiosLoggedRequest, village]);

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
              pointerEvents: 'none', //Disable click on video
            }}
          >
            <KeepRatio ratio={9 / 16} maxWidth="600px">
              <ReactPlayer width="100%" height="100%" light url={randomVideoLink} style={{ backgroundColor: 'black' }} />
            </KeepRatio>
          </div>
        </div>
      )}
      <div style={{ margin: '0.25rem', flex: 1, minWidth: 0 }}>
        <p>Il y a actuellement {count} nouvelles mimiques à découvrir !</p>
        <p>{activity.data.presentation} a relancé le jeu des mimiques</p>
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
