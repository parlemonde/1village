import React, { useContext } from 'react';

import Checkbox from '@mui/material/Checkbox';

import MediathequeContext from 'src/contexts/mediathequeContext';
import PelicoNeutre from 'src/svg/pelico/pelico_neutre.svg';

interface CheckboxAdminProps {
  isChecked: boolean;
  onCheckboxChange: (checked: boolean) => void;
}

const CheckboxAdmin = ({ isChecked, onCheckboxChange }: CheckboxAdminProps) => {
  const label = { inputProps: { 'aria-label': 'Pelico' } };
  const { setFilters, setUseAdminData } = useContext(MediathequeContext);

  const handleCheckboxChange = (event: { target: { checked: unknown } }) => {
    onCheckboxChange(event.target.checked as boolean);
    if (!event.target.checked) {
      setFilters([[]]);
      setUseAdminData(false);
    } else {
      setUseAdminData(true);
    }
  };

  return (
    <div style={{ display: 'flex', width: '80px' }}>
      <Checkbox {...label} checked={isChecked} onChange={handleCheckboxChange} />
      <PelicoNeutre style={{ margin: 'auto', height: '16px', width: 'auto' }} />
    </div>
  );
};

export default CheckboxAdmin;
