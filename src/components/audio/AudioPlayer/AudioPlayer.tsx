import { Alert, CircularProgress } from '@mui/material';
import * as React from 'react';
import { useQuery } from 'react-query';

import { primaryColor } from 'src/styles/variables.const';
import { axiosRequest } from 'src/utils/axiosRequest';

type AudioPlayerProps = {
  /** Audio source url */
  src?: string;
  /** Whether or not the audio is being build in the backend */
  isBuildingAudio?: boolean;
  /** Additional styles */
  style?: React.CSSProperties;
};

export const AudioPlayer = ({ src = '', isBuildingAudio, style }: AudioPlayerProps) => {
  const [hasBuildMaybeFailed, setHasBuildMaybeFailed] = React.useState(false);
  const refetchCount = React.useRef(0);
  const { data: isAudioAvailable } = useQuery(
    ['audio-src', src],
    async () => {
      const response = await axiosRequest({
        url: src.startsWith('/api') ? src.slice(4) : src,
        method: 'HEAD',
      });
      return response.error ? false : true;
    },
    {
      enabled: Boolean(src),
      refetchInterval: isBuildingAudio
        ? (resp) => {
            refetchCount.current += 1;
            if (refetchCount.current > 100) {
              // Stop after 100 tries.
              setHasBuildMaybeFailed(true);
              return false;
            }
            return !resp ? 1000 : false; // 1s
          }
        : undefined,
    },
  );

  // No audio source.
  if (!src) {
    return null;
  }

  // Audio is being built.
  if (!isAudioAvailable && isBuildingAudio && !hasBuildMaybeFailed) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: primaryColor }}>
        <CircularProgress size={20} />
        Mix audio en cours...
      </div>
    );
  }

  // Audio is not available.
  if (!isAudioAvailable) {
    return <Alert severity="error">{'Erreur: impossible de charger le son.'}</Alert>;
  }

  return (
    <audio controls style={style}>
      <source src={src} type="audio/mpeg" />
    </audio>
  );
};
