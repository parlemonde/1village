import React, { useContext } from 'react';

import { Grid, Link } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

import { useAllStandardGameByType } from 'src/api/game/game.getAllBySubtype';
import { UserContext } from 'src/contexts/userContext';
import theme from 'src/styles/theme';
import type { GameType } from 'types/game.type';

type SubTypeProps = {
  subType: GameType;
};
const List = ({ subType }: SubTypeProps) => {
  const { user } = useContext(UserContext);

  const villageId = user?.villageId;
  const { data: allStandardGameByType } = useAllStandardGameByType(subType, villageId as number);
  console.log(allStandardGameByType);

  return (
    <>
      <Grid container spacing={2}>
        {allStandardGameByType &&
          allStandardGameByType.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ maxWidth: 345 }}>
                <ImageListItem>
                  <CardMedia
                    component="img"
                    alt="Game Image" // Set appropriate alt text
                    // Use theme for responsive image width calculation
                    // Consider using `layout="fill"` for `CardMedia` if needed
                    image={item.content.game[0].inputs[0].selectedValue}
                    sx={{ width: theme.breakpoints.down('md') ? '100%' : '345px' }} // Responsive width
                  />
                </ImageListItem>
                <div className="test" style={{ display: 'flex', justifyItems: 'center', flexDirection: 'column', alignItems: 'center' }}>
                  <ImageListItemBar title={item.content.labelPresentation} position="below" />

                  <CardActions>
                    <Link href={`/creer-un-jeu/expression/jouer/${item.id}`}>
                      <Button size="small">Jouer</Button>
                    </Link>
                  </CardActions>
                </div>
              </Card>
            </Grid>
          ))}
      </Grid>
    </>
  );
};
export default List;
