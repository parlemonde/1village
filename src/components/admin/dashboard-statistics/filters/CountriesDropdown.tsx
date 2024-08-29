import * as React from 'react';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';

interface CountriesDropdownProps {
  countries: string[];
  onCountryChange: (country: string) => void;
}

export default function CountriesDropdown({ countries, onCountryChange }: CountriesDropdownProps) {
  const [country, setCountry] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    const selectedCountry = event.target.value as string;
    setCountry(selectedCountry);
    onCountryChange(selectedCountry);
  };

  return (
    <Box sx={{ maxWidth: 120 }}>
      <FormControl fullWidth size="small">
        <InputLabel id="country-menu-select">Pays</InputLabel>
        <Select labelId="country-menu-select" id="country-select" value={country} label="Pays" onChange={handleChange}>
          <MenuItem value="">Tous les pays</MenuItem>
          {countries.map((country) => (
            <MenuItem key={country} value={country}>
              {country}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
