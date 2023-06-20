import React, { useMemo } from 'react';

import { Grid } from '@mui/material';

import { AvatarImg } from '../Avatar';
import { Flag } from '../Flag';
import type { GameResponse } from 'types/gameResponse.type';
import type { User } from 'types/user.type';

type GameStatsProps = {
  gameResponses: GameResponse[];
  choices: number[];
  country: string;
  userMap: { [key: number]: number };
  users: User[];
};

const GameStats = ({ gameResponses, choices, country, userMap, users }: GameStatsProps) => {
  const countryResponses = useMemo(() => {
    return gameResponses.filter((responseGame) => users[userMap[responseGame.userId]]?.country?.isoCode === country);
  }, [country, gameResponses, userMap, users]);
  const responseCount = countryResponses.length;

  return (
    <Grid item xs={4} md={4} pb={4} container direction="column" alignItems="center">
      <Grid item xs={4} sm={4} style={{ display: 'inline', marginBottom: '2rem' }}>
        <span style={{ paddingRight: '0.5rem' }}>{`${responseCount} réponse${responseCount > 1 ? 's' : ''}`} </span>
        <Flag country={country} size={'small'} />
      </Grid>
      {responseCount > 0 && choices && (
        <Grid item xs={2} sm={2} container direction="column" alignItems="center" justifyContent="center">
          {countryResponses.map((response) => {
            users[userMap[response.userId]];
            return (
              <Grid
                item
                xs={2}
                key={response.id}
                container
                direction="row"
                style={{ padding: '0.5rem', paddingBottom: '1rem', marginBottom: '2rem' }}
              >
                <AvatarImg user={response.user} style={{ width: '24px', height: '24px' }} />
              </Grid>
            );
          })}
        </Grid>
      )}
    </Grid>
  );
};
export default GameStats;
