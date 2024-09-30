import * as React from 'react';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';

import type { Country } from 'types/country.type';

interface CountriesDropdownProps {
  countries: Country[];
  onCountryChange: (country: Country) => void;
}

export default function CountriesDropdown({ countries, onCountryChange }: CountriesDropdownProps) {
  const [country, setCountry] = React.useState<Country>({ name: '', isoCode: '' });

  const handleChange = (event: SelectChangeEvent) => {
    const selectedCountry = event.target.value;
    const currentSelection = countries.find((c) => c.isoCode === selectedCountry) as Country;
    setCountry(currentSelection);
    onCountryChange(currentSelection);
  };

  return (
    <Box sx={{ minWidth: 150, maxWidth: 200 }}>
      <FormControl fullWidth size="small">
        <InputLabel id="country-menu-select">Pays</InputLabel>
        <Select labelId="country-menu-select" id="country-select" value={country.isoCode} label="Pays" onChange={handleChange}>
          {countries.map((c) => (
            <MenuItem key={c.isoCode} value={c.isoCode}>
              {c.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
