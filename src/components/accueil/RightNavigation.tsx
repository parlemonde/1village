import { Box, Button, Link, Tooltip } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import React from 'react';

import { AvatarImg } from '../Avatar';
import { Flag } from '../Flag';
import { LastActivities } from './LastActivities';
import { isMascotte } from 'src/activity-types/anyActivity';
import { useWeather } from 'src/api/weather/weather.get';
import { Map } from 'src/components/Map';
import { UserContext } from 'src/contexts/userContext';
import { useActivity } from 'src/services/useActivity';
import { getUserDisplayName } from 'src/utils';
import type { User } from 'types/user.type';
import { UserType } from 'types/user.type';

interface LayoutProps {
  children: ReactNode;
  isPelico?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, isPelico = false }) => (
  <Box
    component="aside"
    sx={{
      display: 'flex',
      padding: {
        xs: '5px',
        md: '0',
      },
      flexDirection: {
        xs: 'column',
        sm: isPelico ? 'column' : 'row',
        md: 'column',
      },
    }}
  >
    {children}
  </Box>
);

export const RightNavigation = ({ activityUser, displayAsUser = false }: { activityUser: User; displayAsUser?: boolean }) => {
  const router = useRouter();
  const [localTime, setLocalTime] = React.useState<string | null>(null);
  const { user } = React.useContext(UserContext);
  const { data: weather } = useWeather({ latitude: activityUser.position.lat, longitude: activityUser.position.lng });
  const { activity: userMascotte } = useActivity(activityUser.mascotteId || -1);

  const isPelico = activityUser.type < UserType.TEACHER;
  const isMediator = user !== null && user.type <= UserType.MEDIATOR;
  const formatPseudo = activityUser.pseudo.replace(' ', '-');

  const onclick = React.useCallback(() => {
    router.push(`/activite/${activityUser.mascotteId}`);
  }, [activityUser.mascotteId, router]);

  // ---- Get user weather and time ----
  React.useEffect(() => {
    if (weather) {
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
      <Layout isPelico>
        <Link href="/pelico-profil" underline="none" color="inherit" mb="10px">
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', minWidth: 0, cursor: 'pointer' }}>
            <span style={{ marginRight: '0.3rem', display: 'flex' }}>
              <AvatarImg user={activityUser} size="extra-small" noLink displayAsUser={displayAsUser} onClick={onclick} />
            </span>
            <span className="text">
              <strong>Pélico</strong>
            </span>
          </div>
        </Link>
        <LastActivities title="Dernières activités de Pélico" activityUser={activityUser} />
      </Layout>
    );
  }

  return (
    <Layout>
      <Box
        sx={(theme) => ({
          [theme.breakpoints.only('sm')]: {
            marginRight: '20px',
            flexBasis: '60%',
          },
        })}
      >
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
          <Box sx={{ textAlign: 'center' }}>
            <Button
              component="a"
              href={`https://prof.parlemonde.org/les-professeurs-partenaires/${formatPseudo}/profile`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ overflow: 'hidden', marginBottom: '10px', textAlign: 'center' }}
              variant="outlined"
            >
              Voir la fiche du professeur
            </Button>
          </Box>
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
      </Box>

      <Box
        sx={(theme) => ({
          [theme.breakpoints.only('sm')]: {
            flexBasis: '40%',
          },
        })}
      >
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
            {weather && (
              <>
                <Image layout="fixed" width="100px" height="100px" objectFit="contain" src={weather.iconUrl} unoptimized />
                {weather.temperature}°C
              </>
            )}
          </div>
        )}
        <LastActivities title="Dernières activités" activityUser={activityUser} />
      </Box>
    </Layout>
  );
};
