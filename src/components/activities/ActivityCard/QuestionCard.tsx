import Link from 'next/link';
import React from 'react';

import { Button } from '@mui/material';

import { CommentIcon } from './CommentIcon';
import type { ActivityCardProps } from './activity-card.types';
import type { QuestionActivity } from 'src/activity-types/question.types';
import { RedButton } from 'src/components/buttons/RedButton';
import { UserContext } from 'src/contexts/userContext';
import { useActivityRequests } from 'src/services/useActivity';

export const QuestionCard = ({ activity, noButtons, showEditButtons, onDelete }: ActivityCardProps<QuestionActivity>) => {
  const { user } = React.useContext(UserContext);
  const { askSameQuestion } = useActivityRequests();
  const content = React.useMemo(() => activity?.content?.filter((q) => q.value) ?? null, [activity]);
  const isSelf = user !== null && user.id === activity.userId;
  const askSame = React.useMemo(
    () => (!activity.data.askSame ? [] : (activity.data.askSame || '').split(',').map((n) => parseInt(n, 10) || 0)),
    [activity],
  );

  const onAskSame = async () => {
    if (!user || isSelf) {
      return;
    }
    await askSameQuestion(activity.id);
  };

  return (
    <div>
      <div style={{ margin: '0.75rem' }}>
        <p style={{ margin: 0 }}>
          <span>{content[0]?.value}</span>
        </p>
      </div>
      {showEditButtons ? (
        <div style={{ width: '100%', textAlign: 'right', padding: '0.25rem' }}>
          <CommentIcon count={activity.commentCount} activityId={activity.id} />
          <Link href={`/poser-une-question/3?activity-id=${activity.id}`} passHref>
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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              style={{ padding: '6px 8px' }}
              onClick={onAskSame}
              disabled={isSelf}
              color="primary"
              variant={user !== null && askSame.includes(user.id) ? 'contained' : 'text'}
            >
              <span className="text text--bold">Je me pose la même question</span>
            </Button>
            {askSame.length > 0 && <span className="text text--primary">+ {askSame.length}</span>}
          </div>
          <div>
            <CommentIcon count={activity.commentCount} activityId={activity.id} />
            <Link href={`/activite/${activity.id}`} passHref>
              <Button component="a" href={`/activite/${activity.id}`} variant="outlined" color="primary">
                Répondre à la question
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
