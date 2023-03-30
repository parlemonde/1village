import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { Box, Button, FormControlLabel, Grid, Radio, RadioGroup } from '@mui/material';

import { AvatarImg } from 'src/components/Avatar';
import { Base } from 'src/components/Base';
import { Flag } from 'src/components/Flag';
import { Modal } from 'src/components/Modal';
import { UserDisplayName } from 'src/components/UserDisplayName';
import { MimicStats } from 'src/components/activities/MimicStats';
import { VideoView } from 'src/components/activities/content/views/VideoView';
import { CustomRadio as GreenRadio, CustomRadio as RedRadio } from 'src/components/buttons/CustomRadio';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { useGameRequests } from 'src/services/useGames';
import { useVillageUsers } from 'src/services/useVillageUsers';
import PelicoNeutre from 'src/svg/pelico/pelico_neutre.svg';
import { GameType } from 'types/game.type';
import type { Game, MimicData } from 'types/game.type';
import type { GameResponse } from 'types/gameResponse.type';
import { MimicResponseValue } from 'types/mimicResponse.type';
import { UserType } from 'types/user.type';

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

const PlayMimique = () => {
  const router = useRouter();
  const { user } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);
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
      const { id, origine, fakeSignification1, fakeSignification2, signification, video } = game;
      const content: MimicData = { gameId: id, origine, fakeSignification1, fakeSignification2, signification, video };
      return content;
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
  const userIsPelico = user !== null && user.type >= UserType.OBSERVATOR;
  const ableToValidate = selected !== null;
  const choices = React.useMemo(() => (game !== undefined ? shuffleArray([0, 1, 2]) : [0, 1, 2]), [game]);

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
    setErrorModalOpen(selected !== MimicResponseValue.SIGNIFICATION);
    setTryCount(tryCount + 1);
    if (selected === MimicResponseValue.SIGNIFICATION || tryCount === 1) {
      setFoundError(selected !== MimicResponseValue.SIGNIFICATION);
      setGameResponses(await getGameStats(game.id));
    }
  };

  const onChange = (event: { target: HTMLInputElement }) => {
    setSelected(event.target.value as MimicResponseValue);
  };

  if (user === null || village === null || loadingGame) {
    return <Base></Base>;
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
          <Grid xs={2} md={4}>
            <RadioGroup value={selected} onChange={onChange} style={{ marginTop: '1.6rem' }}>
              {choices &&
                choices.map((val) => {
                  if (val === 0) {
                    return (
                      <Box sx={{ p: 2, mb: 2, border: '1px solid #cdcdcd', borderRadius: '4px' }}>
                        <FormControlLabel
                          key="1"
                          value={MimicResponseValue.SIGNIFICATION}
                          control={found || foundError ? <GreenRadio isSuccess isChecked /> : <Radio />}
                          label={mimicContent?.signification || ''}
                          disabled={found || foundError ? true : false}
                          style={{ cursor: 'pointer', width: '100%' }}
                        />
                      </Box>
                    );
                  } else if (val === 1) {
                    return (
                      <Box sx={{ p: 2, mb: 2, border: '1px solid #cdcdcd', borderRadius: '4px' }}>
                        <FormControlLabel
                          key="2"
                          value={MimicResponseValue.FAKE_SIGNIFICATION_1}
                          control={fake1Selected ? <RedRadio isChecked /> : <Radio />}
                          label={mimicContent?.fakeSignification1 || ''}
                          disabled={fake1Selected || found || foundError ? true : false}
                          style={{ cursor: 'pointer', width: '100%' }}
                        />
                      </Box>
                    );
                  } else {
                    return (
                      <Box sx={{ p: 2, mb: 2, border: '1px solid #cdcdcd', borderRadius: '4px' }}>
                        <FormControlLabel
                          key="3"
                          value={MimicResponseValue.FAKE_SIGNIFICATION_2}
                          control={fake2Selected ? <RedRadio isChecked /> : <Radio />}
                          label={mimicContent?.fakeSignification2 || ''}
                          disabled={fake2Selected || found || foundError ? true : false}
                          style={{ cursor: 'pointer', width: '100%' }}
                        />
                      </Box>
                    );
                  }
                })}
            </RadioGroup>
          </Grid>

          {(found || foundError) && (
            <>
              <MimicStats
                gameResponses={gameResponses}
                choices={choices}
                country={userIsPelico ? village.countries[0].isoCode : user.country.isoCode}
                userMap={userMap}
                users={users}
              />

              <MimicStats
                gameResponses={gameResponses}
                choices={choices}
                country={
                  userIsPelico ? village.countries[1].isoCode : village.countries.map((c) => c.isoCode).find((i) => i !== user.country.isoCode) || ''
                }
                userMap={userMap}
                users={users}
              />
            </>
          )}
          <Grid item xs={12} md={12}>
            {found && <p>C’est exact ! Vous avez trouvé la signification de cette mimique.</p>}
            {/* {foundError && <p>Dommage ! Vous n’avez pas trouvé la bonne réponse cette fois-ci.</p>} */}
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
          cancelLabel={foundError ? 'Fermer' : 'Réessayer'}
          maxWidth="lg"
          ariaDescribedBy="new-user-desc"
          ariaLabelledBy="new-user-title"
          onClose={() => setErrorModalOpen(false)}
        >
          {foundError ? (
            <p>Dommage ! Vous n’avez pas trouvé la bonne réponse cette fois-ci.</p>
          ) : (
            <p>Dommage ! Ce n’est pas cette réponse. Essayez encore !</p>
          )}
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
