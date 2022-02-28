import React from 'react';

import Paper from '@mui/material/Paper';

import {
  isDefi,
  isEnigme,
  isFreeContent,
  isGame,
  isIndice,
  isMascotte,
  isPresentation,
  isQuestion,
  isReaction,
  isReportage,
  isSymbol,
} from 'src/activity-types/anyActivity';
import { getEnigmeTimeLeft } from 'src/activity-types/enigme.constants';
import { AvatarImg } from 'src/components/Avatar';
import { Flag } from 'src/components/Flag';
import { UserDisplayName } from 'src/components/UserDisplayName';
import { useActivity } from 'src/services/useActivity';
import { primaryColor } from 'src/styles/variables.const';
import Timer from 'src/svg/enigme/timer.svg';
import PelicoNeutre from 'src/svg/pelico/pelico_neutre.svg';
import PinIcon from 'src/svg/pin.svg';
import { toDate } from 'src/utils';
import { UserType } from 'types/user.type';

import { titles, icons, REACTIONS } from '../utils';

import { DefiCard } from './DefiCard';
import { EnigmeCard } from './EnigmeCard';
import { FreeContentCard } from './FreeContentCard';
import { IndiceCard } from './IndiceCard';
import { MascotteCard } from './MascotteCard';
import { MimicCard } from './MimicCard';
import { PresentationCard } from './PresentationCard';
import { QuestionCard } from './QuestionCard';
import { ReactionCard } from './ReactionCard';
import { ReportageCard } from './ReportageCard';
import { SymbolCard } from './SymbolCard';
import type { ActivityCardProps } from './activity-card.types';

export const ActivityCard = ({
  activity,
  user,
  isSelf = false,
  noButtons = false,
  showEditButtons = false,
  isDraft = false,
  forComment = false,
  noMargin = false,
  onDelete = () => {},
  onSelect,
}: ActivityCardProps) => {
  const { activity: responseActivity } = useActivity(activity.responseActivityId ?? -1);
  if (!user) {
    return null;
  }
  const userIsPelico = user.type >= UserType.MEDIATOR;
  const ActivityIcon = icons[activity.type] || null;
  const timeLeft = isEnigme(activity) ? getEnigmeTimeLeft(activity) : 0;

  return (
    activity && (
      <Paper
        className={onSelect !== undefined ? 'activity-card--selectable' : ''}
        variant={forComment ? 'elevation' : 'outlined'}
        square={!forComment}
        elevation={forComment ? 2 : 0}
        onClick={() => {
          if (onSelect !== undefined) {
            onSelect();
          }
        }}
        style={{
          margin: noMargin || forComment ? '0' : '1rem 0',
          cursor: onSelect !== undefined ? 'pointer' : 'unset',
          border: activity?.isPinned ? `2px solid ${primaryColor}` : undefined,
        }}
      >
        <div className="activity-card__header">
          {forComment || <AvatarImg user={user} size="small" style={{ margin: '0.25rem 0rem 0.25rem 0.25rem' }} noLink={noButtons} />}
          <div className="activity-card__header_info" style={forComment ? { marginLeft: '0.5rem' } : {}}>
            <p className="text">
              <UserDisplayName className="text" user={user} noLink={noButtons} />
              {' a '}
              {responseActivity && isReaction(activity) ? (
                <strong>
                  {titles[activity.type]} {REACTIONS[responseActivity?.type]}
                </strong>
              ) : (
                <strong>{titles[activity.type]}</strong>
              )}
            </p>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <p className="text text--small">Publié le {toDate(activity.createDate as string)} </p>
              {userIsPelico ? (
                <PelicoNeutre style={{ marginLeft: '0.6rem', height: '16px', width: 'auto' }} />
              ) : (
                <Flag country={user?.country.isoCode} size="small" style={{ marginLeft: '0.6rem' }} />
              )}
            </div>
          </div>
          {!showEditButtons && isEnigme(activity) && (
            <>
              <Timer style={{ alignSelf: 'center', height: '1.2rem', width: 'auto', marginRight: '0.25rem' }} />
              <div style={{ alignSelf: 'center', marginRight: '0.5rem', lineHeight: '0.875rem' }}>
                <span className="text text--small text--error">{timeLeft > 0 ? `Temps restant: ${timeLeft}j` : 'La réponse est disponible !'}</span>
              </div>
            </>
          )}
          {activity.isPinned && <PinIcon style={{ fill: primaryColor, margin: '0 0.65rem', width: '2rem', height: 'auto', alignSelf: 'center' }} />}
          {ActivityIcon && !isReaction(activity) && (
            <ActivityIcon
              style={{ fill: primaryColor, color: primaryColor, margin: '0 0.65rem', width: '2rem', height: 'auto', alignSelf: 'center' }}
            />
          )}
        </div>
        <div className="activity-card__content">
          {isMascotte(activity) && (
            <MascotteCard
              activity={activity}
              user={user}
              isSelf={isSelf}
              noButtons={noButtons}
              showEditButtons={showEditButtons}
              isDraft={isDraft}
              onDelete={onDelete}
            />
          )}
          {isPresentation(activity) && (
            <PresentationCard
              activity={activity}
              user={user}
              isSelf={isSelf}
              noButtons={noButtons}
              showEditButtons={showEditButtons}
              isDraft={isDraft}
              onDelete={onDelete}
            />
          )}
          {isQuestion(activity) && (
            <QuestionCard
              activity={activity}
              user={user}
              isSelf={isSelf}
              noButtons={noButtons}
              showEditButtons={showEditButtons}
              isDraft={isDraft}
              onDelete={onDelete}
            />
          )}
          {isEnigme(activity) && (
            <EnigmeCard
              activity={activity}
              user={user}
              isSelf={isSelf}
              noButtons={noButtons}
              showEditButtons={showEditButtons}
              isDraft={isDraft}
              onDelete={onDelete}
            />
          )}
          {isDefi(activity) && (
            <DefiCard
              activity={activity}
              user={user}
              isSelf={isSelf}
              noButtons={noButtons}
              showEditButtons={showEditButtons}
              isDraft={isDraft}
              onDelete={onDelete}
            />
          )}
          {isFreeContent(activity) && (
            <FreeContentCard
              activity={activity}
              user={user}
              isSelf={isSelf}
              noButtons={noButtons}
              showEditButtons={showEditButtons}
              isDraft={isDraft}
              onDelete={onDelete}
            />
          )}
          {isIndice(activity) && (
            <IndiceCard
              activity={activity}
              user={user}
              isSelf={isSelf}
              noButtons={noButtons}
              showEditButtons={showEditButtons}
              isDraft={isDraft}
              onDelete={onDelete}
            />
          )}
          {isSymbol(activity) && (
            <SymbolCard
              activity={activity}
              user={user}
              isSelf={isSelf}
              noButtons={noButtons}
              showEditButtons={showEditButtons}
              isDraft={isDraft}
              onDelete={onDelete}
            />
          )}
          {isGame(activity) && (
            <MimicCard
              activity={activity}
              user={user}
              isSelf={isSelf}
              noButtons={noButtons}
              showEditButtons={showEditButtons}
              isDraft={isDraft}
              onDelete={onDelete}
            />
          )}
          {isReportage(activity) && (
            <ReportageCard
              activity={activity}
              user={user}
              isSelf={isSelf}
              noButtons={noButtons}
              showEditButtons={showEditButtons}
              isDraft={isDraft}
              onDelete={onDelete}
            />
          )}
          {isReaction(activity) && (
            <ReactionCard
              activity={activity}
              user={user}
              isSelf={isSelf}
              noButtons={noButtons}
              showEditButtons={showEditButtons}
              isDraft={isDraft}
              onDelete={onDelete}
            />
          )}
        </div>
      </Paper>
    )
  );
};
