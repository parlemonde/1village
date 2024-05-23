import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import React, { useContext } from 'react';

import SaveAltIcon from '@mui/icons-material/SaveAlt';
import Button from '@mui/material/Button';

import { activitiesLabel, subThemesMap, activityNumberMapper, subThemeNumberMapper } from 'src/config/mediatheque/dataFilters';
import MediathequeContext from 'src/contexts/mediathequeContext';

export default function DownloadButton() {
  const { allFiltered } = useContext(MediathequeContext);
  console.log(allFiltered);

  // const createJsonFiles = async (data) => {
  //   const zip = new JSZip();
  //   data.forEach((item, index) => {
  //     const jsonString = JSON.stringify(item, null, 2);
  //     zip.file(`media-${index + 1}.json`, jsonString);
  //   });

  //   const content = await zip.generateAsync({ type: 'blob' });
  //   saveAs(content, 'media-library.zip');
  // };

  const getActivityLabel = (type) => {
    const activityEntry = Object.entries(activityNumberMapper).find(([label, number]) => number === type);
    return activityEntry ? activityEntry[0] : `UnknownType${type}`;
  };

  const getSubThemeLabel = (type, subType) => {
    const activityLabel = getActivityLabel(type);
    const subThemes = subThemesMap[activityLabel] || [];
    const subThemeEntry = Object.entries(subThemeNumberMapper).find(([label, number]) => number === subType && subThemes.includes(label));
    return subThemeEntry ? subThemeEntry[0] : `UnknownSubType${subType}`;
  };

  const createJsonFiles = async (data) => {
    const zip = new JSZip();
    data.forEach((item, index) => {
      const activityLabel = getActivityLabel(item.type);
      const subThemeLabel = getSubThemeLabel(item.type, item.subType);
      const jsonString = JSON.stringify(item, null, 2);
      zip.file(`media-${activityLabel}-${subThemeLabel}-${index + 1}.json`, jsonString);
    });
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'media-library.zip');
  };

  const handleDownload = () => {
    createJsonFiles(allFiltered);
  };

  return (
    <Button size="small" className="download-button" variant="outlined" onClick={handleDownload}>
      <SaveAltIcon fontSize="small" />
      Télécharger
    </Button>
  );
}
