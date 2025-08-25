import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import React from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(label: string, labelName: readonly string[], theme: Theme) {
  return {
    fontWeight: labelName.indexOf(label) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  };
}

type FilterProps = {
  labels: string[];
  placeholder: string;
};

const Filters = ({ labels, placeholder }: FilterProps) => {
  const theme = useTheme();
  const [labelName, setLabelName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof labelName>) => {
    const {
      target: { value },
    } = event;
    setLabelName(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <div>
      <Tooltip title="Bientot disponible" placement="top-start" arrow>
        <FormControl sx={{ m: 1, width: 140 }} size="small" disabled>
          <Select
            multiple
            displayEmpty
            value={labelName}
            onChange={handleChange}
            input={<OutlinedInput />}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <>{placeholder}</>;
              }

              return selected.join(', ');
            }}
            MenuProps={MenuProps}
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem disabled value="">
              <em>Placeholder</em>
            </MenuItem>
            {labels.map((label: string, index: number) => (
              <MenuItem key={index} value={label} style={getStyles(label, labelName, theme)}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Tooltip>
    </div>
  );
};

export default Filters;
