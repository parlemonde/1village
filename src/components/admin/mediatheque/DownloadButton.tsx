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

  const getFileExtension = (url) => {
    const match = url.match(/\.(jpeg|jpg|png)$/i);
    return match ? match[1] : 'png';
  };

  const createJsonFiles = async (data) => {
    const zip = new JSZip();
    const imagePromises = [];
    const videoLinks = [];

    data.forEach((item) => {
      const activityLabel = getActivityLabel(item.type);
      const subThemeLabel = getSubThemeLabel(item.type, item.subType);

      // Process images and videos
      item.content.forEach((contentItem, contentIndex) => {
        if (contentItem.type === 'image') {
          const imageUrl = contentItem.value;
          const imageExtension = getFileExtension(imageUrl);
          const imageFileName = `media-${activityLabel}-${subThemeLabel}-image-activity_id_${item.id}-${contentIndex + 1}.${imageExtension}`;
          console.log(contentIndex);

          // Fetch the image and add it to the zip
          const imagePromise = fetch(imageUrl)
            .then((response) => response.blob())
            .then((blob) => {
              return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  const base64data = reader.result.split(',')[1];
                  zip.file(imageFileName, base64data, { base64: true });
                  resolve();
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              });
            })
            .catch((err) => {
              console.error(`Failed to fetch image from ${imageUrl}:`, err);
            });

          imagePromises.push(imagePromise);
        } else if (contentItem.type === 'video') {
          const videoUrl = contentItem.value;
          videoLinks.push(`Video ${item.id}-${contentIndex + 1}: ${videoUrl}`);
        }
      });
    });

    // Wait for all images to be fetched and added to the zip
    await Promise.all(imagePromises);

    // Add video links file
    if (videoLinks.length > 0) {
      const videoLinksFileContent = videoLinks.join('\n');
      zip.file('video-links.txt', videoLinksFileContent);
    }

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
