import * as React from 'react';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';

interface ClassroomDropdownProps {
  classrooms: number[];
  onClassroomChange: (classrooms: string) => void;
}

export default function ClassroomDropdown({ classrooms, onClassroomChange }: ClassroomDropdownProps) {
  const [classroom, setClassroom] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    const selectedClassroom = event.target.value as string;
    setClassroom(selectedClassroom);
    onClassroomChange(selectedClassroom);
  };

  return (
    <Box sx={{ minWidth: 150, maxWidth: 200 }}>
      <FormControl fullWidth size="small">
        <InputLabel id="classroom-menu-select">Classe</InputLabel>
        <Select labelId="classroom-menu-select" id="classroom-select" value={classroom} label="Classe" onChange={handleChange}>
          {classrooms.map((classroom) => (
            <MenuItem key={classroom} value={classroom}>
              {classroom}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}