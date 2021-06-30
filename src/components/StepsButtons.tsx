import Link from 'next/link';
import React from 'react';

import { Button } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

interface StepsButtonProps {
  prev?: string | (() => void);
  next?: string | (() => void);
}

export const StepsButton: React.FC<StepsButtonProps> = ({ prev, next }: StepsButtonProps) => {
  return (
    <div style={{ width: '100%', margin: '3rem 0', minHeight: '2rem' }}>
      {prev !== undefined &&
        (typeof prev === 'string' ? (
          <Link href={prev}>
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
          <Link href={next}>
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
