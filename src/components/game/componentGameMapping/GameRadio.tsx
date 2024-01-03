import React from 'react';

import { RadioGroup, Radio, FormControlLabel } from '@mui/material';

import type { inputType } from 'src/config/games/game';

const GameRadio = ({ input }: { input: inputType }) => {
  return (
    <RadioGroup>
      {input.values?.map((radioValue: string, radioIndex) => (
        <FormControlLabel key={radioIndex} value={radioValue} control={<Radio />} label={radioValue} />
      ))}
    </RadioGroup>
  );
};

export default GameRadio;
