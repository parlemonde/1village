import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import type { LinearProgressProps } from '@mui/material/LinearProgress';
import { Button, FormControlLabel, Grid, Radio, RadioGroup, LinearProgress, Typography, Box } from '@mui/material';

import { AvatarImg } from 'src/components/Avatar';
import { Base } from 'src/components/Base';
import { Flag } from 'src/components/Flag';
import { Modal } from 'src/components/Modal';
import { UserDisplayName } from 'src/components/UserDisplayName';
import { VideoView } from 'src/components/activities/content/views/VideoView';
import { CustomRadio as GreenRadio } from 'src/components/buttons/CustomRadio';
import { CustomRadio as RedRadio } from 'src/components/buttons/CustomRadio';
import { useGameRequests } from 'src/services/useGames';
import { useVillageUsers } from 'src/services/useVillageUsers';
import PelicoNeutre from 'src/svg/pelico/pelico_neutre.svg';
import type { Game } from 'types/game.type';
import { GameType } from 'types/game.type';
import type { MimicData } from 'types/game.type';
import type { GameResponse } from 'types/gameResponse.type';
import { MimicResponseValue } from 'types/mimicResponse.type';
import { UserType } from 'types/user.type';

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

function shuffleArray(array: Array<number>) {
  let i = array.length - 1;
  for (; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

interface StatsProps {
  [key: string]: { [key: string]: number };
}

const PlayMimique = () => {
  const router = useRouter();
  const { users } = useVillageUsers();
  const { getRandomGame, sendNewGameResponse, getGameStats } = useGameRequests();

  const [game, setGame] = React.useState<Game | undefined>(undefined);
  const [tryCount, setTryCount] = React.useState<number>(0);
  const [found, setFound] = React.useState<boolean>(false);
  const [foundError, setFoundError] = React.useState<boolean>(false);
  const [fake1Selected, setFake1Selected] = React.useState<boolean>(false);
  const [fake2Selected, setFake2Selected] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<MimicResponseValue | null>(null);
  const [errorModalOpen, setErrorModalOpen] = React.useState<boolean>(false);
  const [lastMimiqueModalOpen, setLastMimiqueModalOpen] = React.useState<boolean>(false);
  const [loadingGame, setLoadingGame] = React.useState<boolean>(true);
  const [gameResponses, setGameResponses] = React.useState<GameResponse[]>([]);

  const getNextGame = React.useCallback(async () => {
    setLoadingGame(true);

    // [1] Reset game.
    setFound(false);
    setFoundError(false);
    setFake1Selected(false);
    setFake2Selected(false);
    setGameResponses([]);
    setSelected(null);
    setTryCount(0);
    setErrorModalOpen(false);

    // [2] Get next game data.
    const newGame = await getRandomGame(GameType.MIMIC);
    setGame(newGame);
    setLastMimiqueModalOpen(newGame === undefined);

    setLoadingGame(false);
  }, [getRandomGame]);

  // Get next game on start and on village change.
  React.useEffect(() => {
    getNextGame().catch();
  }, [getNextGame]);

  const userMap = React.useMemo(
    () =>
      users.reduce<{ [key: number]: number }>((acc, u, index) => {
        acc[u.id] = index;
        return acc;
      }, {}),
    [users],
  );
  const mimicContent = React.useMemo(() => {
    if (game === undefined) {
      return undefined;
    }
    try {
      return JSON.parse(game.content) as MimicData;
    } catch (e) {
      return undefined;
    }
  }, [game]);
  const gameCreator = React.useMemo(() => {
    if (game === undefined) {
      return undefined;
    }
    return userMap[game.userId] !== undefined ? users[userMap[game.userId]] : undefined;
  }, [game, userMap, users]);
  const gameCreatorIsPelico = gameCreator !== undefined && gameCreator.type >= UserType.OBSERVATOR;
  const ableToValidate = selected !== null;
  const choices = React.useMemo(() => game && shuffleArray([0, 1, 2]), [game]);

  const stats = React.useMemo(() => {
    // todo: get stats from responses.
  }, [gameResponses]);

  // React.useEffect(() => {
  //   if (gameResponses) {
  //     // console.log('2. gameResponses', gameResponses);
  //     const resStats: StatsProps = {};
  //     gameResponses.forEach((val: GameResponse) => {
  //       // connected user's id
  //       const classUserId = val.userId;
  //       setconnectedUserId(classUserId);
  //       console.log('1. classUserId', classUserId);
  //       // connected user's country
  //       const classUserIsoCode = val.user.country.isoCode;
  //       setconnectedUserIsoCode(classUserIsoCode);
  //       console.log('1. classUserIsoCode', classUserIsoCode);
  //       if (resStats[val.user.country.isoCode] && resStats[val.user.country.isoCode][val.user.id]) {
  //         resStats[val.user.country.isoCode].total = resStats[val.user.country.isoCode].total + 1;
  //         resStats[val.user.country.isoCode][val.value] = resStats[val.user.country.isoCode][val.value] + 1;
  //       } else {
  //         if (!resStats[val.user.country.isoCode]) {
  //           resStats[val.user.country.isoCode] = {
  //             total: 0,
  //           };
  //         }
  //         if (!resStats[val.user.country.isoCode][val.value]) {
  //           resStats[val.user.country.isoCode][val.value] = 1;
  //           resStats[val.user.country.isoCode].total = resStats[val.user.country.isoCode].total + 1;
  //         }
  //       }
  //     });
  //     setStats(resStats);
  //     // console.log('1. resStats', resStats);
  //     const resStatsCountries = Object.keys(resStats);
  //     console.log('1. resStatsCountries', resStatsCountries);
  //     // if the array contains only one country, the other country has not played the same game yet
  //     if (resStatsCountries.length === 1) {
  //       setFirstCountryToAnswer(true);
  //     } else {
  //       setFirstCountryToAnswer(false);
  //     }
  //   }
  // }, [firstCountryToAnswer, gameResponses, userMap]);

  const onValidate = async () => {
    if (selected === null || game === undefined) {
      return;
    }
    const success = await sendNewGameResponse(game.id, selected);
    if (!success) {
      // TODO: send notistack that an unknown error happened..
      return;
    }

    setFound(selected === MimicResponseValue.SIGNIFICATION);
    setFake1Selected(fake1Selected || selected === MimicResponseValue.FAKE_SIGNIFICATION_1);
    setFake2Selected(fake2Selected || selected === MimicResponseValue.FAKE_SIGNIFICATION_2);
    setSelected(null);
    setTryCount(tryCount + 1);
    if (selected === MimicResponseValue.SIGNIFICATION || tryCount === 1) {
      setFoundError(selected !== MimicResponseValue.SIGNIFICATION);
      setGameResponses(await getGameStats(game.id));
    }
  };

  const onChange = (event: { target: HTMLInputElement }) => {
    setSelected(event.target.value as MimicResponseValue);
  };

  if (loadingGame) {
    <Base></Base>;
  }

  if (!game || !gameCreator) {
    return (
      <Base>
        <Modal
          open={lastMimiqueModalOpen}
          title="Oups"
          cancelLabel="Retourner à l'accueil"
          maxWidth="lg"
          ariaDescribedBy="new-user-desc"
          ariaLabelledBy="new-user-title"
          onClose={() => router.push('/creer-un-jeu/mimique')}
        >
          C’était la dernière mimique disponible ! Dès que de nouvelles mimiques sont ajoutées, cela apparaîtra dans le fil d’activité.
        </Modal>
      </Base>
    );
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem', marginBottom: '3rem' }}>
        <h1>Que signifie cette mimique ?</h1>
        <div className="activity-card__header">
          <AvatarImg user={gameCreator} size="small" style={{ margin: '0.25rem 0rem 0.25rem 0.25rem' }} noLink={false} />
          <div className="activity-card__header_info">
            <p className="text" style={{ marginTop: '0.7rem' }}>
              {'Une mimique proposée par '}
              <UserDisplayName className="text" user={gameCreator} noLink={false} />
              {gameCreatorIsPelico ? (
                <PelicoNeutre style={{ marginLeft: '0.6rem', height: '16px', width: 'auto' }} />
              ) : (
                <Flag country={gameCreator.country.isoCode} size="small" style={{ marginLeft: '0.6rem' }} />
              )}
            </p>
          </div>
        </div>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            {mimicContent !== undefined && mimicContent.video !== null && <VideoView id={0} value={mimicContent.video}></VideoView>}
          </Grid>
          <Grid item xs={2} md={2}>
            <RadioGroup value={selected} onChange={onChange} style={{ marginTop: '1.6rem' }}>
              {choices &&
                choices.map((val) => {
                  if (val === 0) {
                    return (
                      <FormControlLabel
                        key="1"
                        value={MimicResponseValue.SIGNIFICATION}
                        control={found || foundError ? <GreenRadio isSuccess isChecked /> : <Radio />}
                        label={mimicContent?.signification || ''}
                        disabled={found || foundError ? true : false}
                        style={{ cursor: 'pointer' }}
                      />
                    );
                  } else if (val === 1) {
                    return (
                      <FormControlLabel
                        key="2"
                        value={MimicResponseValue.FAKE_SIGNIFICATION_1}
                        control={fake1Selected ? <RedRadio isChecked /> : <Radio />}
                        label={mimicContent?.fakeSignification1 || ''}
                        disabled={fake1Selected || found || foundError ? true : false}
                        style={{ cursor: 'pointer' }}
                      />
                    );
                  } else {
                    return (
                      <FormControlLabel
                        key="3"
                        value={MimicResponseValue.FAKE_SIGNIFICATION_2}
                        control={fake2Selected ? <RedRadio isChecked /> : <Radio />}
                        label={mimicContent?.fakeSignification2 || ''}
                        disabled={fake2Selected || found || foundError ? true : false}
                        style={{ cursor: 'pointer' }}
                      />
                    );
                  }
                })}
            </RadioGroup>
          </Grid>
          {/* {stats &&
            Object.keys(stats).map((country: string) => {
              return (
                <Grid item xs={5} md={5} key={country}>
                  <span style={{ paddingRight: '0.5rem' }}>Réponses de vos Pélicopains</span>
                  <Flag country={country} />
                  {choices?.map((val) => {
                    if (val === 0) {
                      return (
                        <LinearProgressWithLabel
                          key="1"
                          value={Math.round((stats[country]['0'] * 100) / stats[country]['total']) || 0}
                          style={{ height: '0.5rem', margin: '1.2rem 0' }}
                        />
                      );
                    } else if (val === 1) {
                      return (
                        <LinearProgressWithLabel
                          key="2"
                          value={Math.round((stats[country]['1'] * 100) / stats[country]['total']) || 0}
                          style={{ height: '0.5rem', margin: '1.2rem 0' }}
                        />
                      );
                    } else {
                      return (
                        <LinearProgressWithLabel
                          key="3"
                          value={Math.round((stats[country]['2'] * 100) / stats[country]['total']) || 0}
                          style={{ height: '0.5rem', margin: '1.2rem 0' }}
                        />
                      );
                    }
                  })}
                </Grid>
              );
            })}
          {/* Here, we check if the player is the first country of the "village-monde" who plays the mimic game.*/}
          {/* {stats && firstCountryToAnswer === true ? (
            Object.keys(stats).map((country: string) => {
              return (
                <Grid item xs={5} md={5} key={country}>
                  <span style={{ paddingRight: '0.5rem' }}>Pas de réponses des Pélicopains</span>
                  {/* First, we make sure the connected user is different from the user who has already played. 
                  Then check if they are from the same country. Based on the user's id, we display the correct flag. */}
          {/* {user.id === connectedUserId && user.country.isoCode === connectedUserIsoCode && <Flag country={connectedUserIsoCode} />} */}
          {/* {user.id !== connectedUserId && user.country.isoCode !== connectedUserIsoCode && <Flag country={user.country.isoCode} />}
                </Grid>
              );
            })
          ) : (
            <div></div>
          )} */}
          <Grid item xs={12} md={12}>
            {found && <p>C’est exact ! Vous avez trouvé la signification de cette mimique.</p>}
            {foundError && <p>Dommage ! Vous n’avez pas trouvé la bonne réponse cette fois-ci.</p>}
            {(found || foundError) && (
              <>
                <h2>Origine de cette mimique :</h2>
                <p>{mimicContent?.origine || ''}</p>
              </>
            )}
          </Grid>
        </Grid>
        <Modal
          open={errorModalOpen}
          title="Oups"
          cancelLabel="Réessayer"
          maxWidth="lg"
          ariaDescribedBy="new-user-desc"
          ariaLabelledBy="new-user-title"
          onClose={() => setErrorModalOpen(false)}
        >
          Dommage ! Ce n’est pas cette réponse. Essayez encore !
        </Modal>
        <Modal
          open={lastMimiqueModalOpen}
          title="Oups"
          cancelLabel="Retourner à l'accueil"
          maxWidth="lg"
          ariaDescribedBy="new-user-desc"
          ariaLabelledBy="new-user-title"
          onClose={() => router.push('/creer-un-jeu/mimique')}
        >
          C’était la dernière mimique disponible ! Dès que de nouvelles mimiques sont ajoutées, cela apparaîtra dans le fil d’activité.
        </Modal>
        {!found && !foundError && (
          <Button
            style={{
              float: 'right',
            }}
            variant="outlined"
            color="primary"
            onClick={onValidate}
            disabled={!ableToValidate}
          >
            Valider
          </Button>
        )}
        <div>
          {(found || foundError) && (
            <div>
              <p
                style={{
                  float: 'right',
                  margin: '0.5rem 1rem',
                  textDecorationLine: 'underline',
                }}
              >
                <Link href="/" passHref>
                  {"Ou revenir à l'accueil"}
                </Link>
              </p>
              <Button
                style={{
                  float: 'right',
                }}
                variant="outlined"
                color="primary"
                onClick={() => {
                  getNextGame();
                }}
              >
                Rejouer
              </Button>
            </div>
          )}
        </div>
      </div>
    </Base>
  );
};

export default PlayMimique;
