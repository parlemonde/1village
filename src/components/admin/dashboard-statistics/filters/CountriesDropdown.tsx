import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export default function CountriesDropdown() {
  const [country, setCountry] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setCountry(event.target.value as string);
  };

  //countries list requests to add

  return (
    <Box sx={{ maxWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="country-menu-select">Pays</InputLabel>
        <Select labelId="country-menu-select" id="country-menu" value={country} label="Pays" onChange={handleChange}>
          <MenuItem value={0}>Tous les pays</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}