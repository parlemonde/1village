import React from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material';

interface ODDSelectorProps {
  label: string | React.ReactNode;
  value?: string;
  onChange?(newValue: string): void;
  style?: React.CSSProperties;
}

const ODDSelector = ({ label }: ODDSelectorProps) => {
  return (
    <Autocomplete
      options={[]}
      renderOption={(props, option) => <Box component="li" {...props}></Box>}
      renderInput={(params) => (
        <TextField
          {...params}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'off',
          }}
          label={label}
          variant="standard"
          type="search"
        />
      )}
      autoHighlight
      blurOnSelect
    />
  );
};

export default ODDSelector;
