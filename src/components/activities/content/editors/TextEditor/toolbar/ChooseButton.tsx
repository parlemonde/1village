import React, { useState } from 'react';

import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';

import { VillageContext } from 'src/contexts/villageContext';

interface ChooseButtonProps {
  handleOptionChange?: (selectedOption: string) => void;
}

export const ChooseButton = ({ handleOptionChange }: ChooseButtonProps) => {
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
    const newSelectedOption = event.target.value as string;
    setSelectedOption(newSelectedOption);
    if (handleOptionChange) {
      handleOptionChange(newSelectedOption);
    }
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <Select labelId="visibility-label" id="visibility" value={selectedOption} onChange={handleChange}>
        <MenuItem value={countriesIsocode}>{twoCountriesWithSpace}</MenuItem>
        <MenuItem value={countriesIsocode[0]}>{countriesNames[0]}</MenuItem>
        <MenuItem value={countriesIsocode[1]}>{countriesNames[1]}</MenuItem>
      </Select>
    </FormControl>
  );
};
