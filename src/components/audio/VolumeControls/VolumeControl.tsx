import VolumeUp from '@mui/icons-material/VolumeUp';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import type { ReactElement } from 'react';
import React from 'react';

interface VolumeControlProps {
  icon?: ReactElement;
  volume: number;
  handleVolumeChange: (value: number) => void;
}

const VolumeControl = ({ icon, volume, handleVolumeChange }: VolumeControlProps) => {
  const handleChange = (_event: Event, value: number | number[]) => {
    handleVolumeChange(Array.isArray(value) ? value[0] : value);
  };

  return (
    <Stack spacing={2} direction="row" sx={{ mb: 1, width: '240px' }} alignItems="center">
      {icon && icon}
      <Slider aria-label="Volume" value={volume} onChange={handleChange} sx={{ color: '#666666' }} min={0} max={1} step={0.1} />
      <VolumeUp sx={{ color: '#666666' }} />
    </Stack>
  );
};

export default VolumeControl;
