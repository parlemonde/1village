import React from 'react';

import { Grid } from '@mui/material';

import type { Activity } from 'types/activity.type';
import type { User } from 'types/user.type';

import { ActivityCard } from '../ActivityCard';

interface StoriesDataCardViewProps {
  dataStories: Activity[];
  user: User;
  column?: boolean;
  noTitle?: boolean;
}

const StoriesDataCardView = ({ dataStories, user, column, noTitle }: StoriesDataCardViewProps) => {
  return (
    <>
      {noTitle ? (
        ''
      ) : (
        <p>
          <strong>Notre histoire s&apos;inspire de ces histoires</strong>
        </p>
      )}
      <Grid container spacing={1} sx={{ mt: 1 }}>
        {dataStories &&
          dataStories.length > 0 &&
          dataStories.map((story) => (
            <>
              <Grid item xs={column ? 12 : 4}>
                <ActivityCard key={story.id} activity={story} user={user} isSelf={false} noButtons={false} showEditButtons={false} />
              </Grid>
            </>
          ))}
      </Grid>
    </>
  );
};

export default StoriesDataCardView;
