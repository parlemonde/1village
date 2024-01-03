import React from 'react';

import { TextField } from '@mui/material';

import type { inputType } from 'src/config/games/game';
import { useGame } from 'src/contexts/gameContext';

const GameField = ({ input }: { input: inputType }) => {
  const { userSelection } = useGame();

  if (input.hidden && input.hidden.value === userSelection) return null;

  return (
    <>
      <p>{input.label}</p>
      <TextField style={{ width: '100%', margin: '10px' }} type="text" placeholder={input.placeHolder} />
    </>
  );
};

export default GameField;
