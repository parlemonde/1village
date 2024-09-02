import React, { useState } from 'react';

import type { SelectChangeEvent } from '@mui/material';
import { Typography, Button } from '@mui/material';

import PaginationNav from '../PaginationNav/PaginationNav';
import { ActivityCard } from './ActivityCard';
import { isAnthem } from 'src/activity-types/anyActivity';
import { UserContext } from 'src/contexts/userContext';
import { useActivity } from 'src/services/useActivity';
import { useVillageUsers } from 'src/services/useVillageUsers';
import { defaultTextButtonStyle, primaryColor } from 'src/styles/variables.const';
import ArrowRight from 'src/svg/arrow-right.svg';
import ReactionIcon from 'src/svg/navigation/reaction-icon.svg';
import type { Activity, AnyData } from 'types/activity.type';
import type { User } from 'types/user.type';

interface ActivitiesProps {
  activities: Activity[];
  withLinks?: boolean;
  withPagination?: boolean;
  noButtons?: boolean;
  onSelect?: (index: number) => void;
}

type CardProps = {
  activity: Activity<AnyData>;
  user: User | null;
  users: User[];
  userMap: { [key: number]: number };
  noButtons: boolean;
  onSelect?: (index: number) => void;
  index: number;
};

const Card = ({ activity, user, users, userMap, noButtons, index, onSelect = undefined }: CardProps) => (
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
  const [activitiesPerPage, setActivitiesPerPage] = React.useState(25);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, activitiesPerPage]);

  const handlePage = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleActivitiesPerPage = (e: SelectChangeEvent<string>) => {
    setPage(1);
    setActivitiesPerPage(parseInt(e.target.value));
  };

  const startIdx = (page - 1) * activitiesPerPage;
  const endIdx = startIdx + activitiesPerPage;

  const cardProps = {
    user,
    users,
    userMap,
    noButtons,
    onSelect,
  };

  const currentPageActivities = activities.filter((activity) => !isAnthem(activity)).slice(startIdx, endIdx);

  return (
    <div>
      {currentPageActivities.map((activity, index) =>
        withLinks && activity.responseActivityId !== null ? (
          <div style={{ width: '100%', overflow: 'hidden' }} key={`container_${activity.id}`}>
            <div
              style={{
                width: '200%',
                display: 'flex',
                transition: 'transform 250ms ease-in-out',
                alignItems: 'center',
                transform: selectedActivityId === activity.id ? 'translateX(-50%)' : 'none',
              }}
            >
              <div style={{ display: 'inline-flex', width: '50%', flex: 1, minWidth: 0 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Card {...cardProps} activity={activity} index={index} />
                </div>
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
        ) : (
          <Card key={index} activity={activity} index={index} {...cardProps} />
        ),
      )}
      {withPagination && (
        <PaginationNav
          page={page}
          itemsPerPage={activitiesPerPage}
          totalItems={activities.length}
          handlePage={handlePage}
          handleItemsPerPage={handleActivitiesPerPage}
        />
      )}
    </div>
  );
};
