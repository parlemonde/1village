import React from 'react';

import { Button } from '@material-ui/core';

import { AnyActivity } from 'src/activity-types/anyActivities.types';
import { UserContext } from 'src/contexts/userContext';
import { useActivity } from 'src/services/useActivity';
import { useVillageUsers } from 'src/services/useVillageUsers';
import { primaryColor } from 'src/styles/variables.const';
import ArrowRight from 'src/svg/arrow-right.svg';
import { ActivityType } from 'types/activity.type';

import { ActivityCard } from './ActivityCard';

const REACTIONS = {
  [ActivityType.PRESENTATION]: 'une présentation',
  [ActivityType.DEFI]: 'un défi',
  [ActivityType.GAME]: 'un jeu',
  [ActivityType.ENIGME]: 'une énigme',
  [ActivityType.QUESTION]: 'une question',
};

interface ActivitiesProps {
  activities: AnyActivity[];
  withLinks?: boolean;
  noButtons?: boolean;
  onSelect?: (index: number) => void;
}

export const Activities: React.FC<ActivitiesProps> = ({ activities, noButtons = false, withLinks = false, onSelect }: ActivitiesProps) => {
  const [{ selectedActivityId, responseActivityId }, setResponseActivityId] = React.useState({
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
        const card = (
          <ActivityCard
            activity={activity}
            isSelf={user && activity.userId === user.id}
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
                      onClick={() => {
                        setResponseActivityId({ selectedActivityId: activity.id, responseActivityId: activity.responseActivityId });
                      }}
                      style={{ display: 'block', lineHeight: '0.8rem', padding: '0.4rem 0 0 0', margin: '0' }}
                    >
                      <span className="text text--small text--primary" style={{ fontSize: '0.8rem' }}>
                        En réponse à {REACTIONS[activity.responseType ?? 0]}
                      </span>
                      <br />
                      <img src="/link.png" style={{ width: '4rem', height: 'auto', cursor: 'pointer' }}></img>
                    </Button>
                  </div>
                </div>
                <div style={{ display: 'inline-flex', width: '50%', flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', width: '6rem', alignItems: 'center', justifyContent: 'center' }}>
                    <Button
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
                        isSelf={user && responseActivity.userId === user.id}
                        user={userMap[responseActivity.userId] !== undefined ? users[userMap[responseActivity.userId]] : undefined}
                        noButtons={true}
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
