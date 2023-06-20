import React, { useState, useCallback } from 'react';

import { Button, Grid, Typography } from '@mui/material';

import ArrowRight from 'src/svg/arrow-right.svg';
import type { GameResponseValue } from 'types/gameResponse.type';

type ResponseButtonProps = {
  value: GameResponseValue;
  isSuccess?: boolean;
  signification?: string | null;
  disabled?: boolean;
  onClick: (value: GameResponseValue, isSuccess?: boolean) => Promise<void>;
  isCorrect?: boolean;
  mimicOrigine?: string;
};

const ResponseButton = ({
  value,
  onClick,
  isSuccess = false,
  signification = '',
  disabled = false,
  isCorrect,
  mimicOrigine,
}: ResponseButtonProps) => {
  const [hasBeenSelected, setHasBeenSelected] = useState<boolean>(false);

  const handleClick = useCallback(() => {
    if (hasBeenSelected) return;
    setHasBeenSelected(true);
    return onClick(value, isSuccess);
  }, [hasBeenSelected, isSuccess, value, setHasBeenSelected, onClick]);

  const color = isSuccess ? 'success' : 'error';

  return (
    <Button
      size="large"
      fullWidth
      sx={{ justifyContent: 'space-between', backgroundColor: 'bgPage', height: '60px', boxShadow: 'none' }}
      disabled={!hasBeenSelected && disabled}
      variant="contained"
      color={hasBeenSelected ? color : 'inherit'}
      onClick={handleClick}
      endIcon={hasBeenSelected ? null : <ArrowRight sx={{ color: hasBeenSelected ? 'transparent' : 'white' }} />}
    >
      {isCorrect ? (
        <Grid container direction="column" sx={{ textAlign: 'left' }}>
          <Grid item>
            <Typography>{hasBeenSelected ? signification : ''}</Typography>
          </Grid>
          {hasBeenSelected && (
            <Grid item>
              <Typography variant="caption">Origine : {mimicOrigine || ''}</Typography>
            </Grid>
          )}
        </Grid>
      ) : (
        signification
      )}
    </Button>
  );
};

export default ResponseButton;
