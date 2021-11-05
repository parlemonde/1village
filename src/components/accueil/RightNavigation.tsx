import Image from 'next/image';
import React from 'react';

import { Button } from '@mui/material';

import { Map } from 'src/components/Map';
import { icons, DESC } from 'src/components/activities/utils';
import { useActivities } from 'src/services/useActivities';
import { useWeather } from 'src/services/useWeather';
import { primaryColor } from 'src/styles/variables.const';
import { getMapPosition } from 'src/utils/getMapPosition';
import { toDate } from 'src/utils';
import type { User } from 'types/user.type';

import { Flag } from '../Flag';
import { CommentIcon } from '../activities/ActivityCard/CommentIcon';

export const RightNavigation = ({ activityUser }: { activityUser: User }) => {
  const [position, setPosition] = React.useState<[number, number] | null>(null);
  const [localTime, setLocalTime] = React.useState<string | null>(null);
  const weather = useWeather({ activityUser });
  const { activities } = useActivities({
    limit: 200,
    page: 0,
    type: [],
    userId: activityUser?.id ?? 0,
  });

  const getPosition = React.useCallback(async () => {
    if (activityUser === null) {
      setPosition(null);
    } else {
      const pos = await getMapPosition(activityUser);
      setPosition(pos);
    }
  }, [activityUser]);

  React.useEffect(() => {
    getPosition().catch();
  }, [activityUser, getPosition]);

  React.useEffect(() => {
    if (weather !== null) {
      const timezone = weather.timezone;
      const updateLocalTime = () => {
        const time = new Date();
        time.setHours(time.getHours() + time.getTimezoneOffset() / 60 + timezone / 3600);
        setLocalTime(`${`0${time.getHours()}`.slice(-2)}h${`0${time.getMinutes()}`.slice(-2)}`);
      };
      updateLocalTime();
      const interval = window.setInterval(updateLocalTime, 10000); // every 10 seconds
      return () => {
        window.clearInterval(interval);
      };
    } else {
      return () => {};
    }
  }, [weather]);

  return (
    <>
      <div className="bg-secondary" style={{ borderRadius: '10px', overflow: 'hidden', marginBottom: '2rem' }}>
        {position !== null && (
          <div style={{ height: '14rem' }}>
            <Map position={position} zoom={5} markers={[{ position: position, label: activityUser?.address }]} />
          </div>
        )}
      </div>
      {weather !== null && (
        <div
          className="bg-secondary"
          style={{
            fontWeight: 'bold',
            padding: '1rem',
            borderRadius: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            marginBottom: '2rem',
          }}
        >
          <div style={{ marginBottom: '1rem' }}>
            <Flag country={activityUser?.country.isoCode}></Flag> {activityUser?.city}
          </div>
          {localTime}
          <Image layout="fixed" width="100px" height="100px" objectFit="contain" src={weather.iconUrl} unoptimized />
          {weather.temperature}°C
        </div>
      )}
      <div
        className="bg-secondary"
        style={{ padding: '1rem', borderRadius: '10px', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}
      >
        <h3>
          <b>Dernières activités</b>
        </h3>
        {activities.slice(0, 3).map((activity, index) => {
          const ActivityIcon = icons[activity.type] || null;
          return (
            <div key={index}>
              <div style={{ fontSize: 'smaller', paddingBottom: '1rem' }}>
                <strong>{DESC[activity.type]},&nbsp;</strong>
                le {toDate(activity.createDate as string)}
                {ActivityIcon && (
                  <ActivityIcon
                    style={{ float: 'right', fill: primaryColor, margin: '0 0.65rem', width: '2rem', height: 'auto', alignSelf: 'center' }}
                  />
                )}
              </div>
              <div style={{ float: 'right', paddingBottom: '1rem' }}>
                <CommentIcon count={activity.commentCount} activityId={activity.id} />
                <Button component="a" color="primary" variant="outlined" href={`/activite/${activity.id}`}>
                  {"Voir l'activité"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
