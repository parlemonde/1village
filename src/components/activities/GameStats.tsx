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
    <Grid item xs={4} md={4} pb={4} container>
      <span style={{ paddingRight: '0.5rem', marginBottom: '2rem' }}>{`${responseCount} réponse${responseCount > 1 ? 's' : ''}`} </span>
      <Flag country={country} />
      {responseCount > 0 && choices && (
        <>
          {countryResponses.map((response) => {
            users[userMap[response.userId]];
            return (
              <Grid item key={response.id}>
                <AvatarImg user={response.user} size="small" />
              </Grid>
            );
          })}
        </>
      )}
    </Grid>
  );
};
export default GameStats;
