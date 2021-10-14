import * as React from 'react';

import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import FullscreenIcon from '@material-ui/icons/Fullscreen';

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
