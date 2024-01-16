import React, { useContext } from 'react';

import { RadioGroup, Radio, FormControlLabel } from '@mui/material';

import type { inputType } from 'src/config/games/game';
import { GameContext } from 'src/contexts/gameContext';

const GameRadio = ({ input }: { input: inputType }) => {
  const { updateGameConfig } = useContext(GameContext);

  const handleChange = (event: React.SyntheticEvent) => {
    const value = (event.target as HTMLInputElement).value;
    updateGameConfig(value, input);
  };

  return (
    <RadioGroup>
      {input.values?.map((radioValue: string, radioIndex) => (
        <FormControlLabel key={radioIndex} value={radioValue} control={<Radio />} label={radioValue} onChange={handleChange} />
      ))}
    </RadioGroup>
  );
};

export default GameRadio;
