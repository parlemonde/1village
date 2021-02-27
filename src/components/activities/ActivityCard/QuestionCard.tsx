import Link from 'next/link';
import React from 'react';

import { Button } from '@material-ui/core';

import { RedButton } from '../../buttons/RedButton';

import { CommentIcon } from './CommentIcon';
import { ActivityCardProps } from './activity-card.types';

export const QuestionCard: React.FC<ActivityCardProps> = ({ activity, noButtons, showEditButtons, onDelete }: ActivityCardProps) => {
  const processedContent = React.useMemo(() => activity?.processedContent?.filter((q) => q.value) ?? null, [activity]);

  return (
    <div>
      <div style={{ margin: '0.75rem' }}>
        <p style={{ margin: 0 }}>
          <span>{processedContent[0]?.value}</span>
        </p>
      </div>
      {showEditButtons ? (
        <div style={{ width: '100%', textAlign: 'right', padding: '0.25rem' }}>
          <Link href={`/poser-une-question/3?activity-id=${activity.id}`}>
            <Button
              component="a"
              href={`/poser-une-question/3?activity-id=${activity.id}`}
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
        </div>
      ) : noButtons ? null : (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem' }}>
          <Button>
            <span className="text text--bold text--primary">Je me pose la même question</span>
          </Button>
          <div>
            <CommentIcon count={activity.commentCount} />
            <Link href={`/activity/${activity.id}`}>
              <Button component="a" href={`/activity/${activity.id}`} variant="outlined" color="primary">
                Répondre à la question
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
