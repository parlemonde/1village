import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { isPresentation, isQuestion } from 'src/activities/anyActivity';
import { isThematique, isMascotte } from 'src/activities/presentation.const';
import { AvatarImg } from 'src/components/Avatar';
import { Base } from 'src/components/Base';
import { Flag } from 'src/components/Flag';
import { MascotteActivityView } from 'src/components/activities/MascotteActivityView';
import { AddComment } from 'src/components/activities/comments/AddComment';
import { CommentCard } from 'src/components/activities/comments/CommentCard';
import { SimpleActivityView } from 'src/components/activities';
import { UserContext } from 'src/contexts/userContext';
import { useActivity } from 'src/services/useActivity';
import { useComments } from 'src/services/useComments';
import { useVillageUsers } from 'src/services/useVillageUsers';
import HomeIcon from 'src/svg/navigation/home-icon.svg';
import PelicoNeutre from 'src/svg/pelico/pelico_neutre.svg';
import { toDate } from 'src/utils';
import { getQueryString, getUserDisplayName } from 'src/utils';
import { ActivityType } from 'types/activity.type';
import { User, UserType } from 'types/user.type';

const titles = {
  [ActivityType.PRESENTATION]: 'Présentation',
  [ActivityType.DEFI]: 'Défi',
  [ActivityType.GAME]: 'Jeu',
  [ActivityType.ENIGME]: 'Énigme',
  [ActivityType.QUESTION]: 'Question',
};

const labels = {
  [ActivityType.PRESENTATION]: 'Réagir à cette activité par :',
  [ActivityType.DEFI]: 'Réagir à cette activité par :',
  [ActivityType.GAME]: 'Réagir à cette activité par :',
  [ActivityType.ENIGME]: 'Réagir à cette activité par :',
  [ActivityType.QUESTION]: 'Répondre à cette question par :',
};

const Activity: React.FC = () => {
  const router = useRouter();
  const activityId = React.useMemo(() => parseInt(getQueryString(router.query.id), 10) ?? null, [router]);
  const { user } = React.useContext(UserContext);
  const { activity } = useActivity(activityId);
  const { comments } = useComments(activityId);
  const { users } = useVillageUsers();

  const usersMap = React.useMemo(() => {
    return users.reduce<{ [key: number]: User }>((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});
  }, [users]);
  const activityUser = activity === null ? null : usersMap[activity.userId] ?? null;
  const userIsPelico = activityUser !== null && activityUser.type >= UserType.MEDIATOR;
  const userIsSelf = activityUser !== null && user !== null && activityUser.id === user.id;

  if (activity === null || user === null) {
    return null;
  }

  return (
    <Base>
      <div className="activity__back-container">
        <Link href="/">
          <a href="/" className="activity__back-button">
            <HomeIcon className="activity__back-button-icon" />
            Accueil
          </a>
        </Link>
        <ChevronRightIcon />
        <span className="activity__back-button activity__back-button--lighter">Activité - {titles[activity.type]}</span>
      </div>

      <div className="activity__container">
        {activityUser !== null && (
          <div className="activity__header">
            <AvatarImg user={activityUser} size="small" style={{ margin: '0.25rem' }} />
            <div className="activity-card__header_info">
              <h2>{getUserDisplayName(activityUser, userIsSelf)}</h2>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <p className="text text--small">Publié le {toDate(activity.createDate as string)} </p>
                {userIsPelico ? (
                  <PelicoNeutre style={{ marginLeft: '0.6rem', height: '16px', width: 'auto' }} />
                ) : (
                  <Flag country={activityUser.countryCode} size="small" style={{ marginLeft: '0.6rem' }} />
                )}
              </div>
            </div>
          </div>
        )}
        {isPresentation(activity) && isThematique(activity) && <SimpleActivityView activity={activity} />}
        {isPresentation(activity) && isMascotte(activity) && <MascotteActivityView activity={activity} activityUser={activityUser} />}
        {isQuestion(activity) && <p>{activity.processedContent[0]?.value}</p>}

        <div className="activity__divider">
          <div className="activity__divider--text">
            <h2>Réaction des Pélicopains</h2>
          </div>
        </div>

        {comments.map((comment) => (
          <CommentCard key={comment.id} activityId={activityId} comment={comment} user={usersMap[comment.userId] ?? null} />
        ))}
        <AddComment activityId={activityId} label={labels[activity.type]} />
      </div>
    </Base>
  );
};

export default Activity;
