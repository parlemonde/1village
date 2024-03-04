import React, { useState } from 'react';

import { Button, Pagination, Stack } from '@mui/material';

import { ActivityCard } from './ActivityCard';
import { isAnthem } from 'src/activity-types/anyActivity';
import { UserContext } from 'src/contexts/userContext';
import { useActivity } from 'src/services/useActivity';
import { useVillageUsers } from 'src/services/useVillageUsers';
import { defaultTextButtonStyle, primaryColor } from 'src/styles/variables.const';
import ArrowRight from 'src/svg/arrow-right.svg';
import ReactionIcon from 'src/svg/navigation/reaction-icon.svg';
import type { Activity } from 'types/activity.type';

interface ActivitiesProps {
  activities: Activity[];
  withLinks?: boolean;
  withPagination?: boolean;
  noButtons?: boolean;
  onSelect?: (index: number) => void;
}

export const Activities = ({ activities, noButtons = false, withLinks = false, withPagination = false, onSelect }: ActivitiesProps) => {
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
  const [page, setPage] = useState<number>(1);

  const handlePage = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const activitiesPerPage = 25;
  const startIdx = (page - 1) * activitiesPerPage;
  const endIdx = startIdx + activitiesPerPage;

  return (
    <div>
      {activities
        .filter((activity) => !isAnthem(activity))
        .slice(startIdx, endIdx)
        .map((activity, index) => {
          const card = (
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
      {withPagination && activities.length > activitiesPerPage && (
        <Stack spacing={2} alignItems="center">
          <Pagination count={Math.ceil(activities.length / activitiesPerPage)} page={page} onChange={handlePage} variant="outlined" />
        </Stack>
      )}
    </div>
  );
};
