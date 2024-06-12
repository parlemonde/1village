import React, { useContext } from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import DownloadButton from 'src/components/admin/mediatheque/DownloadButton';
import { activityNameMapper } from 'src/config/mediatheque/dataFilters';
import MediathequeContext from 'src/contexts/mediathequeContext';
import type { Activity } from 'types/activity.type';

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

export default function MediaCard({ page }: { page: number }) {
  const { allFiltered } = useContext(MediathequeContext);

  const itemsPerPage = 6;

  const slicedData: ExtendedActivity[] = allFiltered ? allFiltered.slice(page, page + itemsPerPage) : [];

  const filledData = [
    ...slicedData,
    ...Array.from({ length: itemsPerPage - slicedData.length }).map((_, index) => ({ isEmpty: true, id: `empty-${index}` })),
  ];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
      {filledData.map((item, index) =>
        'content' in item ? (
          <Card key={index} sx={{ width: '30%', marginBottom: '20px', maxHeight: '400px', overflow: 'auto' }}>
            <CardMedia sx={{ height: 140 }} image={item.content[0].value} title="Media" />
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
        ) : (
          <Card key={item.id} sx={{ width: '30%', marginBottom: '20px', visibility: 'hidden' }} />
        ),
      )}
    </div>
  );
}
