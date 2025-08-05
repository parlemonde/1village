import React from 'react';

import { Button } from '@mui/material';

import { CommentIcon } from '../activities/ActivityCard/CommentIcon';
import { icons, DESC } from 'src/components/activities/utils';
import { useActivities } from 'src/services/useActivities';
import { primaryColor } from 'src/styles/variables.const';
import { toDate } from 'src/utils';
import { ActivityType } from 'types/activity.type';
import type { User } from 'types/user.type';

interface Props {
  title: string;
  activityUser: User;
}

export const LastActivities: React.FC<Props> = ({ title, activityUser }) => {
  const { activities } = useActivities({
    limit: 200,
    page: 0,
    type: [],
    userId: activityUser?.id ?? 0,
  });

  return (
    <div
      className="bg-secondary vertical-bottom-margin"
      style={{ padding: '1rem', borderRadius: '10px', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}
    >
      <h3>
        <b>{title}</b>
      </h3>
      {activities.slice(0, 3).map((activity, index) => {
        const ActivityIcon = icons[activity.type] || null;
        return (
          <div key={index}>
            {activity.type !== ActivityType.GAME && (
              <>
                <div style={{ fontSize: 'smaller', paddingBottom: '1rem' }}>
                  <strong>{DESC[activity.type]},&nbsp;</strong>
                  le {toDate(activity.publishDate as string)}
                  {ActivityIcon && (
                    <ActivityIcon
                      style={{
                        float: 'right',
                        fill: primaryColor,
                        margin: '1.5rem 0.65rem 0 0',
                        width: '2rem',
                        height: 'auto',
                        alignSelf: 'center',
                      }}
                    />
                  )}
                </div>
                <div style={{ paddingBottom: '1rem' }}>
                  <CommentIcon count={activity.commentCount} activityId={activity.id} />
                  <Button component="a" color="primary" variant="outlined" href={`/activite/${activity.id}`}>
                    {"Voir l'activité"}
                  </Button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
