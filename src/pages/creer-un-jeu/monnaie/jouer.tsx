import { useRouter } from 'next/router';
import ReactPlayer from 'react-player';
import React from 'react';

import type { LinearProgressProps } from '@material-ui/core/LinearProgress';
import { Button, FormControlLabel, Grid, Radio, RadioGroup, LinearProgress, Typography, Box } from '@material-ui/core';

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

const PlayMoney: React.FC = () => {
  const router = useRouter();

  return <div>Play page</div>;
};

export default PlayMoney;
