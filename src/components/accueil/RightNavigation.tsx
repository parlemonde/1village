import { Button, Link, Tooltip } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

import { AvatarImg } from '../Avatar';
import { Flag } from '../Flag';
import { CommentIcon } from '../activities/ActivityCard/CommentIcon';
import { isMascotte } from 'src/activity-types/anyActivity';
import { Map } from 'src/components/Map';
import { icons, DESC } from 'src/components/activities/utils';
import { UserContext } from 'src/contexts/userContext';
import { useActivities } from 'src/services/useActivities';
import { useActivity } from 'src/services/useActivity';
import { useWeather } from 'src/services/useWeather';
import { primaryColor } from 'src/styles/variables.const';
import { getUserDisplayName, toDate } from 'src/utils';
import { ActivityType } from 'types/activity.type';
import type { User } from 'types/user.type';
import { UserType } from 'types/user.type';

export const RightNavigation = ({ activityUser, displayAsUser = false }: { activityUser: User; displayAsUser?: boolean }) => {
  const router = useRouter();
  const [localTime, setLocalTime] = React.useState<string | null>(null);
  const { user } = React.useContext(UserContext);
  const weather = useWeather({ activityUser });
  const { activity: userMascotte } = useActivity(activityUser.mascotteId || -1);
  const { activities } = useActivities({
    limit: 200,
    page: 0,
    type: [],
    userId: activityUser?.id ?? 0,
  });
  const isPelico = activityUser.type > UserType.TEACHER;
  const isMediator = user !== null && user.type > UserType.TEACHER;

  const onclick = React.useCallback(() => {
    router.push(`/activite/${activityUser.mascotteId}`);
  }, [activityUser.mascotteId, router]);

  // ---- Get user weather and time ----
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

  if (isPelico) {
    return (
      <>
        <div
          className="bg-secondary vertical-bottom-margin with-sub-header-height"
          style={{
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 0.5rem',
          }}
        >
          <Link href="/pelico-profil" underline="none" color="inherit">
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', minWidth: 0, cursor: 'pointer' }}>
              <span style={{ marginRight: '0.3rem', display: 'flex' }}>
                <AvatarImg user={activityUser} size="extra-small" noLink displayAsUser={displayAsUser} onClick={onclick} />
              </span>
              <span className="text">
                <strong>Pelico</strong>
              </span>
            </div>
          </Link>
        </div>
        <div
          className="bg-secondary vertical-bottom-margin"
          style={{ padding: '1rem', borderRadius: '10px', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}
        >
          <h3>
            <b>Dernières activités de Pelico</b>
          </h3>
          {activities.slice(0, 3).map((activity, index) => {
            const ActivityIcon = icons[activity.type] || null;
            return (
              <div key={index}>
                {activity.type !== ActivityType.GAME && (
                  <>
                    <div style={{ fontSize: 'smaller', paddingBottom: '1rem' }}>
                      <strong>{DESC[activity.type]},&nbsp;</strong>
                      le {toDate(activity.createDate as string)}
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
      </>
    );
  }
  return (
    <>
      <div
        className="bg-secondary vertical-bottom-margin with-sub-header-height"
        style={{
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 0.5rem',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', minWidth: 0 }}>
          <span style={{ marginRight: '0.3rem', display: 'flex' }}>
            {activityUser.avatar && activityUser.mascotteId ? (
              <AvatarImg user={activityUser} size="extra-small" noLink onClick={onclick} style={{ cursor: 'pointer' }} />
            ) : (
              <Tooltip title="la classe n'a pas encore de mascotte">
                <span style={{ alignItems: 'center', cursor: 'not-allowed' }}>
                  <AvatarImg user={activityUser} size="extra-small" />
                </span>
              </Tooltip>
            )}
          </span>
          {userMascotte && isMascotte(userMascotte) ? (
            <span
              className="text"
              style={{ fontSize: '0.9rem', margin: '0 0.25rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
            >
              <strong>{userMascotte.data.mascotteName}</strong>
            </span>
          ) : (
            <span
              className="text"
              style={{ fontSize: '0.9rem', margin: '0 0.25rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
            >
              {getUserDisplayName(activityUser, user !== null && user.id === activityUser.id)}
            </span>
          )}
        </div>
        <span style={{ marginLeft: '0.25rem', display: 'flex' }}>
          <Flag country={activityUser.country?.isoCode}></Flag>
        </span>
      </div>
      {isMediator && (
        <Button
          component="a"
          href={`https://prof.parlemonde.org/les-professeurs-partenaires/${activityUser.pseudo}/profile`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ overflow: 'hidden', margin: '2rem 2rem 2.5rem 2rem', textAlign: 'center' }}
          variant="outlined"
        >
          Voir la fiche du professeur
        </Button>
      )}
      <div className="bg-secondary vertical-bottom-margin" style={{ borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ height: '14rem' }}>
          <Map
            position={activityUser.position}
            zoom={3}
            markers={[{ position: activityUser.position, label: activityUser.address, activityCreatorMascotte: activityUser.mascotteId }]}
          />
        </div>
      </div>
      {weather !== null && (
        <div
          className="bg-secondary vertical-bottom-margin"
          style={{
            fontWeight: 'bold',
            padding: '1rem',
            borderRadius: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <div style={{ marginBottom: '1rem' }}>
            <Flag country={activityUser.country?.isoCode}></Flag> {activityUser.city}
          </div>
          {localTime}
          <Image layout="fixed" width="100px" height="100px" objectFit="contain" src={weather.iconUrl} unoptimized />
          {weather.temperature}°C
        </div>
      )}
      <div
        className="bg-secondary vertical-bottom-margin"
        style={{ padding: '1rem', borderRadius: '10px', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}
      >
        <h3>
          <b>Dernières activités</b>
        </h3>
        {activities.slice(0, 3).map((activity, index) => {
          const ActivityIcon = icons[activity.type] || null;
          return (
            <div key={index}>
              {activity.type !== ActivityType.GAME && (
                <>
                  <div style={{ fontSize: 'smaller', paddingBottom: '1rem' }}>
                    <strong>{DESC[activity.type]},&nbsp;</strong>
                    le {toDate(activity.createDate as string)}
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
    </>
  );
};
