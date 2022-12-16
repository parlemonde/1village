import { Button } from '@mui/material';
import Paper from '@mui/material/Paper';
import Link from 'next/link';
import React from 'react';

import { AvatarImg } from 'src/components/Avatar';
import { UserDisplayName } from 'src/components/UserDisplayName';
import { primaryColor } from 'src/styles/variables.const';
import UserIcon from 'src/svg/navigation/user-icon.svg';
import type { User } from 'types/user.type';
import { UserType } from 'types/user.type';

export const MascotteTemplate = ({ user }: { user: User }) => (
  <Paper variant={'outlined'} square={true} elevation={0} style={{ margin: '0', cursor: 'unset' }}>
    <div className="activity-card__header">
      <AvatarImg user={user} size="small" style={{ margin: '0.25rem 0rem 0.25rem 0.25rem' }} />
      <div className="activity-card__header_info">
        <p className="text">
          {'Vous, '}
          <UserDisplayName className="text" user={user} />
          {` à ${user.city}, n'avez pas encore créé `}
          <strong>votre mascotte</strong>
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
            {user.type < UserType.OBSERVATOR && (
              <Link href={'/mascotte/1'} passHref>
                <Button href={'/mascotte/1'} color="primary" variant="outlined">
                  Créer votre mascotte
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  </Paper>
);
