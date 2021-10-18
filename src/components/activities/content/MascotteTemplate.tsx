import React from 'react';

import Paper from '@material-ui/core/Paper';
import { Button } from '@material-ui/core';

import { AvatarImg } from 'src/components/Avatar';
import { UserDisplayName } from 'src/components/UserDisplayName';
import { primaryColor } from 'src/styles/variables.const';
import UserIcon from 'src/svg/navigation/user-icon.svg';
import type { User } from 'types/user.type';

export const MascotteTemplate = ({ user }: { user: User }) => (
  <Paper variant={'outlined'} square={true} elevation={0} style={{ margin: '0', cursor: 'unset' }}>
    <div className="activity-card__header">
      <AvatarImg user={user} size="small" style={{ margin: '0.25rem 0rem 0.25rem 0.25rem' }} />
      <div className="activity-card__header_info">
        <p className="text">
          {'Vous, '}
          <UserDisplayName className="text" user={user} />
          {` à ${user.city}, n'avez pas encore crée votre mascotte`}
        </p>
      </div>
      <UserIcon style={{ fill: primaryColor, margin: '0 0.65rem', width: '2rem', height: 'auto', alignSelf: 'center' }} />
    </div>
    <div className="activity-card__content">
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
        }}
      >
        <div style={{ margin: '0.25rem', flex: 1, minWidth: 0 }}>
          <h3 style={{ margin: '0 0.5rem 0.5rem' }}>Présentez vous à vos Pélicopains !</h3>
          <div style={{ margin: '0 0.5rem 3rem', height: `2rem`, textAlign: 'justify' }}>
            <div className="text multine-with-ellipsis break-long-words" style={{ maxHeight: `2rem` }}>
              Créez votre mascotte pour présenter votre classe à vos Pélicopains. Créez-la à votre image, elle vous représentera dans votre
              village-monde !
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Button href={'/mascotte/1'} color="primary" variant="outlined">
              Créer votre mascotte
            </Button>
          </div>
        </div>
      </div>
    </div>
  </Paper>
);
