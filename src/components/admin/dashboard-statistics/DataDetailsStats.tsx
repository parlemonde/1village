import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const DataDetailsStats = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', gap: 2 }}>
      <Button variant="contained" color="primary">
        Télécharger les Données Classe
      </Button>
      <Button variant="outlined" color="primary">
        Télécharger les Données Famille
      </Button>
    </Box>
  );
};

export default DataDetailsStats;
