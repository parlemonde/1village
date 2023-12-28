import React, { useEffect, useState } from 'react';

import { Autocomplete, FormControl, TextField } from '@mui/material';

import type { inputType } from 'src/config/games/game';
import { SelectTypeMappingMethode, keyMapping } from 'src/config/games/game';
import { useGame } from 'src/contexts/gameContext';
import type { Currency } from 'types/currency.type';
import type { Language } from 'types/language.type';

const GameSelect = ({ input }: { input: inputType }) => {
  const [values, setValues] = useState([]);
  const { setUserSelection } = useGame();

  useEffect(() => {
    const getValues = async () => {
      if (!input.methodType) return;
      const res = await SelectTypeMappingMethode[input.methodType]();
      const key = keyMapping[input.methodType];
      const optionValues = res.map((optionValue: Currency[] | Language[]) => optionValue[key]);
      setValues(optionValues);
    };
    getValues();
  }, [input.methodType]);

  return (
    <FormControl variant="outlined" style={{ width: '23rem', marginTop: '3.5rem', marginBottom: '0.5rem', marginRight: '10rem' }}>
      <Autocomplete
        options={values}
        getOptionLabel={(option) => option}
        renderInput={(params) => <TextField {...params} label="Langue" variant="outlined" />}
        onChange={(event, newValue) => {
          setUserSelection(newValue);
        }}
      />
    </FormControl>
  );
};

export default GameSelect;
