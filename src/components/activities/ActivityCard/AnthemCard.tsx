import Link from 'next/link';
import React from 'react';

import { Button } from '@mui/material';

import { CommentIcon } from './CommentIcon';
import type { ActivityCardProps } from './activity-card.types';
import { RedButton } from 'src/components/buttons/RedButton';
import type { AnthemActivity } from 'types/anthem.type';

export const AnthemCard = ({ activity, isSelf, noButtons, isDraft, showEditButtons, onDelete }: ActivityCardProps<AnthemActivity>) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
    }}
  >
    <div style={{ margin: '0.25rem', flex: 1, minWidth: 0 }}>
      <h3>Paramétrage de l&apos;hymne du village idéal</h3>
      <div style={{ margin: '0 0.5rem 1rem', textAlign: 'justify' }}>
        <div className="text multine-with-ellipsis" style={{ maxHeight: `4rem` }}>
          <p>
            {activity.data.chorusLyrics.map((syllable) =>
              syllable.back ? (
                <>
                  <br />
                  {syllable.value}{' '}
                </>
              ) : (
                <>{syllable.value} </>
              ),
            )}
          </p>
        </div>
      </div>
      {noButtons || (
        <div style={{ textAlign: 'right' }}>
          <CommentIcon count={activity.commentCount} activityId={activity.id} />
          {!showEditButtons && (
            <>
              <Link href={`/activite/${activity.id}`} passHref>
                <Button component="a" color="primary" variant="outlined" href={`/activite/${activity.id}`}>
                  {'Écouter le couplet'}
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
                    : `/parametrer-hymne/1?activity-id=${activity.id}`
                }
                passHref
              >
                <Button
                  component="a"
                  href={
                    isDraft && activity.data.draftUrl
                      ? `${activity.data.draftUrl}?activity-id=${activity.id}`
                      : `/parametrer-hymne/1?activity-id=${activity.id}`
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
