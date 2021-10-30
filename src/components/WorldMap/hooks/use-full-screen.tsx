import * as React from 'react';

import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

export const useFullScreen = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = React.useState(false);

  const toggleFullScreen = () => {
    if (!containerRef.current) {
      return;
    }
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  const fullScreenButton = (
    <Tooltip title="Plein écran" enterDelay={500}>
      <Button variant="outlined" style={{ marginTop: '0.5rem', padding: '5px', minWidth: 0, backgroundColor: 'white' }} onClick={toggleFullScreen}>
        {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </Button>
    </Tooltip>
  );

  return { containerRef, fullScreenButton };
};
