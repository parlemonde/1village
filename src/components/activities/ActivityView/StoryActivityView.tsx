import Image from 'next/image';
import React from 'react';

import { Container } from '@mui/material';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';

import StoriesDataCardView from './StoriesDataCardView';
import type { ActivityViewProps } from './activity-view.types';
import { isStory } from 'src/activity-types/anyActivity';
import { bgPage } from 'src/styles/variables.const';
import type { StoryActivity } from 'types/story.type';

export const StoryActivityView = ({ activity }: ActivityViewProps<StoryActivity>) => {
  const { object, place, odd } = activity.data;
  const inspiredStoriesIds = Array.from(new Set([object.inspiredStoryId, place.inspiredStoryId, odd.inspiredStoryId])).filter(
    (id) => id !== activity.id && id !== undefined && id !== null,
  ) as number[];

  const getHeightTypography = (objectDescription: string, placeDescription: string, oddDescription: string) => {
    const objectDescriptionLenght = objectDescription.length;
    const placeDescriptionLenght = placeDescription.length;
    const oddDescriptionLenght = oddDescription.length;

    if (oddDescriptionLenght > placeDescriptionLenght && oddDescriptionLenght > objectDescriptionLenght) {
      return '10rem';
    }
    return objectDescriptionLenght > placeDescriptionLenght
      ? `${(objectDescriptionLenght * 25) / 400}rem` // (lenght * Max height (rem)) / Max lenght (400 here)
      : `${(placeDescriptionLenght * 25) / 400}rem`;
  };

  return (
    <Container maxWidth="lg">
      <Box>
        <div style={{ margin: '1rem' }}>
          <div className="text-center" style={{ marginBottom: '1rem' }}>
            <h3>{isStory(activity)}</h3>
          </div>
          {isStory(activity) && (
            <Grid container spacing={2}>
              {activity.data.isOriginal === false && inspiredStoriesIds.length > 0 && <StoriesDataCardView inspiredStoriesIds={inspiredStoriesIds} />}
              <Grid item xs={12} md={12}>
                <p>{activity.data.tale.tale}</p>
              </Grid>
              {activity.data.tale.imageStory && (
                <Grid item xs={6}>
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      minHeight: '200px',
                      position: 'relative',
                    }}
                  >
                    <Image layout="fill" objectFit="contain" alt="image du plat" unoptimized src={activity.data.tale.imageStory} />
                  </div>
                </Grid>
              )}
              <>
                <div style={{ margin: '2rem 0', backgroundColor: bgPage, padding: '0.5rem', borderRadius: '5px' }}>
                  Voilà l’objet, le lieu et l’objectif du développement durable choisis par vos Pélicopains pour écrire leur histoire :{' '}
                </div>
              </>
              <Grid
                container
                spacing={1}
                xs={8}
                item
                style={{
                  border: 'solid 8px',
                  borderRadius: '1rem',
                  color: 'grey',
                  boxSizing: 'border-box',
                  width: 'inherit',
                  paddingRight: '8px',
                  paddingLeft: '8px',
                  paddingTop: '8px',
                }}
              >
                {activity.data.object.imageUrl &&
                  activity.data.place.imageUrl &&
                  activity.data.odd.imageUrl &&
                  activity.data.object.description !== null &&
                  activity.data.place.description !== null &&
                  activity.data.odd.description !== null && (
                    <>
                      <Grid item xs style={{ paddingTop: '0px', paddingLeft: '0px' }}>
                        <Card sx={{ mb: 1 }}>
                          <Typography
                            sx={{
                              mb: 1.5,
                              p: 1,
                              height: getHeightTypography(
                                activity.data.object.description,
                                activity.data.place.description,
                                activity.data.odd.description,
                              ),
                              textAlign: 'center',
                              borderRadius: '0.5rem',
                              backgroundColor: '#DEDBDB',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                            variant={'subtitle2'}
                          >
                            {activity.data.object.description}
                          </Typography>
                          <CardMedia
                            sx={{ borderRadius: '0.5rem', mt: 1 }}
                            component="img"
                            height="150"
                            image={activity.data.object.imageUrl}
                            alt="objet de l'histoire"
                          />
                        </Card>
                      </Grid>
                      <Grid item xs style={{ paddingTop: '0px' }}>
                        <Card sx={{ mb: 1 }}>
                          <Typography
                            sx={{
                              mb: 1.5,
                              p: 1,
                              height: getHeightTypography(
                                activity.data.object.description,
                                activity.data.place.description,
                                activity.data.odd.description,
                              ),
                              textAlign: 'center',
                              borderRadius: '0.5rem',
                              backgroundColor: '#DEDBDB',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                            variant={'subtitle2'}
                          >
                            {activity.data.place.description}
                          </Typography>{' '}
                          <CardMedia
                            sx={{ borderRadius: '0.5rem', mt: 1 }}
                            component="img"
                            height="150"
                            image={activity.data.place.imageUrl}
                            alt="lieu de l'histoire"
                          />
                        </Card>
                      </Grid>
                      <Grid item xs style={{ paddingTop: '0px' }}>
                        <Card sx={{ mb: 1 }}>
                          <Typography
                            sx={{
                              mb: 1.5,
                              p: 1,
                              height: getHeightTypography(
                                activity.data.object.description,
                                activity.data.place.description,
                                activity.data.odd.description,
                              ),
                              textAlign: 'center',
                              borderRadius: '0.5rem',
                              backgroundColor: '#DEDBDB',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                            variant={'subtitle2'}
                          >
                            {activity.data.odd.description}
                          </Typography>
                          <CardMedia
                            sx={{ borderRadius: '0.5rem', mt: 1 }}
                            component="img"
                            height="150"
                            image={activity.data.odd.imageUrl}
                            alt="Objectifs de développement durable de l'histoire"
                          />
                        </Card>
                      </Grid>
                    </>
                  )}
              </Grid>
            </Grid>
          )}
        </div>
      </Box>
    </Container>
  );
};
