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

  const responsesByChoice: { [key: number]: GameResponse[] } = {};
  countryResponses.forEach((response) => {
    const choice = parseInt(response.value, 10);
    if (!isNaN(choice)) {
      if (!responsesByChoice[choice]) {
        responsesByChoice[choice] = [];
      }
      responsesByChoice[choice].push(response);
    }
  });

  return (
    <Grid item xs={4} md={4} pb={4} container direction="column" alignItems="center">
      <Grid item xs={4} sm={4} style={{ display: 'inline', marginBottom: '2rem' }}>
        <span style={{ paddingRight: '0.5rem' }}>{`${responseCount} réponse${responseCount > 1 ? 's' : ''}`} </span>
        <Flag country={country} size={'small'} />
      </Grid>
      {responseCount > 0 && choices && (
        <Grid item xs={2} sm={2} container direction="column" alignItems="center" justifyContent="center">
          {choices.map((choice) => (
            <Grid item key={choice} container direction="row" alignItems="center" justifyContent="center" mb={2}>
              {responsesByChoice[choice]?.map((response) => {
                const user = users[userMap[response.userId]];
                return <AvatarImg key={response.id} user={user} style={{ width: '24px', height: '24px', margin: '10px' }} />;
              })}
            </Grid>
          ))}
        </Grid>
      )}
    </Grid>
  );
};
export default GameStats;
