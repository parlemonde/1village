import React from 'react';

import { TextField } from '@mui/material';

import type { inputType } from 'src/config/games/game';
import { useGame, gameResponse, saveGameResponseInSessionStorage } from 'src/contexts/gameContext';

const GameField = ({ input, stepNumber }: { input: inputType; stepNumber: number }) => {
  const { userSelection } = useGame();

  if (input.hidden && input.hidden.value === userSelection) return null;

  const handleChange = (event: React.SyntheticEvent) => {
    const newValue = (event.target as HTMLInputElement).value;
    const stepResponse = gameResponse.data[stepNumber - 1];
    if (stepResponse && stepResponse.responses && stepResponse.responses[input.id]) {
      stepResponse.responses[input.id].value = newValue;
      saveGameResponseInSessionStorage(gameResponse);
    }
  };

  return (
    <>
      <p>{input.label}</p>
      <TextField style={{ width: '100%', margin: '10px' }} type="text" placeholder={input.placeHolder} onChange={handleChange} />
    </>
  );
};

export default GameField;
