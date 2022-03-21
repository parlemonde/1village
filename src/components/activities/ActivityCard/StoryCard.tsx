import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { Button } from '@mui/material';

import { RedButton } from 'src/components/buttons/RedButton';
import { bgPage } from 'src/styles/variables.const';
import { htmlToText } from 'src/utils';
import type { StoryActivity } from 'types/story.type';

import { CommentIcon } from './CommentIcon';
import type { ActivityCardProps } from './activity-card.types';

export const StoryCard = ({ activity, isSelf, noButtons, isDraft, showEditButtons, onDelete }: ActivityCardProps<StoryActivity>) => {
  const firstImage = React.useMemo(() => activity.data.tale.imageStory, [activity.data.tale.imageStory]);
  const taleText = React.useMemo(() => activity.data.tale, [activity.data.tale]);

  const firstText = taleText.tale ? htmlToText(taleText.tale) : '';

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
              position: 'relative',
            }}
          >
            <Image layout="fill" objectFit="contain" src={firstImage} unoptimized />
          </div>
        </div>
      )}
      <div style={{ margin: '0.25rem', flex: 1, minWidth: 0 }}>
        <div style={{ margin: '0 0.5rem 1rem', height: `${firstImage ? 4 : 2}rem`, textAlign: 'justify' }}>
          <h3>Une histoire du village idéal</h3>
          <div className="text multine-with-ellipsis break-long-words" style={{ maxHeight: `${firstImage ? 2 : 1}rem` }}>
            {firstText}
          </div>
        </div>
        {noButtons || (
          <div style={{ textAlign: 'right' }}>
            <CommentIcon count={activity.commentCount} activityId={activity.id} />
            {!showEditButtons && (
              <>
                <Link href={`/activite/${activity.id}`} passHref>
                  <Button component="a" color="primary" variant="outlined" href={`/activite/${activity.id}`}>
                    {"Voir l'histoire"}
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
                      : `/creer-une-histoire/3?activity-id=${activity.id}`
                  }
                  passHref
                >
                  <Button
                    component="a"
                    href={
                      isDraft && activity.data.draftUrl
                        ? `${activity.data.draftUrl}?activity-id=${activity.id}`
                        : `/creer-une-histoire/3?activity-id=${activity.id}`
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
