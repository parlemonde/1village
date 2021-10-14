import * as React from 'react';

import { AvatarImg } from 'src/components/Avatar';
import { Flag } from 'src/components/Flag';
import { UserContext } from 'src/contexts/userContext';
import { useCountries } from 'src/services/useCountries';
import { getUserDisplayName } from 'src/utils';
import type { User } from 'types/user.type';

export const UserPopover = ({ user }: { user: User }) => {
  const { countries } = useCountries();
  const { user: selfUser } = React.useContext(UserContext);
  const isSelf = user.id === selfUser.id;

  const userCountry = React.useMemo(() => countries.find((c) => c.isoCode === user.countryCode), [countries, user.countryCode]);

  return (
    <div style={{ margin: 0, padding: 0, display: 'flex', alignItems: 'center' }}>
      <AvatarImg user={user} size="small" style={{ marginRight: '0.25rem' }} />
      <div>
        <h2 style={{ margin: 0, padding: 0 }}>{getUserDisplayName(user, isSelf)}</h2>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <p style={{ margin: '0 0 0.25rem 0', padding: 0 }} className="text text--small">
            {[user.address, user.city, userCountry?.name].filter((d) => d && d.length > 0).join(', ')}
          </p>
          <Flag country={user.countryCode} size="small" style={{ marginLeft: '0.6rem' }} />
        </div>
      </div>
    </div>
  );
};
