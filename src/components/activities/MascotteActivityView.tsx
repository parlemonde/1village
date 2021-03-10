import React from 'react';

import { Grid, Box } from '@material-ui/core';

import { isPresentation } from 'src/activities/anyActivity';
import { isMascotte } from 'src/activities/presentation.const';
import { AvatarView } from 'src/components/activities/views/AvatarView';

import { ActivityViewProps } from './editing.types';

export const MascotteActivityView: React.FC<ActivityViewProps> = ({ activity }: ActivityViewProps) => {
  if (!isPresentation(activity)) {
    return null;
  }
  if (!isMascotte(activity)) {
    return null;
  }

  return (
    <div>
      {activity && (
        <>
          <div>
            {activity.processedContent.length > 0 &&
              activity.processedContent[0].value.split('\n').map((s, index) => (
                <p key={index} style={{ margin: '0.5rem 0' }}>
                  {s}
                </p>
              ))}
          </div>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box display="flex" justifyContent="center" m={4}>
                <AvatarView value={activity.data.mascotteImage as string} />
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box display="flex" m={2}>
                <div>
                  {activity.processedContent.length > 1 &&
                    activity.processedContent[1].value.split('\n').map((s, index) => (
                      <p key={index} style={{ margin: '0.5rem 0' }}>
                        {s}
                      </p>
                    ))}
                </div>
              </Box>
            </Grid>
          </Grid>
          <div>
            {activity.processedContent.length > 2 &&
              activity.processedContent[2].value.split('\n').map((s, index) => (
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
