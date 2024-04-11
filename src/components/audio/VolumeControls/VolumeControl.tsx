import type { ReactElement } from 'react';
import React from 'react';

import VolumeUp from '@mui/icons-material/VolumeUp';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';

interface VolumeControlProps {
  icon?: ReactElement;
  handleVolumeChange: (value: number) => void;
}

const VolumeControl = ({ icon, handleVolumeChange }: VolumeControlProps) => {
  const [value, setValue] = React.useState<number>(5);

  const handleChange = (_event: Event, value: number | number[]) => {
    const formatedValue = value as number;
    setValue(formatedValue);
    handleVolumeChange(formatedValue);
  };

  return (
    <Stack spacing={2} direction="row" sx={{ mb: 1, width: '240px' }} alignItems="center">
      {icon && icon}
      <Slider aria-label="Volume" value={value} onChange={handleChange} sx={{ color: '#666666' }} min={0} max={10} />
      <VolumeUp sx={{ color: '#666666' }} />
    </Stack>
  );
};

export default VolumeControl;
