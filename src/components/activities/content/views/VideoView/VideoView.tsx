import { useSnackbar } from 'notistack';
import ReactPlayer from 'react-player';
import React from 'react';

import { Button, CircularProgress } from '@material-ui/core';

import { KeepRatio } from 'src/components/KeepRatio';
import { UserContext } from 'src/contexts/userContext';
import { serializeToQueryUrl } from 'src/utils';

import type { ViewProps } from '../../content.types';

const VideoView = ({ value }: ViewProps) => {
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);

  const showDownloadButton = React.useMemo(() => value.indexOf('vimeo') !== -1, [value]);

  const onDownload = async () => {
    setLoading(true);
    const response = await axiosLoggedRequest({
      method: 'GET',
      url: `/videos/download${serializeToQueryUrl({
        videoUrl: value,
        quality: 'hd',
      })}`,
    });
    if (!response.error && response.data.link) {
      window.open(response.data.link);
    } else {
      enqueueSnackbar('Une erreur est survenue...', {
        variant: 'error',
      });
    }
    setLoading(false);
  };

  return (
    <div className="text-center activity-data">
      <KeepRatio ratio={9 / 16} maxWidth="600px">
        <ReactPlayer width="100%" height="100%" url={value} controls style={{ backgroundColor: 'black' }} />
      </KeepRatio>
      {showDownloadButton && (
        <div style={{ width: '100%', maxWidth: '600px', margin: '0.25rem auto', textAlign: 'right' }}>
          {loading ? (
            <span style={{ margin: '0.1rem' }}>
              <CircularProgress size={22} />
            </span>
          ) : (
            <Button size="small" color="primary" onClick={onDownload}>
              Télécharger la vidéo
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoView;
