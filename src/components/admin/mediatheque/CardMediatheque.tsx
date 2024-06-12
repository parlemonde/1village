import React, { useContext } from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import { activityNameMapper } from 'src/config/mediatheque/dataFilters';
import MediathequeContext from 'src/contexts/mediathequeContext';

export default function MediaCard({ page }: { page: number }) {
  const { allFiltered } = useContext(MediathequeContext);

  // Définir le nombre d'éléments par page
  const itemsPerPage = 6;

  // Découper les données en groupes de 6 cartes maximum
  const slicedData = allFiltered ? allFiltered.slice(page, page + itemsPerPage) : [];

  // Remplir les cartes manquantes avec des cartes vides
  const filledData = [
    ...slicedData,
    ...Array.from({ length: itemsPerPage - slicedData.length }).map((_, index) => ({ isEmpty: true, id: `empty-${index}` })),
  ];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
      {filledData.map((item, index) =>
        item.isEmpty ? (
          <Card key={item.id} sx={{ width: '30%', marginBottom: '20px', visibility: 'hidden' }} />
        ) : (
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
            </CardContent>
          </Card>
        ),
      )}
    </div>
  );
}
