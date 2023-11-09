import React, { useState, useContext } from 'react';

import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';

import { useTargetMessage } from 'src/contexts/targetMessageContext';
import { VillageContext } from 'src/contexts/villageContext';

export const ChooseButton = () => {
  const { village } = useContext(VillageContext);
  const { setTargetMessage } = useTargetMessage();

  const [selectedOption, setSelectedOption] = useState('');

  const countriesNames = React.useMemo(() => {
    return !village ? [] : village.countries.map((c) => c.name);
  }, [village]);

  const twoCountriesWithSpace = countriesNames.join(' - ');

  const countriesIsocode = React.useMemo(() => {
    return !village ? [] : village.countries.map((c) => c.isoCode);
  }, [village]);

  const twoCountriesIsoCodeWithSpace: string = countriesIsocode.join(' ');

  const handleChange = (event: SelectChangeEvent) => {
    const newSelectedOption = event.target.value as string;
    setSelectedOption(newSelectedOption);

    setTargetMessage(newSelectedOption);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <Select labelId="visibility-label" id="visibility" value={selectedOption} onChange={handleChange}>
        <MenuItem value={twoCountriesIsoCodeWithSpace}>{twoCountriesWithSpace}</MenuItem>
        <MenuItem value={countriesIsocode[0]}>{countriesNames[0]}</MenuItem>
        <MenuItem value={countriesIsocode[1]}>{countriesNames[1]}</MenuItem>
      </Select>
    </FormControl>
  );
};
