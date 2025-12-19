import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const DataDetailsStats = () => {
  const [downloadingClassroomExport, setDownloadingClassroomExport] = useState(false);

  const handleDownloadClassData = async () => {
    try {
      setDownloadingClassroomExport(true);
      const res = await fetch('/api/statistics/export', {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`Téléchargement échoué (${res.status})`);
      }

      const blob = await res.blob();
      const disposition = res.headers.get('content-disposition') || '';
      const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(disposition);
      const filename = decodeURIComponent((match?.[1] || match?.[2] || 'class-data.csv').trim());

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Une erreur est survenue lors du téléchargement du fichier CSV.');
    } finally {
      setDownloadingClassroomExport(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', gap: 2 }}>
      <Button variant="contained" color="primary" onClick={handleDownloadClassData} disabled={downloadingClassroomExport}>
        {downloadingClassroomExport ? 'Téléchargement...' : 'Télécharger les Données Classe'}
      </Button>
      <Button variant="outlined" color="primary" disabled>
        Télécharger les Données Famille
      </Button>
    </Box>
  );
};

export default DataDetailsStats;
