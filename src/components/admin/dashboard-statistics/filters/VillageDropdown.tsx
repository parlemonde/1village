import * as React from 'react';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';

interface VillageDropdownProps {
  villages: { name: string; id: number }[];
  onVillageChange: (vm: string) => void;
}

export default function VillageDropdown({ villages, onVillageChange }: VillageDropdownProps) {
  const [village, setVillage] = React.useState<string>('');

  const handleChange = (event: SelectChangeEvent) => {
    const selectedVillage = event.target.value as string;
    setVillage(selectedVillage);
    onVillageChange(selectedVillage);
  };

  return (
    <Box
      sx={{
        minWidth: {
          xs: 'none',
          md: 150,
        },
        maxWidth: {
          xs: 'none',
          md: 200,
        },
      }}
    >
      <FormControl fullWidth size="small">
        <InputLabel
          id="village-menu-select"
          sx={{
            backgroundColor: 'white',
            padding: '0 4px',
          }}
        >
          Village-monde
        </InputLabel>
        <Select labelId="village-menu-select" id="village-select" value={`${village}`} label="Village" onChange={handleChange}>
          {villages.map((v) => (
            <MenuItem key={v.id} value={v.id}>
              {v.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
