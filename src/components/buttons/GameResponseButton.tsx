import React, { useState, useCallback, useEffect } from 'react';

import { Button, Stack, Typography } from '@mui/material';

import ArrowRight from 'src/svg/arrow-right.svg';

type ResponseButtonProps = {
  value: number;
  isSuccess?: boolean;
  signification?: string | null;
  disabled?: boolean;
  onClick: (value: number, isSuccess?: boolean) => Promise<void>;
  isCorrect?: boolean;
  mimicOrigine?: string;
  isReset?: boolean;
};

const ResponseButton = ({
  value,
  onClick,
  isSuccess = false,
  signification = '',
  disabled = false,
  isCorrect,
  isReset = false,
}: // mimicOrigine,
ResponseButtonProps) => {
  const [hasBeenSelected, setHasBeenSelected] = useState<boolean>(false);
  const [isResetResponse, setIsResetResponse] = useState<boolean>(false);

  useEffect(() => {
    if (isReset) {
      setIsResetResponse(isReset);
    }
  }, [isReset]);

  if (isResetResponse && hasBeenSelected) {
    setHasBeenSelected(false);
  }
  const handleClick = useCallback(() => {
    if (hasBeenSelected) return;
    setHasBeenSelected(true);
    setIsResetResponse(false);
    return onClick(value, isSuccess);
  }, [hasBeenSelected, onClick, value, isSuccess]);

  const color = isSuccess ? 'success' : 'error';

  return (
    <Button
      size="large"
      fullWidth
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: 'bgPage',
        minHeight: '60px',
        height: 'auto',
        boxShadow: 'none',
        maxWidth: '350px',
        margin: '10px auto',
      }}
      disabled={!hasBeenSelected && disabled}
      variant="contained"
      color={hasBeenSelected ? color : 'inherit'}
      onClick={handleClick}
      endIcon={hasBeenSelected ? null : <ArrowRight sx={{ color: hasBeenSelected ? 'transparent' : 'white' }} />}
    >
      {isCorrect ? (
        <Stack direction="column">
          <Typography>{signification}</Typography>
          {/* <Typography variant="caption">Origine : {mimicOrigine || ''}</Typography> */}
        </Stack>
      ) : (
        signification
      )}
    </Button>
  );
};

export default ResponseButton;
