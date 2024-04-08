import React from 'react';

import Checkbox from '@mui/material/Checkbox';

import PelicoNeutre from 'src/svg/pelico/pelico_neutre.svg';

const CheckboxAdmin = () => {
  const label = { inputProps: { 'aria-label': 'Pelico' } };

  return (
    <div style={{ display: 'flex', width: '80px' }}>
      <Checkbox {...label} />
      <PelicoNeutre style={{ margin: 'auto', height: '16px', width: 'auto', cursor: 'pointer' }} />
    </div>
  );
};

export default CheckboxAdmin;
