import React, { useContext } from 'react';

import { TextField } from '@mui/material';

import type { inputType } from 'src/config/games/game';
import { GameContext } from 'src/contexts/gameContext';

const GameField = ({ input }: { input: inputType }) => {
  const { updateGameConfig } = useContext(GameContext);

  const handleChange = (event: React.SyntheticEvent) => {
    const value = (event.target as HTMLInputElement).value;
    updateGameConfig(value, input);
  };

  return (
    <>
      <p>{input.label}</p>
      <TextField style={{ width: '100%', margin: '10px' }} type="text" placeholder={input.placeHolder} onChange={handleChange} />
    </>
  );
};

export default GameField;
