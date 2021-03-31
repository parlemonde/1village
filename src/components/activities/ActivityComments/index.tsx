import React from 'react';

import { useComments } from 'src/services/useComments';
import { ActivityType } from 'types/activity.type';
import { User } from 'types/user.type';

import { AddComment } from './AddComment';
import { CommentCard } from './CommentCard';

const labels = {
  [ActivityType.PRESENTATION]: 'Réagir à cette activité par :',
  [ActivityType.DEFI]: 'Réagir à cette activité par :',
  [ActivityType.GAME]: 'Réagir à cette activité par :',
  [ActivityType.ENIGME]: 'Réagir à cette activité par :',
  [ActivityType.QUESTION]: 'Répondre à cette question par :',
};

interface ActivityCommentsProps {
  activityId: number;
  activityType: ActivityType;
  usersMap: { [key: number]: User };
}

export const ActivityComments: React.FC<ActivityCommentsProps> = ({ activityId, activityType, usersMap }: ActivityCommentsProps) => {
  const { comments } = useComments(activityId);

  return (
    <div>
      <div className="activity__divider">
        <div className="activity__divider--text">
          <h2>Réaction des Pélicopains</h2>
        </div>
      </div>
      {comments.map((comment) => (
        <CommentCard key={comment.id} activityId={activityId} comment={comment} user={usersMap[comment.userId] ?? null} />
      ))}
      <AddComment activityId={activityId} activityType={activityType} label={labels[activityType]} />
    </div>
  );
};
