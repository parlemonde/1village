import React from 'react';

import { Grid, Box } from '@material-ui/core';

import { AvatarView } from 'src/components/activities/views/AvatarView';

import { ActivityViewProps } from './editing.types';
import { TextView } from './views/TextView';

export const MascotteActivityView: React.FC<ActivityViewProps> = ({ activity }: ActivityViewProps) => {
  return (
    <div>
      {activity && (
        <>
          <TextView id={activity.processedContent[0].id} value={activity.processedContent[0].value} key={activity.processedContent[0].id} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box display="flex" justifyContent="center" m={4}>
                <AvatarView value={activity.data.mascotteImage as string} />
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box display="flex" m={2}>
                <TextView id={activity.processedContent[1].id} value={activity.processedContent[1].value} key={activity.processedContent[1].id} />
              </Box>
            </Grid>
          </Grid>
          <TextView id={activity.processedContent[2].id} value={activity.processedContent[2].value} key={activity.processedContent[2].id} />
        </>
      )}
    </div>
  );
};
