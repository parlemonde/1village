import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';
import * as React from 'react';

export default function PhaseDropdown() {
  const [phase, setPhase] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setPhase(event.target.value as string);
  };

  return (
    <Box>
      <FormControl fullWidth size="small">
        <InputLabel id="phase-menu-select">Phase</InputLabel>
        <Select labelId="phase-menu-select" id="phase-menu" value={phase} label="Phase" onChange={handleChange}>
          <MenuItem value={3}>Toutes les phases</MenuItem>
          <MenuItem value={0}>Phase 1</MenuItem>
          <MenuItem value={1}>Phase 2</MenuItem>
          <MenuItem value={2}>Phase 3</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
