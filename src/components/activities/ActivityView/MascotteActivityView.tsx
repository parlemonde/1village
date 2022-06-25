import React from 'react';

import { Grid, Box } from '@mui/material';

import { ImageView } from '../content/views/ImageView';
import type { ActivityViewProps } from './activity-view.types';
import type { MascotteActivity } from 'src/activity-types/mascotte.types';
import { AvatarImg } from 'src/components/Avatar';

export const MascotteActivityView = ({ activity }: ActivityViewProps<MascotteActivity>) => {
  return (
    <div>
      {activity && (
        <>
          <Grid container spacing={0} style={{ marginTop: '2rem' }}>
            <Grid item xs={12} md={12}>
              <div style={{ marginRight: '0.25rem' }}>
                {activity.content.length > 0 &&
                  activity.content[0].value.split('\n').map((s, index) => (
                    <p key={index} style={{ margin: '0.5rem 0' }}>
                      {s}
                    </p>
                  ))}
              </div>
            </Grid>
            <Grid item xs={12} md={12} style={{ display: 'flex' }}>
              <ImageView id={1} value={activity.data.classImg} />
              {activity.data.classImgDesc}
            </Grid>
            <Grid item xs={12} md={4}>
              <Box display="flex" justifyContent="center" m={4}>
                <AvatarImg src={activity.data.mascotteImage} noLink />
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <div style={{ alignItems: 'center', display: 'flex', height: '100%' }}>
                <div>
                  {activity.content.length > 1 &&
                    activity.content[1].value.split('\n').map((s, index) => (
                      <p key={index} style={{ margin: '0.5rem 0' }}>
                        {s}
                      </p>
                    ))}
                </div>
              </div>
            </Grid>
          </Grid>
          <div>
            {activity.content.length > 2 &&
              activity.content[2].value.split('\n').map((s, index) => (
                <p key={index} style={{ margin: '0.5rem 0' }}>
                  {s}
                </p>
              ))}
          </div>
        </>
      )}
    </div>
  );
};
