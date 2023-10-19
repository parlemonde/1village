import React, { useState } from 'react';

import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';

// import { Flag } from 'src/components/Flag';
// import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
// import { useVillageUsers } from 'src/services/useVillageUsers';

export const ChooseButton = () => {
  // Avec cette const je peux avoir les noms des deux pays
  const { village } = React.useContext(VillageContext);

  const filterCountries = React.useMemo(() => {
    return !village ? [] : village.countries.map((c) => c.name);
  }, [village]);

  const twoCountriesWithSpace = filterCountries.join(' - ');

  const [selectedOption, setSelectedOption] = useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedOption(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <Select labelId="demo-select-small-label" id="demo-select-small" value={selectedOption} onChange={handleChange}>
        <MenuItem value={twoCountriesWithSpace}>{twoCountriesWithSpace}</MenuItem>
        <MenuItem value={filterCountries[0]}>{filterCountries[0]}</MenuItem>
        <MenuItem value={filterCountries[1]}>{filterCountries[1]}</MenuItem>
      </Select>
    </FormControl>
  );
};
