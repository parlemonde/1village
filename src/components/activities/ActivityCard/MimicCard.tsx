import Link from 'next/link';
import React from 'react';

import { Button, Grid } from '@mui/material';

import { RedButton } from 'src/components/buttons/RedButton';
import VideoPlaceholder from 'src/svg/jeu/video-placeholder.svg';
import type { GameActivity } from 'types/game.type';

import { CommentIcon } from './CommentIcon';
import type { ActivityCardProps } from './activity-card.types';

export const MimicCard = ({ activity, isSelf, noButtons, isDraft, showEditButtons, onDelete }: ActivityCardProps<GameActivity>) => {
  const firstVideo = React.useMemo(() => activity.content.find((c) => c.type === 'video'), [activity.content]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
      }}
    >
      <div style={{ margin: '0.25rem', flex: 1, minWidth: 0 }}>
        <Grid container spacing={3} style={{ minHeight: '10rem' }}>
          <Grid item xs={12} md={5} style={{ marginTop: '2rem' }}>
            {firstVideo ? (
              <div
                style={{
                  height: '100%',
                  width: '100%',
                  backgroundImage: `url(${firstVideo})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}
              />
            ) : (
              <VideoPlaceholder
                style={{
                  height: '50%',
                  width: '50%',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}
              />
            )}
          </Grid>
          <Grid item xs={12} md={6} style={{ marginTop: '2rem' }}>
            <span>Nous avons avons ajouté 3 nouvelles mimiques au jeu !</span>
          </Grid>
        </Grid>
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
