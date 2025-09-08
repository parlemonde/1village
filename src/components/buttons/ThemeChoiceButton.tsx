import React from 'react';

import { Box, ButtonBase } from '@mui/material';

import ArrowRight from 'src/svg/arrow-right.svg';

interface ThemeChoiceButtonProps {
  label: string;
  description?: string;
  isOpen?: boolean;
  onClick?(): void;
  additionalContent?: React.ReactNode | React.ReactNodeArray;
}

export const ThemeChoiceButton = ({ label, isOpen, description, additionalContent, onClick = () => {} }: ThemeChoiceButtonProps) => {
  const [open, setOpen] = React.useState(false);
  const showAdd = isOpen !== undefined ? isOpen : open;

  return (
    <div style={{ width: '100%', borderRadius: '10px', marginBottom: '1rem', overflow: 'hidden' }}>
      <ButtonBase
        style={{ width: '100%', textAlign: 'left' }}
        onClick={() => {
          onClick();
          if (additionalContent && isOpen === undefined) {
            setOpen(!open);
          }
        }}
      >
        <div
          className="bg-grey"
          style={{ padding: '0.8rem 1.4rem', borderRadius: showAdd ? '0' : '10px', width: '100%', display: 'flex', alignItems: 'center' }}
        >
          <div style={{ flex: '1' }}>
            <h3>{label}</h3>
            <span className="text" style={{ display: 'block', marginTop: '0.4rem' }}>
              {description}
            </span>
          </div>
          <ArrowRight style={{ transform: showAdd ? 'rotate(90deg)' : 'none', transition: '100ms ease-in-out' }} />
        </div>
      </ButtonBase>
      {showAdd && additionalContent && (
        <Box
          className="bg-grey"
          sx={{
            padding: {
              sx: '5px',
              sm: '0.8rem 1.4rem',
            },
          }}
        >
          {additionalContent}
        </Box>
      )}
    </div>
  );
};
