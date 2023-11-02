import Link from 'next/link';
import React from 'react';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Button } from '@mui/material';

export interface StepsButtonProps {
  prev?: string | (() => void);
  next?: string | (() => void);
}

export const StepsButton = ({ prev, next }: StepsButtonProps) => {
  return (
    <div style={{ width: '100%', margin: '3rem 0', minHeight: '2rem' }}>
      {prev !== undefined &&
        (typeof prev === 'string' ? (
          <Link href={prev} passHref>
            <Button component="a" href={prev} variant="outlined" color="primary">
              <ChevronLeftIcon />
              Étape précédente
            </Button>
          </Link>
        ) : (
          <Button onClick={prev} variant="outlined" color="primary">
            <ChevronLeftIcon />
            Étape précédente
          </Button>
        ))}
      {next !== undefined &&
        (typeof next === 'string' ? (
          <Link href={next} passHref>
            <Button component="a" href={next} variant="outlined" style={{ float: 'right' }} color="primary">
              Étape suivante
              <ChevronRightIcon />
            </Button>
          </Link>
        ) : (
          <Button onClick={next} variant="outlined" style={{ float: 'right' }} color="primary">
            Étape suivante
            <ChevronRightIcon />
          </Button>
        ))}
    </div>
  );
};
