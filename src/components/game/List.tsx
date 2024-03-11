import React from 'react';
import ReactPlayer from 'react-player';

import { Grid, Link } from '@mui/material';
// import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

import { useAllStandardGameByType } from 'src/api/game/game.getAllBySubtype';
import theme from 'src/styles/theme';
import { GameType } from 'types/game.type';

// This mapping is used to create routes dynamically
const TYPE_OF_GAME = {
  [GameType.MIMIC]: 'mimiques',
  [GameType.MONEY]: 'objet',
  [GameType.EXPRESSION]: 'expression',
};

type SubTypeProps = {
  subType: GameType;
  villageId: number | undefined;
};

const List = ({ subType, villageId }: SubTypeProps) => {
  const typeOfGame = TYPE_OF_GAME[subType];

  const { data: allStandardGameByType } = useAllStandardGameByType(subType, villageId !== undefined ? villageId : 0);

  return (
    <>
      <Grid container spacing={2} style={{ overflowY: 'auto', maxHeight: '650px', padding: 5 }}>
        {allStandardGameByType && allStandardGameByType.length > 0 ? (
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
                      {subType === 0 ? (
                        <div style={{ height: '250px', width: 'auto' }}>
                          <ReactPlayer
                            width="100%"
                            height="100%"
                            light
                            url={item.content.game[0].inputs[0].selectedValue}
                            style={{ backgroundColor: 'black' }}
                          />
                        </div>
                      ) : (
                        <CardMedia
                          component="img"
                          alt="Game Image"
                          image={item.content.game[0].inputs[0].selectedValue}
                          sx={{ width: theme.breakpoints.down('md') ? '100%' : '250px' }}
                        />
                      )}
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
          )
        ) : (
          <div style={{ margin: 'auto' }}>Oups, on dirait qu&apos;il n&apos;y a aucun jeu pour le moment.</div>
        )}
      </Grid>
    </>
  );
};
export default List;
