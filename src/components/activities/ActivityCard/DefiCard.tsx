import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';

import { Button } from '@mui/material';

import type { CookingDefiData, DefiActivity } from '../../../activity-types/defi.types';
import { CommentIcon } from './CommentIcon';
import type { ActivityCardProps } from './activity-card.types';
import {
  DefiTypeEnum,
  ECO_ACTIONS,
  getDefi,
  getDefiType,
  getLanguageTheme,
  isCooking,
  isEco,
  isFree,
  isLanguage,
} from 'src/activity-types/defi.constants';
import { RedButton } from 'src/components/buttons/RedButton';
import { bgPage } from 'src/styles/variables.const';
import { htmlToText } from 'src/utils';
import type { ActivityContent } from 'types/activity.type';
import { LinkNotAllowedInPath } from 'types/activity.type';

const defiTypeTitle: Record<DefiTypeEnum, (activity: DefiActivity) => string> = {
  [DefiTypeEnum.COOKING]: (activity) => (isCooking(activity) ? activity.data.name : ''),
  [DefiTypeEnum.ECOLOGICAL]: (activity) => (isEco(activity) ? ECO_ACTIONS[activity.data.type] : ''),
  [DefiTypeEnum.LINGUISTIC]: (activity) => (isLanguage(activity) ? getLanguageTheme(activity.data) : ''),
  [DefiTypeEnum.OTHER]: (activity) => (isFree(activity) ? activity.data.themeName : ''),
};

const defiTypeLink: Record<DefiTypeEnum, string> = {
  [DefiTypeEnum.COOKING]: 'culinaire/4',
  [DefiTypeEnum.ECOLOGICAL]: 'ecologique/4',
  [DefiTypeEnum.LINGUISTIC]: 'linguistique/5',
  [DefiTypeEnum.OTHER]: 'linguistique/5',
};

export const DefiCard = ({ activity, isSelf, noButtons, isDraft, showEditButtons, onDelete }: ActivityCardProps<DefiActivity>) => {
  const defiActivityType = getDefiType(activity);
  const link = defiTypeLink[defiActivityType];

  const defiImage = React.useMemo(() => getDefiImage(activity, defiActivityType), [activity, defiActivityType]);
  const defiTitle: string = defiTypeTitle[defiActivityType](activity);
  const defiDescription = useMemo(() => getDefiDescription(activity, defiActivityType), [activity, defiActivityType]);

  const router = useRouter();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
      }}
    >
      {defiImage && (
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
              <Image layout="fill" objectFit="contain" src={defiImage} unoptimized />
            ) : (
              <Link href={`/activite/${activity.id}`} passHref>
                <Image layout="fill" objectFit="contain" src={defiImage} unoptimized />
              </Link>
            )}
          </div>
        </div>
      )}
      <div style={{ margin: '0.25rem', flex: 1, minWidth: 0 }}>
        <h3 style={{ margin: '0 0.5rem 0.5rem' }}>{defiTitle}</h3>
        <div style={{ margin: '0 0.5rem 1rem', textAlign: 'justify' }}>
          <div className="text multine-with-ellipsis break-long-words" style={{ maxHeight: `${defiImage ? 4 : 2}rem` }}>
            {defiDescription}
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
              <Link href={`/activite/${activity.id}`} passHref>
                <Button component="a" color="primary" variant="outlined" href={`/activite/${activity.id}`}>
                  Relever le défi
                </Button>
              </Link>
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

function getDefiImage(activity: DefiActivity, defiActivityType: DefiTypeEnum): string | null {
  if (defiActivityType === DefiTypeEnum.COOKING) {
    return (activity.data as CookingDefiData).image || activity.content.find((c) => c.type === 'image')?.value || null;
  } else {
    return activity.content.find((c) => c.type === 'image')?.value || null;
  }
}

function getDefiDescription(activity: DefiActivity, defiActivityType: DefiTypeEnum): string {
  switch (defiActivityType) {
    case DefiTypeEnum.COOKING:
      return isCooking(activity) ? `${activity.data.history}. ${activity.data.explanation}` : '';
    case DefiTypeEnum.ECOLOGICAL:
    case DefiTypeEnum.LINGUISTIC:
    case DefiTypeEnum.OTHER:
      return getDefiContent(activity);
    default:
      return '';
  }
}

function getDefiContent(activity: DefiActivity): string {
  const firstTextContent = activity.content.find((content: ActivityContent) => content.type === 'text');
  return firstTextContent ? htmlToText(firstTextContent.value) : '';
}
