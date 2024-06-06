import React, { useContext } from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import MediathequeContext from 'src/contexts/mediathequeContext';

export default function MediaCard({ page }: { page: number }) {
  const { allFiltered } = useContext(MediathequeContext);

  const slicedData = allFiltered?.slice(page, page + 6);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {allFiltered && allFiltered.length > 0
          ? slicedData.map((item, index) => (
              <Card key={index} sx={{ width: '30%', marginBottom: '20px' }}>
                <CardMedia sx={{ height: 140 }} image={item.content[0].value} title="Media" />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Media {item.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Type: {item.type}, Subtype: {item.subType}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    User ID: {item.userId}, Village ID: {item.villageId}
                  </Typography>
                </CardContent>
              </Card>
            ))
          : null}
      </div>
    </div>
  );
}
