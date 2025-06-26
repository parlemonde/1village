import React, { useState } from 'react';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';

export type DropdownOption = { key: string; value: string };

interface DropdownProps {
  data: DropdownOption[];
  onItemChange: (item: string) => void;
  label: string;
}

export default function Dropdown({ data, onItemChange, label }: DropdownProps) {
  const [item, setItem] = useState('');

  const handleChange = (event: SelectChangeEvent) => {
    const selectedItem = event.target.value as string;
    setItem(selectedItem);
    onItemChange(selectedItem);
  };

  return (
    <FormControl fullWidth size="small">
      <InputLabel id="menu-select">{label}</InputLabel>
      <Select labelId="menu-select" id="select" value={item} onChange={handleChange} label={label}>
        <MenuItem value="">Aucun(e)</MenuItem>
        {data.map((item) => (
          <MenuItem key={item.key} value={item.key}>
            {item.value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
