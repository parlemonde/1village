import * as React from 'react';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';

interface VillageDropdownProps {
  villages: string[];
  onVillageChange: (vm: string) => void;
}

export default function VillageDropdown({ villages, onVillageChange }: VillageDropdownProps) {
  const [village, setVillage] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    const selectedVillage = event.target.value as string;
    setVillage(selectedVillage);
    onVillageChange(selectedVillage);
  };

  return (
    <Box sx={{ minWidth: 150, maxWidth: 200 }}>
      <FormControl fullWidth size="small">
        <InputLabel id="village-menu-select">Village-monde</InputLabel>
        <Select labelId="village-menu-select" id="village-select" value={village} label="Village" onChange={handleChange}>
          {villages.map((village) => (
            <MenuItem key={village} value={village}>
              {village}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
