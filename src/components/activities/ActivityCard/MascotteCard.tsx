import Link from 'next/link';
import React from 'react';

import { Button } from '@material-ui/core';

import { PresentationMascotteActivity } from 'src/activities/presentation.types';
import { AvatarImg } from 'src/components/Avatar';
import { bgPage } from 'src/styles/variables.const';

import { RedButton } from '../../buttons/RedButton';

import { CommentIcon } from './CommentIcon';
import { ActivityCardProps } from './activity-card.types';

export const MascotteCard: React.FC<ActivityCardProps<PresentationMascotteActivity>> = ({
  activity,
  isSelf,
  noButtons,
  isDraft,
  showEditButtons,
  onDelete,
}: ActivityCardProps<PresentationMascotteActivity>) => {
  const firstText = React.useMemo(() => activity.processedContent.find((c) => c.type === 'text')?.value || '', [activity.processedContent]);
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
            minHeight: '5rem',
            height: '100%',
            padding: '0.1rem 0',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: bgPage,
          }}
        >
          <AvatarImg size="medium" src={activity.data.mascotteImage} />
        </div>
      </div>
      <div style={{ margin: '0.25rem', flex: 1 }}>
        <h3 style={{ margin: '0 0.5rem 0.5rem' }}>
          Notre mascotte <strong>{activity.data.mascotteName}</strong>
        </h3>
        <div style={{ margin: '0 0.5rem 1rem', height: `2rem`, textAlign: 'justify' }}>
          <div className="text multine-with-ellipsis" style={{ maxHeight: `2rem` }}>
            {firstText}
          </div>
        </div>
        {noButtons || (
          <div style={{ textAlign: 'right' }}>
            {isSelf && showEditButtons && (
              <>
                <Link
                  href={
                    isDraft && activity.data.draftUrl
                      ? `${activity.data.draftUrl}?activity-id=${activity.id}`
                      : `/se-presenter/mascotte/4?activity-id=${activity.id}`
                  }
                >
                  <Button
                    component="a"
                    href={
                      isDraft && activity.data.draftUrl
                        ? `${activity.data.draftUrl}?activity-id=${activity.id}`
                        : `/se-presenter/mascotte/4?activity-id=${activity.id}`
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
                <CommentIcon count={activity.commentCount} />
                <Link href={`/activity/${activity.id}`}>
                  <Button component="a" color="primary" variant="outlined" href={`/activity/${activity.id}`} style={{ marginLeft: '0.25rem' }}>
                    Regarder la présentation
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
