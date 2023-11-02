import { Grid, ButtonBase } from '@mui/material';
import classNames from 'classnames';
import Image from 'next/image';
import router from 'next/router';
import React from 'react';

import { KeepRatio } from '../KeepRatio';
import { EditButton } from '../buttons/EditButton';
import { bgPage, primaryColor, warningColor } from 'src/styles/variables.const';

type ImageStepContainerProps = {
  urlStep: string;
  imageUrl?: string | null;
  isValid: boolean;
  error: boolean;
  description?: string | null;
};

export function ImageStepContainer({ urlStep, imageUrl, isValid, error, description }: ImageStepContainerProps) {
  return (
    <div
      className={classNames('preview-block', {
        'preview-block--warning': error,
      })}
    >
      <Grid container display="flex" direction="row" alignItems="center" spacing={2}>
        <EditButton
          onClick={() => {
            router.push(urlStep);
          }}
          status={error ? 'warning' : 'success'}
          style={{
            position: 'absolute',
            top: '40%',
            right: '0.5rem',
          }}
        />
        <Grid item xs={12} md={4}>
          <ButtonBase
            style={{
              width: '100%',
              pointerEvents: 'none',
            }}
          >
            <KeepRatio ratio={2 / 3} width="100%">
              <div
                style={{
                  backgroundColor: bgPage,
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '0.5rem',
                  border: `1px solid ${!isValid && imageUrl === '' ? warningColor : primaryColor}`,
                }}
              >
                {imageUrl && <Image layout="fill" objectFit="contain" alt="image de l'objet" src={imageUrl} unoptimized />}
              </div>
            </KeepRatio>
          </ButtonBase>
        </Grid>
        <Grid item xs={12} md={8}>
          <div
            className={classNames('preview-block', {
              'preview-block--warning': !isValid && error,
            })}
            style={{
              margin: '0.5rem',
            }}
          >
            <p>{description || ''}</p>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
