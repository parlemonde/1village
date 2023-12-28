import React from 'react';

import { TextField } from '@mui/material';

import type { inputType } from 'src/config/games/game';

const GameField = ({ input }: { input: inputType }) => {
  return <TextField style={{ width: '100%', margin: '10px' }} type="text" placeholder={input.placeHolder} />;
};

export default GameField;
