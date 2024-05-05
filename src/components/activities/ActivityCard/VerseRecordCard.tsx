import Link from 'next/link';
import React from 'react';

import { Button } from '@mui/material';

import { CommentIcon } from './CommentIcon';
import type { ActivityCardProps } from './activity-card.types';
import type { ClassAnthemActivity } from 'types/classAnthem.types';
import { RedButton } from 'src/components/buttons/RedButton';

export const VerseRecordCard = ({ activity, isSelf, noButtons, isDraft, showEditButtons, onDelete }: ActivityCardProps<ClassAnthemActivity>) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
    }}
  >
    <div style={{ width: '40%', flexShrink: 0, padding: '0.25rem' }}>
      <audio controls src={activity.data.verseFinalMixUrl} />
    </div>
    <div style={{ margin: '0.25rem', flex: 1, minWidth: 0 }}>
      <h3>Un couplet de l&apos;hymne du village idéal</h3>
      <div style={{ margin: '0 0.5rem 1rem', height: `4rem`, textAlign: 'justify' }}>
        <div className="text multine-with-ellipsis" style={{ maxHeight: `4rem` }}>
          <p>
            {activity.data.verseLyrics.map((syllable, index) =>
              syllable.back ? (
                <React.Fragment key={index}>
                  <br />
                  {syllable.value}{' '}
                </React.Fragment>
              ) : (
                <React.Fragment key={index}>{syllable.value} </React.Fragment>
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
                    : `/chanter-un-couplet/3?activity-id=${activity.id}`
                }
                passHref
              >
                <Button
                  component="a"
                  href={
                    isDraft && activity.data.draftUrl
                      ? `${activity.data.draftUrl}?activity-id=${activity.id}`
                      : `/chanter-un-couplet/3?activity-id=${activity.id}`
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
