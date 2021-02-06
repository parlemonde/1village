import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { Base } from 'src/components/Base';
import { Flag } from 'src/components/Flag';
import { SimpleActivityView } from 'src/components/activities';
import { UserContext } from 'src/contexts/userContext';
import { useActivity } from 'src/services/useActivity';
import { useVillageUsers } from 'src/services/useVillageUsers';
import { primaryColorLight, primaryColorLight2 } from 'src/styles/variables.const';
import HomeIcon from 'src/svg/navigation/home-icon.svg';
import PelicoNeutre from 'src/svg/pelico/pelico_neutre.svg';
import { getQueryString } from 'src/utils';
import { getGravatarUrl, toDate } from 'src/utils';
import { ActivityType } from 'types/activity.type';
import { UserType } from 'types/user.type';

const titles = {
  [ActivityType.PRESENTATION]: 'Présentation',
  [ActivityType.DEFI]: 'Défi',
  [ActivityType.GAME]: 'Jeu',
  [ActivityType.ENIGME]: 'Énigme',
  [ActivityType.QUESTION]: 'Question',
};

const Activity: React.FC = () => {
  const router = useRouter();
  const activityId = React.useMemo(() => parseInt(getQueryString(router.query.id), 10) || 0, [router]);
  const { user } = React.useContext(UserContext);
  const { activity } = useActivity(activityId);
  const { users } = useVillageUsers();

  const activityUser = React.useMemo(() => {
    if (activity === null) {
      return null;
    }
    return users.find((u) => u.id === activity.userId) || null;
  }, [activity, users]);
  const userIsPelico = activityUser !== null && activityUser.type >= UserType.MEDIATOR;
  const userIsSelf = activityUser !== null && user !== null && activityUser.id === user.id;

  if (activity === null) {
    return null;
  }

  return (
    <Base>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
        <Link href="/">
          <a
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '1px 0.5rem',
              backgroundColor: primaryColorLight,
              borderRadius: '0.7rem',
            }}
          >
            <HomeIcon style={{ height: '1rem', width: 'auto', margin: '0 0.2rem 0.1rem 0' }} />
            Accueil
          </a>
        </Link>
        <ChevronRightIcon />
        <span
          style={{ display: 'inline-flex', alignItems: 'center', padding: '1px 0.5rem', backgroundColor: primaryColorLight2, borderRadius: '0.7rem' }}
        >
          Activité - {titles[activity.type]}
        </span>
      </div>
      <div style={{ display: 'block', margin: '0 auto 2rem auto', maxWidth: '800px' }}>
        {activityUser !== null && (
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
            <img
              alt="Image de profil"
              src={getGravatarUrl(activityUser.email)}
              width="40px"
              height="40px"
              style={{ borderRadius: '20px', margin: '0.25rem' }}
            />
            <div className="activity-card__header_info">
              <h2>{userIsPelico ? 'Pelico' : userIsSelf ? 'Votre classe' : 'La classe de ??? à ???'}</h2>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <p className="text text--small">Publié le {toDate(activity.createDate as string)} </p>
                {userIsPelico ? (
                  <PelicoNeutre style={{ marginLeft: '0.6rem', height: '16px', width: 'auto' }} />
                ) : (
                  <Flag country={user.countryCode} size="small" style={{ marginLeft: '0.6rem' }} />
                )}
              </div>
            </div>
          </div>
        )}

        {activity.type === ActivityType.PRESENTATION && <SimpleActivityView activity={activity} />}
      </div>
    </Base>
  );
};

export default Activity;
