import React, { useMemo } from 'react';

import { Box, Grid, Stack } from '@mui/material';

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
    <Stack spacing={1} direction="column" alignItems="center" justifyContent="space-between">
      <Stack spacing={1} direction="row" alignItems="center" justifyContent="center" m={2}>
        <span>{`${responseCount} réponse${responseCount > 1 ? 's' : ''}`} </span>
        <Flag country={country} size={'small'} />
      </Stack>
      <Stack spacing={0} sx={{ width: 300, alignItems: 'center', justifyContent: 'space-between', px: 4 }}>
        <Grid item direction="row" spacing={0} alignItems="center" justifyContent="space-between" xs={4}>
          {responseCount > 0 &&
            choices &&
            choices.map((choice) => (
              <>
                {responsesByChoice[choice] ? (
                  <Stack direction="row" spacing= {2} pb={1} alignItems="center" justifyContent="center">
                    {responsesByChoice[choice]?.map((response) => {
                      const user = users[userMap[response.userId]];
                      return <AvatarImg key={response.id} user={user} style={{ width: '24px', height: '24px', margin: '10px 5px' }} />;
                    })}
                  </Stack>
                ) : (
                  <>TOTO</>
                )}
              </>
            ))}
        </Grid>
      </Stack>
    </Stack>
  );
};
export default GameStats;
