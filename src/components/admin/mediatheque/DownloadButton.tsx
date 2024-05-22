import React, { useContext } from 'react';

import SaveAltIcon from '@mui/icons-material/SaveAlt';
import Button from '@mui/material/Button';

import MediathequeContext from 'src/contexts/mediathequeContext';

export default function DownloadButton() {
  const { allFiltered } = useContext(MediathequeContext);

  const createJsonFile = (data) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    return url;
  };

  const handleDownload = () => {
    const dataToDownload = allFiltered.map((item) => ({ ...item }));
    const url = createJsonFile(dataToDownload);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'media-library.json');
    document.body.appendChild(link);
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <Button size="small" className="download-button" variant="outlined" onClick={handleDownload}>
      <SaveAltIcon fontSize="small" />
      Télécharger
    </Button>
  );
}
