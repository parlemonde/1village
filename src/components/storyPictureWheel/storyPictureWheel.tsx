import React from 'react';

import { Grid, Card, Typography, CardMedia, Button } from '@mui/material';

import { primaryColor } from 'src/styles/variables.const';
import type { StoriesData, ImagesRandomData } from 'types/story.type';

interface StoryPictureWheelProps {
  images: StoriesData | ImagesRandomData;
  onClick?: () => void;
}

const StoryPictureWheel = ({ images, onClick }: StoryPictureWheelProps) => {
  return (
    <Grid container direction="row" justifyContent="center" alignItems="center" spacing={1}>
      <Grid
        container
        spacing={1}
        xs={5}
        style={{ border: 'solid 8px', borderRadius: '1rem', color: 'grey', boxSizing: 'border-box', width: 'inherit', paddingRight: '8px' }}
      >
        {images.object.imageUrl && images.place.imageUrl && images.odd.imageUrl && (
          <>
            <Grid item xs>
              <Card sx={{ mb: 1 }}>
                <Typography sx={{ mb: 1.5, p: 2, textAlign: 'center', borderRadius: '0.5rem', backgroundColor: '#DEDBDB' }} variant={'h3'}>
                  Objet
                </Typography>
                <CardMedia
                  sx={{ borderRadius: '0.5rem', mt: 1 }}
                  component="img"
                  height="150"
                  image={images.object.imageUrl}
                  alt="objet de l'histoire"
                />
              </Card>
            </Grid>
            <Grid item xs>
              <Card sx={{ mb: 1 }}>
                <Typography sx={{ mb: 1.5, p: 2, textAlign: 'center', borderRadius: '0.5rem', backgroundColor: '#DEDBDB' }} variant={'h3'}>
                  Lieu
                </Typography>
                <CardMedia
                  sx={{ borderRadius: '0.5rem', mt: 1 }}
                  component="img"
                  height="150"
                  image={images.place.imageUrl}
                  alt="lieu de l'histoire"
                />
              </Card>
            </Grid>
            <Grid item xs>
              <Card sx={{ mb: 1 }}>
                <Typography sx={{ mb: 1.5, p: 2, textAlign: 'center', borderRadius: '0.5rem', backgroundColor: '#DEDBDB' }} variant={'h3'}>
                  ODD
                </Typography>
                <CardMedia
                  sx={{ borderRadius: '0.5rem', mt: 1 }}
                  component="img"
                  height="150"
                  image={images.odd.imageUrl}
                  alt="Objectifs de développement durable de l'histoire"
                />
              </Card>
            </Grid>
          </>
        )}
      </Grid>
      <Button
        variant="contained"
        style={{
          backgroundColor: `${primaryColor}`,
          float: 'right',
          marginLeft: '1rem',
        }}
        onClick={onClick}
      >
        Tirer de nouvelles <br></br> images ici
      </Button>
    </Grid>
  );
};

export default StoryPictureWheel;
