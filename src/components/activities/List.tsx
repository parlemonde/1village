import React from 'react';

import { Button } from '@mui/material';

import { isAnthem } from 'src/activity-types/anyActivity';
import { UserContext } from 'src/contexts/userContext';
import { useActivity } from 'src/services/useActivity';
import { useVillageUsers } from 'src/services/useVillageUsers';
import { defaultTextButtonStyle, primaryColor } from 'src/styles/variables.const';
import ArrowRight from 'src/svg/arrow-right.svg';
import ReactionIcon from 'src/svg/navigation/reaction-icon.svg';
import type { Activity } from 'types/activity.type';

import { ActivityCard } from './ActivityCard';

interface ActivitiesProps {
  activities: Activity[];
  withLinks?: boolean;
  noButtons?: boolean;
  onSelect?: (index: number) => void;
}

export const Activities = ({ activities, noButtons = false, withLinks = false, onSelect }: ActivitiesProps) => {
  const [{ selectedActivityId, responseActivityId }, setResponseActivityId] = React.useState<{
    selectedActivityId: number | null;
    responseActivityId?: number | null;
  }>({
    selectedActivityId: null,
    responseActivityId: null,
  });
  const { activity: responseActivity } = useActivity(responseActivityId ?? -1);
  const { user } = React.useContext(UserContext);
  const { users } = useVillageUsers();
  const userMap = React.useMemo(
    () =>
      users.reduce<{ [key: number]: number }>((acc, u, index) => {
        acc[u.id] = index;
        return acc;
      }, {}),
    [users],
  );

  return (
    <div>
      {activities.map((activity, index) => {
        const card = isAnthem(activity) ? null : (
          <ActivityCard
            activity={activity}
            isSelf={user !== null && activity.userId === user.id}
            user={userMap[activity.userId] !== undefined ? users[userMap[activity.userId]] : undefined}
            key={activity.id}
            noButtons={noButtons}
            onSelect={
              onSelect
                ? () => {
                    onSelect(index);
                  }
                : undefined
            }
          />
        );
        if (withLinks && activity.responseActivityId !== null) {
          const translated = selectedActivityId === activity.id;
          return (
            <div style={{ width: '100%', overflow: 'hidden' }} key={`container_${activity.id}`}>
              <div
                style={{
                  width: '200%',
                  display: 'flex',
                  transition: 'transform 250ms ease-in-out',
                  alignItems: 'center',
                  transform: translated ? 'translateX(-50%)' : 'none',
                }}
              >
                <div style={{ display: 'inline-flex', width: '50%', flex: 1, minWidth: 0 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>{card}</div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '6.4rem',
                      padding: '0.2rem',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Button
                      color="inherit"
                      sx={defaultTextButtonStyle}
                      onClick={() => {
                        setResponseActivityId({ selectedActivityId: activity.id, responseActivityId: activity.responseActivityId });
                      }}
                      style={{ display: 'block', lineHeight: '0.8rem', padding: '0.4rem 0 0 0', margin: '0' }}
                    >
                      <span className="text text--small text--primary" style={{ fontSize: '0.8rem' }}>
                        En réaction à
                      </span>
                      <ReactionIcon
                        style={{
                          fill: primaryColor,
                          width: '4rem',
                          height: '4rem',
                          cursor: 'pointer',
                          position: 'relative',
                          display: 'inline-block',
                        }}
                      />
                    </Button>
                  </div>
                </div>
                <div style={{ display: 'inline-flex', width: '50%', flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', width: '6rem', alignItems: 'center', justifyContent: 'center' }}>
                    <Button
                      color="inherit"
                      sx={defaultTextButtonStyle}
                      onClick={() => {
                        setResponseActivityId({ selectedActivityId: null, responseActivityId: null });
                      }}
                      style={{ display: 'block', lineHeight: '0.8rem', padding: '0.6rem 0', margin: '0' }}
                    >
                      <ArrowRight style={{ width: '2rem', height: 'auto', cursor: 'pointer', fill: primaryColor }} />
                    </Button>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    {responseActivity !== null && (
                      <ActivityCard
                        activity={responseActivity}
                        isSelf={user !== null && responseActivity.userId === user.id}
                        user={userMap[responseActivity.userId] !== undefined ? users[userMap[responseActivity.userId]] : undefined}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        }
        return card;
      })}
    </div>
  );
};
