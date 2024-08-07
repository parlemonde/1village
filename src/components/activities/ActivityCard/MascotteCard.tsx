import Link from 'next/link';
import React from 'react';

import { Button } from '@mui/material';

import { CommentIcon } from './CommentIcon';
import type { ActivityCardProps } from './activity-card.types';
import type { MascotteActivity } from 'src/activity-types/mascotte.types';
import { AvatarImg } from 'src/components/Avatar';
import { RedButton } from 'src/components/buttons/RedButton';
import { bgPage } from 'src/styles/variables.const';

export const MascotteCard = ({ activity, isSelf, noButtons, isDraft, showEditButtons, onDelete }: ActivityCardProps<MascotteActivity>) => {
  const firstText = React.useMemo(() => activity.content.find((c) => c.type === 'text')?.value || '', [activity.content]);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
      }}
    >
      <div style={{ width: '40%', flexShrink: 0, padding: '0.25rem' }}>
        <div
          style={{
            height: '100%',
            padding: '0.1rem 0',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: bgPage,
          }}
        >
          <Link href={`/activite/${activity.id}`} passHref>
            <AvatarImg size="medium" src={activity.data.mascotteImage} noLink />
          </Link>
        </div>
      </div>
      <div style={{ margin: '0.25rem', flex: 1, minWidth: 0 }}>
        <h3 style={{ margin: '0 0.5rem 0.5rem' }}>
          Notre mascotte <strong>{activity.data.mascotteName}</strong>
        </h3>
        <div style={{ margin: '0 0.5rem 1rem', textAlign: 'justify' }}>
          <div className="text multine-with-ellipsis break-long-words" style={{ maxHeight: `4rem` }}>
            {firstText}
          </div>
        </div>
        {noButtons || (
          <div style={{ textAlign: 'right' }}>
            <CommentIcon count={activity.commentCount} activityId={activity.id} />
            {isSelf && showEditButtons && (
              <>
                <Link
                  href={
                    isDraft && activity.data.draftUrl
                      ? `${activity.data.draftUrl}?activity-id=${activity.id}`
                      : `/mascotte/5?activity-id=${activity.id}`
                  }
                  passHref
                >
                  <Button
                    component="a"
                    href={
                      isDraft && activity.data.draftUrl
                        ? `${activity.data.draftUrl}?activity-id=${activity.id}`
                        : `/mascotte/5?activity-id=${activity.id}`
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
            {!showEditButtons && (
              <>
                <Link href={`/activite/${activity.id}`} passHref>
                  <Button component="a" color="primary" variant="outlined" href={`/activite/${activity.id}`} style={{ marginLeft: '0.25rem' }}>
                    Voir la mascotte
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
