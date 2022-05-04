import Image from 'next/image';
import Link from 'next/link';
import ReactPlayer from 'react-player';
import React from 'react';

import { Button } from '@mui/material';

import { getReportage } from 'src/activity-types/reportage.constants';
import type { ReportageActivity } from 'src/activity-types/reportage.types';
import { RedButton } from 'src/components/buttons/RedButton';
import { bgPage } from 'src/styles/variables.const';
import { htmlToText } from 'src/utils';

import { CommentIcon } from './CommentIcon';
import type { ActivityCardProps } from './activity-card.types';

export const ReportageCard = ({ activity, isSelf, noButtons, isDraft, showEditButtons, onDelete }: ActivityCardProps<ReportageActivity>) => {
  const firstImage = React.useMemo(() => activity.content.find((c) => c.type === 'image'), [activity.content]);
  const firstVideo = React.useMemo(() => activity.content.find((c) => c.type === 'video'), [activity.content]);
  const firstTextContent = React.useMemo(() => activity.content.find((c) => c.type === 'text'), [activity.content]);
  const firstText = firstTextContent ? htmlToText(firstTextContent.value) : '';
  const hasPreview = firstImage !== undefined || firstVideo !== undefined;

  const reportageType = getReportage(activity.subType, activity.data);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
      }}
    >
      {firstImage ? (
        <div style={{ width: '40%', flexShrink: 0, padding: '0.25rem' }}>
          <div
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: bgPage,
              position: 'relative',
              cursor: 'pointer',
            }}
          >
            <Link href={`/activite/${activity.id}`} passHref>
              <Image layout="fill" objectFit="contain" src={firstImage.value} unoptimized />
            </Link>
          </div>
        </div>
      ) : firstVideo ? (
        <div style={{ width: '40%', flexShrink: 0, padding: '0.25rem' }}>
          <div
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: bgPage,
              position: 'relative',
              cursor: 'pointer',
            }}
          >
            <Link href={`/activite/${activity.id}`} passHref>
              <ReactPlayer width="100%" height="100%" url={firstVideo.value} light />
            </Link>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <div style={{ margin: '0.25rem', flex: 1, minWidth: 0 }}>
        <h3 style={{ margin: '0 0.5rem 0.5rem' }}>{reportageType.title}</h3>
        <div style={{ margin: '0 0.5rem 1rem', height: `${hasPreview ? 4 : 2}rem`, textAlign: 'justify' }}>
          <div className="text multine-with-ellipsis break-long-words" style={{ maxHeight: `${hasPreview ? 4 : 2}rem` }}>
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
                    {'Voir le reportage'}
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
                      : `/realiser-un-reportage/3?activity-id=${activity.id}`
                  }
                  passHref
                >
                  <Button
                    component="a"
                    href={
                      isDraft && activity.data.draftUrl
                        ? `${activity.data.draftUrl}?activity-id=${activity.id}`
                        : `/realiser-un-reportage/3?activity-id=${activity.id}`
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
