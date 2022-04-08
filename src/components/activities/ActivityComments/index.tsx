import React from 'react';

import { AvatarImg } from 'src/components/Avatar';
import { UserContext } from 'src/contexts/userContext';
import { useActivities } from 'src/services/useActivities';
import { useComments } from 'src/services/useComments';
import { useVillageUsers } from 'src/services/useVillageUsers';
import type { User } from 'types/user.type';

import { ActivityCard } from '../ActivityCard';

import { AddComment } from './AddComment';
import { CommentCard } from './CommentCard';

interface ActivityCommentsProps {
  activityId: number;
  activityType: number;
  activityPhase: number;
  usersMap: { [key: number]: User };
}
type ResponseDataStoriesId = {
  image_activityId: number;
};

export const ActivityComments = ({ activityId, activityType, activityPhase, usersMap }: ActivityCommentsProps) => {
  const { user, axiosLoggedRequest } = React.useContext(UserContext);
  const { users } = useVillageUsers();
  const [storyActivityIds, setStoryActivityIds] = React.useState<number[]>([]);

  //Get stories who was inspired by this activity
  const getStoryActivityIds = React.useCallback(
    async (id: number) => {
      const response = await axiosLoggedRequest({
        method: 'GET',
        url: `/stories/${id}`,
      });
      if (!response.error && response.data) {
        const { storyActivityIds } = response.data;
        const idsStories = Array.from(
          // eslint-disable-next-line camelcase
          new Set(storyActivityIds.map(({ image_activityId }: ResponseDataStoriesId) => image_activityId)),
        );
        setStoryActivityIds(idsStories as number[]);
      }
    },
    [axiosLoggedRequest],
  );

  React.useEffect(() => {
    getStoryActivityIds(activityId).catch();
  }, [activityId, getStoryActivityIds]);
  console.log({ storyActivityIds });

  const userMap = React.useMemo(
    () =>
      users.reduce<{ [key: number]: number }>((acc, u, index) => {
        acc[u.id] = index;
        return acc;
      }, {}),
    [users],
  );
  const { comments } = useComments(activityId);
  const { activities } = useActivities({
    limit: 200,
    page: 0,
    responseActivityId: activityId,
  });

  const data = React.useMemo(() => {
    return [...comments.map((c) => ({ data: c, type: 'comment' as const })), ...activities.map((a) => ({ data: a, type: 'activity' as const }))].sort(
      (a, b) => new Date(a.data.createDate || '').getTime() - new Date(b.data.createDate || '').getTime(),
    );
  }, [comments, activities]);

  return (
    <div>
      <div className="activity__divider">
        <div className="activity__divider--text">
          <h2>Réaction des Pélicopains</h2>
        </div>
      </div>
      {data.map((o) => {
        if (o.type === 'comment') {
          const comment = o.data;
          return <CommentCard key={comment.id} activityId={activityId} comment={comment} user={usersMap[comment.userId] ?? null} />;
        } else {
          const activity = o.data;
          const activityUser = userMap[activity.userId] !== undefined ? users[userMap[activity.userId]] : undefined;
          return (
            <div key={activity.id} className="activity__comment-container">
              <AvatarImg user={activityUser} size="small" style={{ margin: '0.25rem' }} />
              <div className="activity__comment-card activity__comment-card--no-padding">
                <ActivityCard activity={activity} isSelf={user !== null && activity.userId === user.id} user={activityUser} forComment />
              </div>
            </div>
          );
        }
      })}
      <AddComment activityId={activityId} activityType={activityType} activityPhase={activityPhase} />
    </div>
  );
};
