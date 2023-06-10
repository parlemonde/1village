import React from 'react';

import type { LinearProgressProps } from '@mui/material';
import { LinearProgress, Typography, Grid } from '@mui/material';
import { Box } from '@mui/system';

import { Flag } from '../Flag';
import type { GameResponse } from 'types/gameResponse.type';
import { MimicResponseValue } from 'types/mimicResponse.type';
import type { User } from 'types/user.type';

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box display="flex" alignItems="flex-end">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

interface mimicStatProps {
  gameResponses: GameResponse[];
  choices: number[];
  country: string;
  users: User[];
  userMap: Record<number, number>;
}

export const MimicStats = ({ gameResponses, choices, country, userMap, users }: mimicStatProps) => {
  const countryResponses = React.useMemo(() => {
    return gameResponses.filter((responseGame) => users[userMap[responseGame.userId]]?.country?.isoCode === country);
  }, [country, gameResponses, userMap, users]);
  const responseCount = countryResponses.length;
  const stats = React.useMemo(() => {
    return [
      (countryResponses.filter((response) => response.value === MimicResponseValue.SIGNIFICATION).length * 100) / responseCount,
      (countryResponses.filter((response) => response.value === MimicResponseValue.FAKE_SIGNIFICATION_1).length * 100) / responseCount,
      (countryResponses.filter((response) => response.value === MimicResponseValue.FAKE_SIGNIFICATION_2).length * 100) / responseCount,
    ];
  }, [countryResponses, responseCount]);
  const responseChoices = React.useMemo(() => {
    return choices;
  }, [choices]);

  return (
    <Grid item xs={4} md={4} pb={4}>
      <span style={{ paddingRight: '0.5rem', marginBottom: '2rem' }}>
        {responseCount !== 0 ? 'Réponses de vos Pélicopains' : 'Pas de réponses de vos Pélicopains'}
      </span>
      <Flag country={country} />
      {responseCount > 0 && responseChoices && (
        <>
          {responseChoices.map((responseChoice, index) => (
            <LinearProgressWithLabel key={index} value={stats[responseChoice]} style={{ height: '0.5rem', margin: '2rem' }} />
          ))}
        </>
      )}
    </Grid>
  );
};
