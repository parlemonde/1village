import React from 'react';

import { Button, Grid } from '@mui/material';

import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { secondaryColor } from 'src/styles/variables.const';
import { UserType } from 'types/user.type';

export const VillageSelect = () => {
  const { user } = React.useContext(UserContext);
  const { village, showSelectVillageModal } = React.useContext(VillageContext);
  const isPelico = user && (user?.type === UserType.MEDIATOR || user?.type === UserType.ADMIN || user?.type === UserType.SUPER_ADMIN);

  return (
    <Grid>
      {isPelico ? (
        <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${secondaryColor}`, borderRadius: '12px' }}>
          <span className="text text--small" style={{ margin: '0 0.6rem' }}>
            {village ? village.name : 'Village non choisi !'}
          </span>
          <Button variant="contained" color="secondary" size="small" style={{ margin: '-1px -1px 0 0' }} onClick={showSelectVillageModal}>
            {village ? 'Changer' : 'Choisir un village'}
          </Button>
        </div>
      ) : null}
    </Grid>
  );
};
