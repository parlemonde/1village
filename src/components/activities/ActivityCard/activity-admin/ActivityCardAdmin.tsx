import React, { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import type { Activity } from 'server/entities/activity';

import { Card, CardHeader, Avatar, CardMedia, CardContent, Typography, Button, CardActions, CircularProgress } from '@mui/material';

import { usePublishActivity } from 'src/api/activities/activities.put';
import PelicoSouriant from 'src/svg/pelico/pelico-souriant.svg';
import { htmlToText } from 'src/utils';

export default function ActivityCard(activity: Pick<Activity, 'images' | 'content' | 'phase' | 'data' | 'id' | 'status'>) {
  const publishActivity = usePublishActivity({ activityId: activity.id });
  const queryClient = useQueryClient();

  const title: string = activity?.data?.name ? (activity.data.name as string) : '';
  const imageUrl: string =
    activity?.images?.length && activity.images[0].imageUrl ? activity.images[0].imageUrl : 'https://placehold.co/600x400?text=No Picture';
  const content: string = activity.content.reduce((acc, curr) => {
    if (curr.type === 'text') {
      acc += curr.value;
    }
    return acc;
  }, '');

  useEffect(() => {
    if (publishActivity.isSuccess) {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    }
  }, [publishActivity.isSuccess, queryClient]);
  return (
    <Card variant="outlined" sx={{ padding: 1, margin: 2 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ backgroundColor: 'transparent' }}>
            <PelicoSouriant />
          </Avatar>
        }
        title={title}
        titleTypographyProps={{ variant: 'h6' }}
      />
      <CardMedia
        sx={{ padding: '1em 1em 0 1em', objectFit: 'cover', objectPosition: 'center' }}
        component="img"
        height="194"
        image={imageUrl}
        alt="Activity picture"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {htmlToText(content)}
        </Typography>
      </CardContent>
      {/* display publish button only if activity is not published yet (status = 1) */}
      {activity.status !== 0 && (
        <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button size="small" sx={{ border: 1 }} onClick={() => publishActivity.mutate()} disabled={publishActivity.isLoading}>
            {publishActivity.isLoading ? <CircularProgress /> : 'Publier'}
          </Button>
        </CardActions>
      )}
    </Card>
  );
}
