import { Grid, Link } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import React from 'react';
import ReactPlayer from 'react-player';

import { useAllStandardGameByType } from 'src/api/game/game.getAllBySubtype';
import { useAbleToPlayStandardGame } from 'src/api/game/game.getAvailable';
import { primaryColor } from 'src/styles/variables.const';
import { GameType } from 'types/game.type';

// This mapping is used to create routes dynamically
const TYPE_OF_GAME = {
  [GameType.MIMIC]: 'mimique',
  [GameType.MONEY]: 'objet',
  [GameType.EXPRESSION]: 'expression',
};

type SubTypeProps = {
  subType: GameType;
  villageId: number | undefined;
};

const List = ({ subType, villageId }: SubTypeProps) => {
  const typeOfGame = TYPE_OF_GAME[subType];

  const { data: allGames } = useAllStandardGameByType(subType, villageId !== undefined ? villageId : 0);
  const { data: ableToPlay } = useAbleToPlayStandardGame(subType, villageId !== undefined ? villageId : 0);
  const idFromAbleToPlay: number[] = [];

  ableToPlay?.map((el: { id: number }) => {
    idFromAbleToPlay.push(el.id);
  });

  return (
    <>
      <Grid container spacing={2} style={{ padding: 5 }}>
        {allGames && allGames.length > 0 ? (
          allGames.map(
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
              <Grid item xs={12} sm={6} md={4} key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Card sx={{ maxWidth: 250, borderRadius: '20px' }}>
                  <ImageListItem>
                    <Link href={`/creer-un-jeu/${typeOfGame}/jouer/${item.id}`}>
                      {subType === 0 ? (
                        <div style={{ height: '250px', width: '250px' }}>
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
                          sx={{ height: '250px', width: '250px', objectFit: 'contain' }}
                        />
                      )}
                    </Link>
                  </ImageListItem>
                  <div className="test" style={{ display: 'flex', justifyItems: 'center', flexDirection: 'column', alignItems: 'center' }}>
                    <ImageListItemBar title={item.content.labelPresentation} position="below" />
                  </div>
                </Card>
                <Link href={`/creer-un-jeu/${typeOfGame}/jouer/${item.id}`}>
                  {idFromAbleToPlay.includes(item.id) ? (
                    <Button style={{ border: `1px solid ${primaryColor}`, width: 'auto', marginTop: '1em' }} size="small">
                      Jouer
                    </Button>
                  ) : (
                    <Button style={{ border: `1px solid ${primaryColor}`, width: 'auto', marginTop: '1em' }} size="small">
                      Rejouer
                    </Button>
                  )}
                </Link>
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
