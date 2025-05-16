import * as React from 'react';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';

import { getUserDisplayName } from 'src/utils';
import type { Classroom } from 'types/classroom.type';

interface ClassroomDropdownProps {
  classrooms: Classroom[];
  onClassroomChange: (classroom: Classroom) => void;
}

export default function ClassroomDropdown({ classrooms, onClassroomChange }: ClassroomDropdownProps) {
  const [classroomId, setClassroomId] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    const selectedClassroomId = event.target.value as string;
    setClassroomId(selectedClassroomId);

    // Find the full classroom object by ID
    const selectedClassroom = classrooms.find((classroom) => classroom.id === Number(selectedClassroomId));
    if (selectedClassroom) {
      onClassroomChange(selectedClassroom);
    }
  };

  return (
    classrooms && (
      <Box sx={{ minWidth: 150, maxWidth: 200 }}>
        <FormControl fullWidth size="small">
          <InputLabel id="classroom-menu-select">Classe</InputLabel>
          <Select labelId="classroom-menu-select" id="classroom-select" value={classroomId} label="Classe" onChange={handleChange}>
            {classrooms.map(classroom => (
              <MenuItem key={classroom.id} value={classroom.id}>
                {classroom.user && getUserDisplayName(classroom.user, false, true)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    )
  );
}
