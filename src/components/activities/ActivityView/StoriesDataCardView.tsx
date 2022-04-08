import React from 'react';

import { Grid } from '@mui/material';

import { UserContext } from 'src/contexts/userContext';
import type { StoryActivity } from 'types/story.type';
import type { User } from 'types/user.type';

import { ActivityCard } from '../ActivityCard';

interface StoriesDataCardViewProps {
  inspiredStoriesIds: (number | null | undefined)[];
  user: User;
}

const StoriesDataCardView = ({ inspiredStoriesIds, user }: StoriesDataCardViewProps) => {
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const [dataStories, setdataStories] = React.useState<StoryActivity[]>([]);

  const getActivityStory = React.useCallback(
    async (inspiredStoriesIds) => {
      inspiredStoriesIds.forEach(async (id: number) => {
        const response = await axiosLoggedRequest({
          method: 'GET',
          url: `/activities/${id}`,
        });
        if (!response.error && response.data) {
          setdataStories((prev) => [...prev, response.data as StoryActivity]);
        }
      });
    },
    [axiosLoggedRequest],
  );

  React.useEffect(() => {
    getActivityStory(inspiredStoriesIds).catch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getActivityStory]);

  return (
    <>
      <p>
        <strong>Notre histoire s&apos;inspire de ces histoires</strong>
      </p>
      <Grid container spacing={1} sx={{ mt: 1 }}>
        {dataStories &&
          dataStories.length > 0 &&
          dataStories.map((story) => (
            <>
              <Grid item xs={4}>
                <ActivityCard key={story.id} activity={story} user={user} isSelf={false} noButtons={false} showEditButtons={false} />
              </Grid>
            </>
          ))}
      </Grid>
    </>
  );
};

export default StoriesDataCardView;
