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
    <>
      {input.selectedValue && input.selectedValue.length > 0 ? (
        <RadioGroup value={input.selectedValue}>
          {input.values?.map((radioValue: string, radioIndex) => (
            <FormControlLabel
              key={radioIndex}
              value={radioValue}
              control={<Radio />}
              label={radioValue}
              style={{ cursor: 'pointer' }}
              onChange={handleChange}
            />
          ))}
        </RadioGroup>
      ) : (
        <RadioGroup>
          {input.values?.map((radioValue: string, radioIndex) => (
            <FormControlLabel
              key={radioIndex}
              value={radioValue}
              control={<Radio />}
              label={radioValue}
              style={{ cursor: 'pointer' }}
              onChange={handleChange}
            />
          ))}
        </RadioGroup>
      )}
    </>
  );
};

export default GameRadio;
