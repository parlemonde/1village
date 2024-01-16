import React, { useContext, useEffect, useState } from 'react';

import { Autocomplete, FormControl, TextField } from '@mui/material';

import type { inputType } from 'src/config/games/game';
import { SelectTypeMappingMethode, keyMapping } from 'src/config/games/game';
import { GameContext } from 'src/contexts/gameContext';
import type { Currency } from 'types/currency.type';
import type { Language } from 'types/language.type';

const GameSelect = ({ input }: { input: inputType }) => {
  const [values, setValues] = useState<string[]>([]);
  const { updateGameConfig } = useContext(GameContext);

  function mapOptionValue(optionValue: Currency | Language, key: string): string {
    if (key in optionValue) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (optionValue as any)[key];
    }
    throw new Error(`Key '${key}' not found in optionValue`);
  }

  useEffect(() => {
    const getValues = async () => {
      if (!input.methodType) return;
      const res = await SelectTypeMappingMethode[input.methodType]();
      const key = keyMapping[input.methodType];
      const optionValues = res.map((optionValue) => mapOptionValue(optionValue, key));
      setValues(optionValues);
    };
    getValues();
  }, [input.methodType]);

  return (
    <FormControl variant="outlined" style={{ width: '23rem', marginTop: '3.5rem', marginBottom: '0.5rem', marginRight: '10rem' }}>
      <Autocomplete
        options={values}
        getOptionLabel={(option) => option}
        renderInput={(params) => <TextField {...params} label={input.placeHolder} variant="outlined" />}
        onChange={(_event, newValue) => {
          updateGameConfig(newValue, input);
        }}
      />
    </FormControl>
  );
};

export default GameSelect;
