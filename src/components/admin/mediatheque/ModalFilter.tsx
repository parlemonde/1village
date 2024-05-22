import React, { useContext } from 'react';

import RefreshIcon from '@mui/icons-material/Refresh';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';

import FiltersActivities from './FiltersActivities';
import CheckboxAdmin from 'src/components/admin/mediatheque/CheckboxAdmin';
import Filters from 'src/components/admin/mediatheque/Filter';
import { activitiesLabel } from 'src/config/mediatheque/dataFilters';
import MediathequeContext from 'src/contexts/mediathequeContext';

const styleModal = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 250,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

const ModalFilter = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { setFilters, setOffset } = useContext(MediathequeContext);

  const handleResetFilters = () => {
    setFilters([[]]);
    setOffset(0);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '5px' }}>
      <Button variant="outlined" onClick={handleOpen}>
        Filtres
      </Button>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={styleModal}>
          <button
            style={{
              position: 'absolute',
              top: '3px',
              right: '3px',
              padding: '10px',
              backgroundColor: '#4c3ed9',
              fontSize: '1rem',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
            }}
            onClick={handleClose}
          >
            X
          </button>
          <FiltersActivities />
          <Filters labels={activitiesLabel} placeholder="VM" />
          <Filters labels={activitiesLabel} placeholder="Pays" />
          <Filters labels={activitiesLabel} placeholder="Classes" />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CheckboxAdmin />
            <IconButton aria-label="delete" color="primary" onClick={handleResetFilters}>
              <RefreshIcon />
            </IconButton>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalFilter;
