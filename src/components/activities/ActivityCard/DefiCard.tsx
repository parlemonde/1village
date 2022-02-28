import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { Button } from '@mui/material';

import { ECO_ACTIONS, getDefi, getLanguageObject, isCooking, isEco, isLanguage } from 'src/activity-types/defi.constants';
import type { DefiActivity, CookingDefiData } from 'src/activity-types/defi.types';
import { RedButton } from 'src/components/buttons/RedButton';
import { bgPage } from 'src/styles/variables.const';
import { htmlToText } from 'src/utils';

import { CommentIcon } from './CommentIcon';
import type { ActivityCardProps } from './activity-card.types';

export const DefiCard = ({ activity, isSelf, noButtons, isDraft, showEditButtons, onDelete }: ActivityCardProps<DefiActivity>) => {
  const isCookingActivity = isCooking(activity);
  const link = isCookingActivity ? 'culinaire/4' : isEco(activity) ? 'ecologique/4' : 'linguistique/5';

  const firstImage = React.useMemo(() => {
    if (isCookingActivity) {
      return (activity.data as CookingDefiData).image || activity.content.find((c) => c.type === 'image')?.value || null;
    } else {
      return activity.content.find((c) => c.type === 'image')?.value || null;
    }
  }, [isCookingActivity, activity]);
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
            }}
          >
            <Image layout="fill" objectFit="contain" src={firstImage} unoptimized />
          </div>
        </div>
      )}
      <div style={{ margin: '0.25rem', flex: 1, minWidth: 0 }}>
        <h3 style={{ margin: '0 0.5rem 0.5rem' }}>
          {isCooking(activity)
            ? activity.data.name
            : isEco(activity)
            ? ECO_ACTIONS[activity.data.type]
            : isLanguage(activity)
            ? getLanguageObject(activity.data)
            : null}
        </h3>
        <div style={{ margin: '0 0.5rem 1rem', height: `${firstImage ? 4 : 2}rem`, textAlign: 'justify' }}>
          <div className="text multine-with-ellipsis break-long-words" style={{ maxHeight: `${firstImage ? 4 : 2}rem` }}>
            {isCooking(activity)
              ? `${activity.data.history}. ${activity.data.explanation}`
              : isEco(activity) || isLanguage(activity)
              ? firstText
              : null}
          </div>
        </div>
        <div style={{ margin: '0 0.5rem 0.5rem' }}>
          <strong>Votre défi : </strong>
          {getDefi(activity.subType || 0, activity.data)}
        </div>
        {noButtons || (
          <div style={{ textAlign: 'right' }}>
            <CommentIcon count={activity.commentCount} activityId={activity.id} />
            {!showEditButtons && (
              <>
                <Link href={`/activite/${activity.id}`} passHref>
                  <Button component="a" color="primary" variant="outlined" href={`/activite/${activity.id}`}>
                    Relever le défi
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
                      : `/lancer-un-defi/${link}?activity-id=${activity.id}`
                  }
                  passHref
                >
                  <Button
                    component="a"
                    href={
                      isDraft && activity.data.draftUrl
                        ? `${activity.data.draftUrl}?activity-id=${activity.id}`
                        : `/lancer-un-defi/${link}?activity-id=${activity.id}`
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
