import React, { useContext } from 'react';

import { Grid } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import { MediaCarousel } from 'src/components/admin/mediatheque/Carousel';
import DownloadButton from 'src/components/admin/mediatheque/DownloadButton';
import { activityNameMapper } from 'src/config/mediatheque/dataFilters';
import MediathequeContext from 'src/contexts/mediathequeContext';
import type { Activity, ActivityContent } from 'types/activity.type';

interface User {
  school: string;
  type: number;
}

interface Village {
  name: string;
}

interface ExtendedActivity extends Activity {
  user: User;
  village: Village;
}
//CARROUSEL si item.content.length > 1 alors fais le caroussel sirnon affiche moi le classique celui auddessus

export default function MediaCard({ page }: { page: number }) {
  const { allFiltered } = useContext(MediathequeContext);

  const slicedData: ExtendedActivity[] = allFiltered?.slice(page, page + 6);

  const getDefaultImage = (item: ActivityContent): string => {
    const mediaTypes = [
      { type: 'video', value: 'https://pirem.org/wp-content/uploads/2021/05/Video-Icon-crop.png' },
      { type: 'sound', value: 'https://www.shutterstock.com/image-vector/sound-vector-icon-black-speaker-260nw-1660384750.jpg' },
    ];

    const media = mediaTypes.find((media) => media.type === item.type);

    if (item.type === 'text') {
      return 'default-image-for-text-type.png';
    }
    return item.type === 'image'
      ? item.value
      : media?.value || 'https://www.techsmith.de/blog/wp-content/uploads/2023/03/how-to-make-a-youtube-video.png';
  };

  return (
    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
      {slicedData.map((item, index) => (
        <Grid item xs={2} sm={4} md={4} key={index}>
          <Card
            sx={{
              width: '100%',
              height: '100%',
              marginBottom: '10px',
              overflow: 'auto',
              maxWidth: 345,
              minWidth: 100,
            }}
          >
            <div>
              {item.content.length > 1 ? (
                <div>
                  <MediaCarousel
                    items={item.content.map((mediaItem) => ({
                      ...mediaItem,
                      value: getDefaultImage(mediaItem),
                    }))}
                  />
                </div>
              ) : (
                <CardMedia sx={{ height: 140 }} image={getDefaultImage(item.content[0])} title="Media" />
              )}
            </div>

            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {item.user.school}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.village.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {activityNameMapper[item.type]}
              </Typography>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <DownloadButton data={[item]} isCard={true} />
              </div>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
