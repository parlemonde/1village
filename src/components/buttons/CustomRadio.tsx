import * as React from 'react';

import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Radio } from '@mui/material';

import { errorColor, successColor } from 'src/styles/variables.const';

type CustomRadioProps = {
  isChecked?: boolean;
  isSuccess?: boolean;
};

let colorValue: string;

export const CustomRadio = ({ isChecked, isSuccess }: CustomRadioProps) => {
  isSuccess ? (colorValue = successColor) : (colorValue = errorColor);
  return (
    <Radio
      checked={isChecked}
      checkedIcon={<FiberManualRecordIcon />}
      sx={{
        color: colorValue,
        '&.Mui-checked': {
          color: colorValue,
        },
        '&.Mui-disabled': {
          color: colorValue,
        },
      }}
    />
  );
};
