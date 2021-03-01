import Link from 'next/link';
import React from 'react';

import { Button } from '@material-ui/core';

import { UserContext } from 'src/contexts/userContext';
import { useActivityRequests } from 'src/services/useActivity';

import { RedButton } from '../../buttons/RedButton';

import { CommentIcon } from './CommentIcon';
import { ActivityCardProps } from './activity-card.types';

export const QuestionCard: React.FC<ActivityCardProps> = ({ activity, noButtons, showEditButtons, onDelete }: ActivityCardProps) => {
  const { user } = React.useContext(UserContext);
  const { updatedActivityData } = useActivityRequests();
  const processedContent = React.useMemo(() => activity?.processedContent?.filter((q) => q.value) ?? null, [activity]);

  const askSame = React.useMemo(
    () => (!activity.data.askSame ? [] : ((activity.data.askSame as string) || '').split(',').map((n) => parseInt(n, 10) || 0)),
    [activity],
  );
  const onAskSame = async () => {
    if (!user || !user.id) {
      return;
    }

    const index = askSame.findIndex((i) => i === user.id);
    if (index !== -1) {
      askSame.splice(index, 1);
    } else {
      askSame.push(user.id);
    }
    await updatedActivityData(activity, {
      askSame: askSame.join(','),
    });
  };

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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button onClick={onAskSame}>
              <span className="text text--bold text--primary">Je me pose la même question</span>
            </Button>
            {askSame.length > 0 && <span className="text text--primary">+ {askSame.length}</span>}
          </div>
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
