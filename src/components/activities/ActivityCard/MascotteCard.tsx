import Link from 'next/link';
import React from 'react';

import { Button, Box } from '@material-ui/core';

import { AvatarView } from 'src/components/activities/views/AvatarView';

import { RedButton } from '../../buttons/RedButton';

import { CommentIcon } from './CommentIcon';
import { ActivityCardProps } from './activity-card.types';

export const MascotteCard: React.FC<ActivityCardProps> = ({ activity, isSelf, noButtons, showEditButtons, onDelete }: ActivityCardProps) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
      }}
    >
      <div style={{ margin: '0.25rem', flex: 1 }}>
        <Box alignItems="center" flexDirection="horizontal" display="flex" justifyContent="left" m={2}>
          <AvatarView size="medium" value={activity.data.mascotteImage as string} />
          <h3 style={{ marginLeft: '1rem' }}>Notre Mascotte {activity.data.mascotteName}</h3>
        </Box>
        {noButtons || (
          <div style={{ textAlign: 'right' }}>
            {!showEditButtons && (
              <>
                <CommentIcon count={activity.commentCount} />
                <Link href={`/activity/${activity.id}`}>
                  <Button component="a" color="primary" variant="outlined" href={`/activity/${activity.id}`}>
                    Regarder la présentation
                  </Button>
                </Link>
              </>
            )}
            {isSelf && showEditButtons && (
              <>
                <Link href={`se-presenter/mascotte/4?activity-id=${activity.id}`}>
                  <Button
                    component="a"
                    href={`se-presenter/mascotte/4?activity-id=${activity.id}`}
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
