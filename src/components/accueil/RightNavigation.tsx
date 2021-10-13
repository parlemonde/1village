import React from 'react';

import { Button } from '@material-ui/core';

import { Map } from 'src/components/Map';
import { icons, REACTIONS } from 'src/components/activities/titles';
import { useActivities } from 'src/services/useActivities';
import { primaryColor } from 'src/styles/variables.const';
import { getLocalTempHour } from 'src/utils/getLocalTempHour';
import { getMapPosition } from 'src/utils/getMapPosition';
import { toDate } from 'src/utils';
import type { User } from 'types/user.type';

import { Flag } from '../Flag';
import { CommentIcon } from '../activities/ActivityCard/CommentIcon';

export const RightNavigation = ({ activityUser }: { activityUser: User }) => {
  const [position, setPosition] = React.useState<[number, number] | null>(null);
  const [localTemp, setLocalTemp] = React.useState(0);
  const [localTime, setLocalTime] = React.useState('');
  const [weatherIconUrl, setWeatherIconUrl] = React.useState('');
  const { activities } = useActivities({
    limit: 50,
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
    const asyncFunc = async () => {
      if (activityUser && !localTime && !localTemp) {
        const { time, temp, iconUrl } = await getLocalTempHour(activityUser, true);
        const dateTime = new Date(time);
        setLocalTemp(temp);
        setLocalTime(`${dateTime.getHours()}h${(dateTime.getMinutes() < 10 ? '0' : '') + dateTime.getMinutes()}`);
        setWeatherIconUrl(iconUrl);
      }
    };
    asyncFunc();
  }, [activityUser, getPosition]);

  return (
    <>
      <div className="bg-secondary" style={{ borderRadius: '10px', overflow: 'hidden', marginBottom: '2rem' }}>
        {position !== null && (
          <div style={{ height: '14rem' }}>
            <Map position={position} zoom={5} markers={[{ position: position, label: 'salut' }]} />
          </div>
        )}
      </div>
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
        {activityUser && (
          <>
            <div style={{ marginBottom: '1rem' }}>
              <Flag country={activityUser?.countryCode}></Flag> {activityUser?.city}
            </div>
            {localTime}
            <img src={weatherIconUrl}></img>
            {Math.floor(localTemp)}°C
          </>
        )}
      </div>
      <div
        className="bg-secondary"
        style={{ padding: '1rem', borderRadius: '10px', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}
      >
        <h3>
          <b>Nos dernières activités</b>
        </h3>
        {activities.slice(0, 3).map((activity, index) => {
          const ActivityIcon = icons[activity.type] || null;
          return (
            <div key={index}>
              <div style={{ fontSize: 'smaller', paddingBottom: '1rem' }}>
                <strong>{REACTIONS[activity.type]},&nbsp;</strong>
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
