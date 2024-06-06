import React, { useContext } from 'react';

import Checkbox from '@mui/material/Checkbox';

import MediathequeContext from 'src/contexts/mediathequeContext';
import PelicoNeutre from 'src/svg/pelico/pelico_neutre.svg';

const CheckboxAdmin = () => {
  const label = { inputProps: { 'aria-label': 'Pelico' } };
  const { setFilters, setUseAdminData } = useContext(MediathequeContext);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.checked);
    if (event.target.checked === false) {
      setFilters([[]]);
      console.log("c'est faux");
      setUseAdminData(false);
    }
    if (event.target.checked === true) {
      console.log("c'est vrai");
      setUseAdminData(true);
    }
  };

  return (
    <div style={{ display: 'flex', width: '80px' }}>
      <Checkbox {...label} onChange={handleCheckboxChange} />
      <PelicoNeutre style={{ margin: 'auto', height: '16px', width: 'auto', cursor: 'pointer' }} />
    </div>
  );
};

export default CheckboxAdmin;
