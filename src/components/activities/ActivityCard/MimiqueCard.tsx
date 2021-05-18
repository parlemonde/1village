import Link from 'next/link';
import React from 'react';

import { Button, Grid } from '@material-ui/core';

import { RedButton } from 'src/components/buttons/RedButton';
import { bgPage } from 'src/styles/variables.const';
import { htmlToText } from 'src/utils';

import { CommentIcon } from './CommentIcon';
import { ActivityCardProps } from './activity-card.types';
import { GameMimiqueActivity } from 'types/game.types';
import ReactPlayer from 'react-player';

export const MimiqueCard: React.FC<ActivityCardProps<GameMimiqueActivity>> = ({
  activity,
  isSelf,
  noButtons,
  isDraft,
  showEditButtons,
  onDelete,
}: ActivityCardProps<GameMimiqueActivity>) => {
  const firstImage = React.useMemo(() => {
    return null;
  }, [activity.data, activity.processedContent]);
  const firstTextContent = React.useMemo(() => activity.processedContent.find((c) => c.type === 'text'), [activity.processedContent]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
      }}
    >
      {firstImage && (
        <div style={{ width: '40%', flexShrink: 0, padding: '0.25rem' }}>
          <div
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: bgPage,
              backgroundImage: `url(${firstImage})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          />
        </div>
      )}
      <div style={{ margin: '0.25rem', flex: 1, minWidth: 0 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <ReactPlayer width="100%" height="100%" light url="" controls />
          </Grid>
          <Grid item xs={12} md={7}>
            <span>Nous avons avons ajouté 3 nouvelles mimiques au jeu !</span>
          </Grid>
        </Grid>
        {noButtons || (
          <div style={{ textAlign: 'right' }}>
            {!showEditButtons && (
              <>
                <CommentIcon count={activity.commentCount} activityId={activity.id} />
                <Link href="/creer-un-jeu/mimique">
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
