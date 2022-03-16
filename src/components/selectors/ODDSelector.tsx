import React, { useState } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Box, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';

import { ODD_CHOICE } from 'src/activity-types/story.constants';
import villages from 'src/pages/admin/villages';

interface ODDSelectorProps {
  label: string | React.ReactNode;
  value?: string;
  onChange?(newValue: string): void;
  style?: React.CSSProperties;
}

const ODDSelector = ({ label }: ODDSelectorProps) => {
  const [oDDChoice, setODDChoice] = useState('');

  return (
    <FormControl variant="outlined" className="full-width" style={{ marginTop: '1rem' }}>
      <InputLabel id="select-ODD">ODD</InputLabel>
      <Select
        labelId="select-ODD"
        id="select-ODD-outlined"
        value={oDDChoice}
        onChange={(event) => {
          setODDChoice(event.target.value as string);
        }}
        label="Village"
      >
        {(ODD_CHOICE || []).map((v, index) => (
          <MenuItem value={index} key={index + 1}>
            {v.choice}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{label}</FormHelperText>
    </FormControl>
  );
};

export default ODDSelector;
