import React, { useState } from 'react';

import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';

import { VillageContext } from 'src/contexts/villageContext';

export const ChooseButton = () => {
  // Avec cette const je peux avoir les noms des deux pays
  const { village } = React.useContext(VillageContext);

  const [selectedOption, setSelectedOption] = useState('');

  const countriesNames = React.useMemo(() => {
    return !village ? [] : village.countries.map((c) => c.name);
  }, [village]);

  const twoCountriesWithSpace = countriesNames.join(' - ');

  const countriesIsocode = React.useMemo(() => {
    return !village ? [] : village.countries.map((c) => c.isoCode);
  }, [village]);

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedOption(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <Select labelId="demo-select-small-label" id="demo-select-small" value={selectedOption} onChange={handleChange}>
        <MenuItem value={countriesIsocode}>{twoCountriesWithSpace}</MenuItem>
        <MenuItem value={countriesIsocode[0]}>{countriesNames[0]}</MenuItem>
        <MenuItem value={countriesIsocode[1]}>{countriesNames[1]}</MenuItem>
      </Select>
    </FormControl>
  );
};
