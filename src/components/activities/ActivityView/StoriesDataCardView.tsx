import React from 'react';

import { Grid } from '@mui/material';

import { useImageStoryRequests } from 'src/services/useImagesStory';
import type { Activity } from 'types/activity.type';
import type { User } from 'types/user.type';

import { ActivityCard } from '../ActivityCard';

interface StoriesDataCardViewProps {
  dataStories?: Activity[];
  user: User;
  column?: boolean;
  noTitle?: boolean;
  inspiredStoriesIds?: (number | null | undefined)[];
}

const StoriesDataCardView = ({ dataStories, user, column, noTitle, inspiredStoriesIds }: StoriesDataCardViewProps) => {
  const { getStoriesFromIds } = useImageStoryRequests();
  const [dataStoriesFromInspiredIds, setDataStoriesFromInspiredIds] = React.useState<Activity[]>([]);

  //Get stories activity from story inspiredIds keys
  const getStoryActivity = React.useCallback(async () => {
    const datas = await getStoriesFromIds(inspiredStoriesIds as number[]).then((data) => setDataStoriesFromInspiredIds(data as Activity[]));
    return datas;
  }, [getStoriesFromIds, inspiredStoriesIds]);

  React.useEffect(() => {
    if (inspiredStoriesIds) {
      getStoryActivity().catch();
    }
  }, [getStoryActivity, inspiredStoriesIds]);

  let storyCard = <></>;

  if (dataStoriesFromInspiredIds.length > 0) {
    storyCard = (
      <>
        {dataStoriesFromInspiredIds.map((story) => (
          <Grid item xs={column ? 12 : 4} key={story.id}>
            <ActivityCard key={story.id} activity={story} user={user} isSelf={false} noButtons={false} showEditButtons={false} />
          </Grid>
        ))}
      </>
    );
  } else if (dataStories && dataStories.length > 0) {
    storyCard = (
      <>
        {dataStories.map((story) => (
          <Grid item xs={column ? 12 : 4} key={story.id}>
            <ActivityCard key={story.id} activity={story} user={user} isSelf={false} noButtons={false} showEditButtons={false} />
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
