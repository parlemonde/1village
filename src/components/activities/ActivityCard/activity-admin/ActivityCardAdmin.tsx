import React from 'react';
import type { Activity } from 'server/entities/activity';

import { Card, CardHeader, Avatar, IconButton, CardMedia, CardContent, Typography, CardActions } from '@mui/material';

import PelicoSouriant from 'src/svg/pelico/pelico-souriant.svg';

export default function ActivityCard(activity: Pick<Activity, 'images' | 'content' | 'phase' | 'data'>) {
  const title: string = activity?.data?.name ? (activity.data.name as string) : '';
  const imageUrl: string =
    activity?.images?.length && activity.images[0].imageUrl ? activity.images[0].imageUrl : 'https://placehold.co/600x400?text=No Picture';
  return (
    <Card variant="outlined" sx={{ padding: 1, margin: 2 }}>
      {/* <p>image: {activity.images ? activity.images[0].imageUrl : 'none'}</p>
      <p>content: {activity.content.map((e) => e.value)}</p> */}
      <CardHeader
        avatar={
          <Avatar sx={{ backgroundColor: 'transparent' }}>
            <PelicoSouriant />
          </Avatar>
        }
        title={title}
        titleTypographyProps={{ variant: 'h6' }}
      />
      {/* <div style={{ display: 'flex' }}> */}
      <CardMedia
        sx={{ padding: '1em 1em 0 1em', objectFit: 'cover', objectPosition: 'center' }}
        component="img"
        height="194"
        image={imageUrl}
        alt="Activity picture"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the
          mussels, if you like.
        </Typography>
      </CardContent>
      {/* </div> */}
    </Card>
  );
}
