import Link from 'next/link';
import React from 'react';

import { Button, Grid } from '@material-ui/core';

import { RedButton } from 'src/components/buttons/RedButton';
import { UserContext } from 'src/contexts/userContext';
import type { GameMimiqueActivity } from 'types/game.type';

import { CommentIcon } from './CommentIcon';
import type { ActivityCardProps } from './activity-card.types';

export const MimiqueCard: React.FC<ActivityCardProps<GameMimiqueActivity>> = ({
  activity,
  isSelf,
  noButtons,
  isDraft,
  showEditButtons,
  onDelete,
}: ActivityCardProps<GameMimiqueActivity>) => {
  const [pictureUrl, setPictureUrl] = React.useState<string>(null);
  const { axiosLoggedRequest } = React.useContext(UserContext);

  React.useEffect(() => {
    const videoUrl = activity?.data?.mimique1?.video;
    const videoId = videoUrl.split(/\//).pop();
    if (!videoId) return;
    axiosLoggedRequest({
      method: 'GET',
      url: `/videos/${videoId}/picture`,
    }).then((response) => {
      setPictureUrl(response.data);
    });
  }, [activity.data, activity.processedContent]);

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
          <Grid item xs={12} md={5}>
            {pictureUrl && (
              <div
                style={{
                  height: '100%',
                  width: '100%',
                  backgroundImage: `url(${pictureUrl})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}
              />
            )}
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
