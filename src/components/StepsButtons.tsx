import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, Button } from '@mui/material';
import Link from 'next/link';
import React from 'react';

export interface StepsButtonProps {
  prev?: string | (() => void);
  next?: string | (() => void);
}

export const StepsButton = ({ prev, next }: StepsButtonProps) => {
  const justifyContent = prev && next ? 'space-between' : prev ? 'start' : 'end';
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: justifyContent,
        gap: {
          xs: '0.2rem',
          sm: '1rem',
        },
        margin: '1rem 0',
        minHeight: '2rem',
      }}
    >
      {prev !== undefined &&
        (typeof prev === 'string' ? (
          <Link href={prev} passHref>
            <Button
              component="a"
              style={{ maxWidth: '200px', flexBasis: '50%', alignItems: 'center' }}
              href={prev}
              variant="outlined"
              color="primary"
            >
              <ChevronLeftIcon />
              Étape précédente
            </Button>
          </Link>
        ) : (
          <Button style={{ maxWidth: '200px', flexBasis: '50%', alignItems: 'center' }} onClick={prev} variant="outlined" color="primary">
            <ChevronLeftIcon />
            Étape précédente
          </Button>
        ))}
      {next !== undefined &&
        (typeof next === 'string' ? (
          <Link href={next} passHref>
            <Button
              component="a"
              href={next}
              variant="outlined"
              style={{ maxWidth: '200px', flexBasis: '50%', alignItems: 'center' }}
              color="primary"
            >
              Étape suivante
              <ChevronRightIcon />
            </Button>
          </Link>
        ) : (
          <Button onClick={next} variant="outlined" style={{ maxWidth: '200px', flexBasis: '50%', alignItems: 'center' }} color="primary">
            Étape suivante
            <ChevronRightIcon />
          </Button>
        ))}
    </Box>
  );
};
