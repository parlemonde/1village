import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';
import * as React from 'react';

interface DropdownProps {
  data: string[];
  onItemChange: (item: string) => void;
  label: string;
  title: string;
}

export default function Dropdown({ data, onItemChange, label, title }: DropdownProps) {
  const [item, setItem] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    const selectedItem = event.target.value as string;
    setItem(selectedItem);
    onItemChange(selectedItem);
  };

  return (
    <Box>
      <FormControl fullWidth size="small">
        <InputLabel id="country-menu-select">{title}</InputLabel>
        <Select labelId="country-menu-select" id="country-select" value={item} label={title} onChange={handleChange}>
          <MenuItem value="">{label}</MenuItem>
          {data.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
