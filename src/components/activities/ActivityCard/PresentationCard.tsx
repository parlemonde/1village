import Image from 'next/image';
import Link from 'next/link';
import router from 'next/router';
import React from 'react';

import { Button } from '@mui/material';

import { CommentIcon } from './CommentIcon';
import type { ActivityCardProps } from './activity-card.types';
import { PRESENTATION_THEMATIQUE } from 'src/activity-types/presentation.constants';
import type { PresentationActivity } from 'src/activity-types/presentation.types';
import { RedButton } from 'src/components/buttons/RedButton';
import { bgPage } from 'src/styles/variables.const';
import { htmlToText } from 'src/utils';
import { LinkNotAllowedInPath } from 'types/activity.type';

export const PresentationCard = ({ activity, isSelf, noButtons, isDraft, showEditButtons, onDelete }: ActivityCardProps<PresentationActivity>) => {
  const firstImage = React.useMemo(() => activity.content.find((c) => c.type === 'image'), [activity.content]);
  const firstTextContent = React.useMemo(() => activity.content.find((c) => c.type === 'text'), [activity.content]);
  const firstText = firstTextContent ? htmlToText(firstTextContent.value) : '';

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
              cursor: 'pointer',
            }}
          >
            {/* Link is disabled for reaction activity */}
            {router.pathname.includes(LinkNotAllowedInPath.REACTION) ? (
              <Image layout="fill" objectFit="contain" src={firstImage.value} unoptimized />
            ) : (
              <Link href={`/activite/${activity.id}`} passHref>
                <Image layout="fill" objectFit="contain" src={firstImage.value} unoptimized />
              </Link>
            )}
          </div>
        </div>
      )}
      <div style={{ margin: '0.25rem', flex: 1, minWidth: 0 }}>
        {activity.data.theme !== undefined && (
          <h3 style={{ margin: '0 0.5rem 0.5rem' }}>{PRESENTATION_THEMATIQUE[activity.data.theme as number].cardTitle}</h3>
        )}
        <div style={{ margin: '0 0.5rem 1rem', textAlign: 'justify' }}>
          <div className="text multine-with-ellipsis break-long-words" style={{ maxHeight: `${firstImage ? 4 : 2}rem` }}>
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
                    Regarder la présentation
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
                      : `/se-presenter/thematique/4?activity-id=${activity.id}`
                  }
                  passHref
                >
                  <Button
                    component="a"
                    href={
                      isDraft && activity.data.draftUrl
                        ? `${activity.data.draftUrl}?activity-id=${activity.id}`
                        : `/se-presenter/thematique/4?activity-id=${activity.id}`
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
