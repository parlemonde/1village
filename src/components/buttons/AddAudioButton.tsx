import React from 'react';

import Add from '@mui/icons-material/Add';
import { Button } from '@mui/material';

interface AddAudioButtonProps {
  onClick: () => void;
}

const AddAudioButton = ({ onClick }: AddAudioButtonProps) => {
  return (
    <Button
      onClick={onClick}
      variant="text"
      endIcon={<Add />}
      sx={{
        boxShadow: '0px 4px 7px rgba(0, 0, 0, 0.1)',
        color: 'black',
        fontWeight: 'bold',
        fontSize: '.9rem',
        margin: '1rem 0',
      }}
    >
      Ajouter un son
    </Button>
  );
};

export default AddAudioButton;
