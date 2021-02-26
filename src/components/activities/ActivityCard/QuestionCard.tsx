import Link from 'next/link';
import React from 'react';

import { Button } from '@material-ui/core';

import { RedButton } from '../../buttons/RedButton';

import { ActivityCardProps } from './activity-card.types';

export const QuestionCard: React.FC<ActivityCardProps> = ({ activity, isSelf, noButtons, showEditButtons, onDelete }: ActivityCardProps) => {
  const processedContent = React.useMemo(() => activity?.processedContent?.filter((q) => q.value) ?? null, [activity]);
  const questionsCount = processedContent?.length ?? 0;

  return (
    <div>
      <div style={{ margin: '0.75rem' }}>
        {processedContent.map((c, index) => (
          <p key={c.id} style={{ margin: questionsCount > 1 ? '0 0 1rem 0' : 0 }}>
            {questionsCount > 1 && (
              <>
                <span>
                  <strong>Question {index + 1}</strong>
                </span>

                <br />
              </>
            )}
            <span>{c.value}</span>
          </p>
        ))}
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
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem' }}>
          <Button>
            <span className="text text--bold text--primary">
              {questionsCount > 1 ? 'Je me pose les mêmes questions' : 'Je me pose la même question'}
            </span>
          </Button>
          <Button variant="outlined" color="primary">
            {questionsCount > 1 ? 'Répondre aux questions' : 'Répondre à la question'}
          </Button>
        </div>
      )}
    </div>
  );
};
