import React, { useContext } from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import MediathequeContext from 'src/contexts/mediathequeContext';

export default function MediaCard({ page }) {
  const { allFiltered } = useContext(MediathequeContext);

  console.log('page depuis media', page);

  const slicedData = allFiltered?.slice(page, page + 6); // Slice data based on current page and page size

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {allFiltered && allFiltered.length > 0
          ? slicedData.map((item, index) => (
              <Card key={index} sx={{ width: '30%', marginBottom: '20px' }}>
                {/* Utilisation de la première image du tableau medias */}
                <CardMedia sx={{ height: 140 }} image={item.medias[0].value} title="Media" />
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
