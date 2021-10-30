import React from 'react';

import HelpIcon from '@mui/icons-material/Help';
import Popover from '@mui/material/Popover';

interface QuestionButtonProps {
  helpMessage: string | React.ReactNode | React.ReactNodeArray;
}

export const QuestionButton = ({ helpMessage }: QuestionButtonProps) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  return (
    <div>
      <div aria-haspopup="true" style={{ cursor: 'pointer' }} onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
        <HelpIcon />
      </div>
      <Popover
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        style={{ pointerEvents: 'none' }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <div className="text text--small" style={{ padding: '0.5rem 1rem', maxWidth: '250px' }}>
          {helpMessage}
        </div>
      </Popover>
    </div>
  );
};
