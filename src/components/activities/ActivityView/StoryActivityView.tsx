import Image from 'next/image';
import React from 'react';

import CardMedia from '@mui/material/CardMedia';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';

import { isStory } from 'src/activity-types/anyActivity';
import { bgPage } from 'src/styles/variables.const';
import type { StoryActivity } from 'types/story.type';

import type { ActivityViewProps } from './activity-view.types';

export const StoryActivityView = ({ activity }: ActivityViewProps<StoryActivity>) => {
  return (
    <div>
      <div style={{ margin: '1rem 0' }}>
        <div className="text-center" style={{ marginBottom: '1rem' }}>
          <h3>{isStory(activity)}</h3>
        </div>
        {isStory(activity) && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <p>{activity.data.tale.tale}</p>
            </Grid>
            {activity.data.tale.imageStory && (
              <Grid item xs={12}>
                <div style={{ width: '100%', height: '100%', minHeight: '200px', position: 'relative' }}>
                  <Image layout="fill" objectFit="contain" alt="image du plat" unoptimized src={activity.data.tale.imageStory} />
                </div>
              </Grid>
            )}
            <>
              <div style={{ margin: '2rem 0', backgroundColor: bgPage, padding: '0.5rem', borderRadius: '5px' }}>
                Voilà le l’objet, le lieu et l’objectif du développement durable choisis par vos Pélicopains pour écrire leur histoire :{' '}
              </div>
            </>

            <Grid container columns={{ xs: 4, sm: 8, md: 6 }} spacing={1} style={{ border: 'solid', borderRadius: '1rem', color: 'grey' }}>
              {activity.data.object.imageUrl && activity.data.place.imageUrl && activity.data.odd.imageUrl && (
                <>
                  <Grid item xs={2} sm={4} md={2}>
                    <Card sx={{ maxWidth: 210 }}>
                      <Typography
                        sx={{ mb: 1.5, mt: 1.5, height: 50, textAlign: 'center', backgroundColor: '#999999', color: 'white' }}
                        variant={'h3'}
                        color="text.secondary"
                      >
                        {activity.data.object.description}
                      </Typography>
                      <CardMedia
                        sx={{ borderRadius: '0.5rem' }}
                        component="img"
                        height="150"
                        image={activity.data.object.imageUrl}
                        alt="Paella dish"
                      />
                    </Card>
                  </Grid>
                  <Grid item xs={2} sm={4} md={2}>
                    <Card sx={{ maxWidth: 210 }}>
                      <Typography sx={{ mb: 1.5, height: 50, textAlign: 'center' }} variant={'h3'} color="text.secondary">
                        {activity.data.place.description}
                      </Typography>{' '}
                      <CardMedia component="img" height="150" image={activity.data.place.imageUrl} alt="Paella dish" />
                    </Card>
                  </Grid>
                  <Grid item xs={2} sm={4} md={2}>
                    <Card sx={{ maxWidth: 210, fontSize: '1rem' }}>
                      <Typography sx={{ mb: 1.5, height: 50, textAlign: 'center' }} variant={'h3'} color="text.secondary">
                        {activity.data.odd.description}
                      </Typography>
                      <CardMedia component="img" height="150" image={activity.data.odd.imageUrl} alt="Paella dish" />
                    </Card>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        )}
      </div>
    </div>
  );
};
