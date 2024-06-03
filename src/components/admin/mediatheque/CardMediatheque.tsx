import React, { useContext } from 'react';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import MediathequeContext from 'src/contexts/mediathequeContext';

export default function MediaCard() {
  const { filtered } = useContext(MediathequeContext);
  const { allFiltered } = useContext(MediathequeContext);
  console.log('filtered');

  console.log(filtered);
  console.log('allFiltered');

  console.log(allFiltered);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
      {filtered && filtered.length > 0 ? (
        filtered.map((item, index) => (
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
            <CardActions>
              <Button size="small">En savoir plus</Button>
            </CardActions>
          </Card>
        ))
      ) : (
        <p>Aucun média disponible</p>
      )}
    </div>
  );
}
