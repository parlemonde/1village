import React from 'react';

import Paper from '@material-ui/core/Paper';

import { Flag } from 'src/components/Flag';
import { primaryColor } from 'src/styles/variables.const';
import GameIcon from 'src/svg/navigation/game-icon.svg';
import KeyIcon from 'src/svg/navigation/key-icon.svg';
import QuestionIcon from 'src/svg/navigation/question-icon.svg';
import TargetIcon from 'src/svg/navigation/target-icon.svg';
import UserIcon from 'src/svg/navigation/user-icon.svg';
import PelicoNeutre from 'src/svg/pelico/pelico_neutre.svg';
import { getGravatarUrl, toDate } from 'src/utils';
import { ActivityType } from 'types/activity.type';
import { UserType } from 'types/user.type';

import { PresentationCard } from './PresentationCard';
import { ActivityCardProps } from './activity-card.types';

const titles = {
  [ActivityType.PRESENTATION]: 'créé une présentation',
  [ActivityType.DEFI]: 'créé un défi',
  [ActivityType.GAME]: 'lancé un jeu',
  [ActivityType.ENIGME]: 'créé une énigme',
  [ActivityType.QUESTION]: 'posé une question',
};
const icons = {
  [ActivityType.PRESENTATION]: UserIcon,
  [ActivityType.DEFI]: TargetIcon,
  [ActivityType.GAME]: GameIcon,
  [ActivityType.ENIGME]: KeyIcon,
  [ActivityType.QUESTION]: QuestionIcon,
};

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, user, isSelf = false, showEditButtons = false }: ActivityCardProps) => {
  if (!user) {
    return null;
  }
  const userIsPelico = user.type >= UserType.MEDIATOR;
  const ActivityIcon = icons[activity.type] || null;

  return (
    <Paper variant="outlined" square style={{ margin: '1rem 0' }}>
      <div className="activity-card__header">
        <img alt="Image de profil" src={getGravatarUrl(user.email)} width="40px" height="40px" style={{ borderRadius: '20px', margin: '0.25rem' }} />
        <div className="activity-card__header_info">
          <p className="text">
            {userIsPelico ? 'Pelico a ' : isSelf ? 'Votre classe a ' : 'La classe de ??? à ??? a '}
            <strong>{titles[activity.type]}</strong>
          </p>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <p className="text text--small">Publié le {toDate(activity.createDate as string)} </p>
            {userIsPelico ? (
              <PelicoNeutre style={{ marginLeft: '0.6rem', height: '16px', width: 'auto' }} />
            ) : (
              <Flag country={user.countryCode} size="small" style={{ marginLeft: '0.6rem' }} />
            )}
          </div>
        </div>
        {ActivityIcon && <ActivityIcon style={{ fill: primaryColor, margin: '0 0.65rem' }} height="45px" />}
      </div>
      <div className="activity-card__content">
        {activity.type === ActivityType.PRESENTATION && (
          <PresentationCard activity={activity} user={user} isSelf={isSelf} showEditButtons={showEditButtons} />
        )}
      </div>
    </Paper>
  );
};
