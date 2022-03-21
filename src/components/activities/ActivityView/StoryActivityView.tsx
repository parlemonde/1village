import Image from 'next/image';
import React from 'react';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

import { isStory } from 'src/activity-types/anyActivity';
import { bgPage } from 'src/styles/variables.const';
import type { StoryActivity } from 'types/story.type';

import type { ActivityViewProps } from './activity-view.types';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

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
            <Grid item xs={12} md={12}>
              <p style={{ backgroundColor: bgPage }}>
                Voilà le l’objet, le lieu et l’objectif du développement durable choisis par vos Pélicopains pour écrire leur histoire :{' '}
              </p>
            </Grid>

            <Grid container columns={{ xs: 4, md: 12 }}>
              {activity.data.object.imageUrl && activity.data.place.imageUrl && activity.data.odd.imageUrl && (
                <>
                  <Grid item xs={2} sm={4} md={4}>
                    <p>Image 1</p>
                    <Image height="150rem" width="150rem" objectFit="contain" alt="image du plat" unoptimized src={activity.data.object.imageUrl} />
                  </Grid>
                  <Grid item xs={2} sm={4} md={4}>
                    <p>Image 2</p>
                    <Image height="150rem" width="150rem" objectFit="contain" alt="image du plat" unoptimized src={activity.data.place.imageUrl} />
                  </Grid>
                  <Grid item xs={2} sm={4} md={4}>
                    <p>Image 3</p>
                    <Image height="150rem" width="150rem" objectFit="contain" alt="image du plat" unoptimized src={activity.data.odd.imageUrl} />
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        )}
      </div>

      <div style={{ margin: '2rem 0', backgroundColor: bgPage, padding: '0.5rem', borderRadius: '5px' }}>
        <strong>Votre défi : </strong>
        {/* {getDefi(activity.subType || 0, activity.data)} */}
      </div>
    </div>
  );
};
