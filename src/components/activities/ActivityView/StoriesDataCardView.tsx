import React from 'react';

import { Grid } from '@mui/material';

import { ActivityCard } from '../ActivityCard';
import { useImageStories } from 'src/services/useImagesStory';
import { useVillageUsers } from 'src/services/useVillageUsers';
import type { Activity } from 'types/activity.type';
import type { User } from 'types/user.type';

interface StoriesDataCardViewProps {
  dataStories?: Activity[];
  column?: boolean;
  noTitle?: boolean;
  inspiredStoriesIds?: number[];
}

const StoriesDataCardView = ({ dataStories, column, noTitle, inspiredStoriesIds }: StoriesDataCardViewProps) => {
  const { getStoriesByIds } = useImageStories();
  const [dataStoriesFromInspiredIds, setDataStoriesFromInspiredIds] = React.useState<Activity[]>([]);
  const { users } = useVillageUsers();
  const usersMap = React.useMemo(() => {
    return users.reduce<{ [key: number]: User }>((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});
  }, [users]);

  React.useEffect(() => {
    if (inspiredStoriesIds) {
      getStoriesByIds(inspiredStoriesIds)
        .then((data) => setDataStoriesFromInspiredIds(data as Activity[]))
        .catch();
    }
  }, [inspiredStoriesIds, getStoriesByIds]);

  let storyCard = <></>;

  if (dataStoriesFromInspiredIds.length > 0) {
    storyCard = (
      <>
        {dataStoriesFromInspiredIds.map((story) => (
          <Grid item xs={column ? 12 : 12 / dataStoriesFromInspiredIds.length} key={story.id}>
            <ActivityCard key={story.id} activity={story} user={usersMap[story.userId]} isSelf={false} noButtons={false} showEditButtons={false} />
          </Grid>
        ))}
      </>
    );
  } else if (dataStories && dataStories.length > 0) {
    storyCard = (
      <>
        {dataStories.map((story) => (
          <Grid item xs={column ? 12 : 12 / dataStories.length} key={story.id}>
            <ActivityCard key={story.id} activity={story} user={usersMap[story.userId]} isSelf={false} noButtons={false} showEditButtons={false} />
          </Grid>
        ))}
      </>
    );
  }
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
        {storyCard}
      </Grid>
    </>
  );
};

export default StoriesDataCardView;
