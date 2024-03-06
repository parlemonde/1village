import React, { useContext } from 'react';

import { Grid, Link } from '@mui/material';
// import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

import { useAllStandardGameByType } from 'src/api/game/game.getAllBySubtype';
import { UserContext } from 'src/contexts/userContext';
import theme from 'src/styles/theme';
import { GameType } from 'types/game.type';

// This mapping is used to create routes dynamically
const TYPE_OF_GAME = {
  [GameType.MIMIC]: 'mimique',
  [GameType.MONEY]: 'objet',
  [GameType.EXPRESSION]: 'expression',
};

type SubTypeProps = {
  subType: GameType;
};
const List = ({ subType }: SubTypeProps) => {
  const { user } = useContext(UserContext);
  const typeOfGame = TYPE_OF_GAME[subType];

  const villageId = user?.villageId;
  const { data: allStandardGameByType } = useAllStandardGameByType(subType, villageId as number);
  console.log(allStandardGameByType);

  return (
    <>
      <Grid container spacing={2} style={{ overflowY: 'auto', maxHeight: '625px', padding: 5 }}>
        {allStandardGameByType &&
          allStandardGameByType.map(
            (
              item: {
                id: number;
                content: {
                  game: { inputs: { selectedValue: string | undefined }[] }[];
                  labelPresentation: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined;
                };
              },
              index: number,
            ) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ maxWidth: 250 }}>
                  <ImageListItem>
                    <Link href={`/creer-un-jeu/${typeOfGame}/jouer/${item.id}`}>
                      <CardMedia
                        component="img"
                        alt="Game Image"
                        image={item.content.game[0].inputs[0].selectedValue}
                        sx={{ width: theme.breakpoints.down('md') ? '100%' : '250px' }}
                      />
                    </Link>
                  </ImageListItem>
                  <div className="test" style={{ display: 'flex', justifyItems: 'center', flexDirection: 'column', alignItems: 'center' }}>
                    <ImageListItemBar title={item.content.labelPresentation} position="below" />
                    {/* Pour l'instant le bouton Jouer ne doit pas être utilisé */}
                    {/* <CardActions>
                    <Button size="small">Jouer</Button>
                    </CardActions> */}
                  </div>
                </Card>
              </Grid>
            ),
          )}
      </Grid>
    </>
  );
};
export default List;
