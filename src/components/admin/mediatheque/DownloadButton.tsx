import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';

import SaveAltIcon from '@mui/icons-material/SaveAlt';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import { subThemesMap, activityNumberMapper, subThemeNumberMapper } from 'src/config/mediatheque/dataFilters';
import { serializeToQueryUrl } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';
import type { Activity } from 'types/activity.type';

interface DownloadButtonProps {
  data: Activity[];
  isCard?: boolean;
}

export default function DownloadButton({ data: activities, isCard }: DownloadButtonProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const onDownloadVideo = async (videoUrl: string) => {
    try {
      const response = await axiosRequest({
        method: 'GET',
        url: `/videos/download${serializeToQueryUrl({
          videoUrl: videoUrl,
          quality: 'hd',
        })}`,
      });
      if (response.data && response.data.link) {
        return response.data.link;
      } else {
        enqueueSnackbar("Une erreur est survenue lors de l'obtention du lien de téléchargement...", {
          variant: 'error',
        });
        throw new Error('Failed to get download link');
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Une erreur est survenue...', {
        variant: 'error',
      });
      throw error;
    }
  };

  const onDownloadSound = async (soundUrl: string) => {
    try {
      const adjustedUrl = soundUrl.startsWith('/api') ? soundUrl.replace(/^\/api/, '') : soundUrl;

      const response = await axiosRequest({
        method: 'GET',
        url: adjustedUrl,
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Une erreur est survenue lors du téléchargement de l'audio...", {
        variant: 'error',
      });
      throw error;
    }
  };

  const getActivityLabel = (type: number) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const activityEntry = Object.entries(activityNumberMapper).find(([_label, number]) => number === type);
    return activityEntry ? activityEntry[0] : `UnknownType${type}`;
  };

  const getSubThemeLabel = (type: number, subType: number | null | undefined) => {
    const activityLabel = getActivityLabel(type);
    const subThemes = subThemesMap[activityLabel] || [];
    const subThemeEntry = Object.entries(subThemeNumberMapper).find(([label, number]) => number === subType && subThemes.includes(label));
    return subThemeEntry ? subThemeEntry[0] : '';
  };

  const getFileExtension = (url: string) => {
    const match = url.match(/\.(jpeg|jpg|png|mp4)$/i);
    return match ? match[1] : 'png';
  };

  const createZipFile = async (data: Activity[]) => {
    setLoading(true);

    const zip = new JSZip();
    const imagePromises: Promise<void>[] = [];
    const videoPromises: Promise<void>[] = [];
    const soundPromises: Promise<void>[] = [];

    data.forEach((item: Activity) => {
      const activityLabel = getActivityLabel(item.type);
      const subThemeLabel = getSubThemeLabel(item.type, item.subType);

      item.content.forEach((contentItem: { type: string; value: string }, contentIndex: number) => {
        if (contentItem.type === 'image') {
          const imageUrl = contentItem.value;
          const imageExtension = getFileExtension(imageUrl);
          const imageFileName = `${activityLabel} ${subThemeLabel} image activité id n°${item.id} ${contentIndex + 1}.${imageExtension}`;

          const imagePromise = fetch(imageUrl)
            .then((response) => response.blob())
            .then((blob) => {
              return new Promise<void>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  const base64data = (reader?.result as string)?.split(',')[1];
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
        } else if (contentItem.type === 'sound') {
          const soundUrl = contentItem.value;
          const soundFileName = `${activityLabel} ${subThemeLabel} son activité id n°${item.id} ${contentIndex + 1}.mp3`;

          const soundPromise = onDownloadSound(soundUrl)
            .then((blob) => {
              zip.file(soundFileName, blob);
            })
            .catch((err) => {
              console.error(`Failed to fetch sound from ${soundUrl}:`, err);
            });

          soundPromises.push(soundPromise);
        } else if (contentItem.type === 'video') {
          const videoUrl = contentItem.value;
          const videoFileName = `${activityLabel} ${subThemeLabel} video activité id n°${item.id} ${contentIndex + 1}.mp4`;

          const videoPromise = onDownloadVideo(videoUrl)
            .then((downloadLink) => fetch(downloadLink))
            .then((response) => response.blob())
            .then((blob) => {
              zip.file(videoFileName, blob);
            })
            .catch((err) => {
              console.error(`Failed to fetch video from ${videoUrl}:`, err);
            });

          videoPromises.push(videoPromise);
        }
      });
    });

    await Promise.all([...imagePromises, ...videoPromises, ...soundPromises]);

    const content = await zip.generateAsync({ type: 'blob' });

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    const dateDownload = new Date().toLocaleDateString('fr-FR', options);
    saveAs(content, `export mediathèque ${dateDownload}.zip`);
    setLoading(false);
  };

  const handleDownload = () => {
    createZipFile(activities);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end ' }}>
      <Button size="small" variant={isCard ? 'text' : 'outlined'} onClick={handleDownload} disabled={loading}>
        <SaveAltIcon fontSize="small" />
        {isCard ? null : 'Télécharger'}
        {loading && (
          <Box sx={{ display: 'flex', paddingLeft: '1rem' }}>
            <CircularProgress size="1rem" />
          </Box>
        )}
      </Button>
    </div>
  );
}
