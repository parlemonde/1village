import React, { useContext, useState } from 'react';

import { TextField } from '@mui/material';

import type { inputType } from 'src/config/games/games';
import { GameContext } from 'src/contexts/gameContext';

const GameField = ({ input }: { input: inputType }) => {
  const { updateGameConfig } = useContext(GameContext);
  const [value, setValue] = useState('');

  const handleChange = (event: React.SyntheticEvent) => {
    const v = (event.target as HTMLInputElement).value;
    setValue(v);
    updateGameConfig(v, input);
  };

  return (
    <>
      <p>
        <b>{input.label}</b>
      </p>
      <TextField
        style={{ width: '100%', margin: '10px' }}
        type="text"
        value={input?.selectedValue?.length !== undefined && input.selectedValue.length > 0 ? input.selectedValue : value}
        placeholder={value.length > 0 ? '' : input.placeHolder}
        onChange={handleChange}
        required
      />
    </>
  );
};

export default GameField;
