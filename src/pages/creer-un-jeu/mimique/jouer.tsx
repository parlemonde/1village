import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState, useCallback, useMemo, useContext, useEffect } from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AppsIcon from '@mui/icons-material/Apps';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { Box, Button, FormControlLabel, Grid, Radio, RadioGroup } from '@mui/material';

import { AvatarImg } from 'src/components/Avatar';
import { Base } from 'src/components/Base';
import { Flag } from 'src/components/Flag';
import { Modal } from 'src/components/Modal';
import { UserDisplayName } from 'src/components/UserDisplayName';
import { RightNavigation } from 'src/components/accueil/RightNavigation';
import { MimicStats } from 'src/components/activities/MimicStats';
import { VideoView } from 'src/components/activities/content/views/VideoView';
import { CustomRadio as GreenRadio, CustomRadio as RedRadio, CustomRadioProps } from 'src/components/buttons/CustomRadio';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { useGameRequests } from 'src/services/useGames';
import { useVillageUsers } from 'src/services/useVillageUsers';
import { primaryColor } from 'src/styles/variables.const';
import PelicoNeutre from 'src/svg/pelico/pelico_neutre.svg';
import { GameType } from 'types/game.type';
import type { Game, MimicData } from 'types/game.type';
import type { GameResponse } from 'types/gameResponse.type';
import { MimicResponseValue } from 'types/mimicResponse.type';
import { UserType, User } from 'types/user.type';
import { ActivityComments } from 'src/components/activities/ActivityComments';
import { Activity } from 'types/activity.type';

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

type AlreadyPlayerModalProps = {
  isOpen: boolean;
};

type PlayMimicState = {
  lastPlayedMimic: MimicData | null;
};

const AlreadyPlayerModal: React.FC<AlreadyPlayerModalProps> = ({ isOpen }) => {
  const router = useRouter();
  return (
    <Modal
      open={isOpen}
      title="Oups"
      cancelLabel="Retourner à l'accueil"
      maxWidth="lg"
      ariaDescribedBy="new-user-desc"
      ariaLabelledBy="new-user-title"
      onClose={() => router.push('/creer-un-jeu/mimique')}
    >
      C’était la dernière mimique disponible ! Dès que de nouvelles mimiques sont ajoutées, cela apparaîtra dans le fil d’activité.
      <Button color="primary" onClick={() => router.push('/creer-un-jeu/mimique/jouer')}>
        Rejouer
      </Button>
    </Modal>
  );
};

type ResponseButtonProps = {
  value: MimicResponseValue;
  isSuccess?: boolean;
  isGreenRadio?: boolean;
  isColoredRadio: boolean;
  signification?: string | null;
  onClick: () => void;
};
const ResponseButton = ({ value, onClick, isColoredRadio, isGreenRadio = false, isSuccess = false, signification = '' }: ResponseButtonProps) => {
  const RadioComponent = isGreenRadio ? GreenRadio : RedRadio;
  return (
    <Box onClick={onClick} sx={{ p: 2, mb: 2, border: '1px solid #cdcdcd', borderRadius: '16px' }}>
      <FormControlLabel
        value={value}
        control={isColoredRadio ? <RadioComponent isSuccess={isSuccess} isChecked /> : <Radio />}
        label={signification}
        disabled={isColoredRadio}
        style={{ cursor: 'pointer', maxWidth: '100%' }}
      />
    </Box>
  );
};
const PlayMimique = () => {
  const { user } = useContext(UserContext);
  const { village } = useContext(VillageContext);
  const { users } = useVillageUsers();
  const { getRandomGame, sendNewGameResponse, getGameStats } = useGameRequests();

  const [game, setGame] = useState<Game | undefined>(undefined);
  const [tryCount, setTryCount] = useState<number>(0);
  const [found, setFound] = useState<boolean>(false);
  const [foundError, setFoundError] = useState<boolean>(false);
  const [fake1Selected, setFake1Selected] = useState<boolean>(false);
  const [fake2Selected, setFake2Selected] = useState<boolean>(false);
  const [selected, setSelected] = useState<MimicResponseValue | null>(null);
  const [errorModalOpen, setErrorModalOpen] = useState<boolean>(false);
  const [isLastMimiqueModalOpen, setIsLastMimiqueModalOpen] = useState<boolean>(false);
  const [loadingGame, setLoadingGame] = useState<boolean>(true);
  const [gameResponses, setGameResponses] = useState<GameResponse[]>([]);
  const [previousMimic, setPreviousMimic] = useState<MimicData | null>(null);
  const [activityComment, setActivityComment] = useState<Activity | null>(null);

  const getLastMimicPlayed = (): PlayMimicState => {
    console.log('previous mimic : ', previousMimic);
    const lastPlayedMimic = previousMimic ?? null;
    return { lastPlayedMimic };
  };
  const getNextGame = useCallback(async () => {
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
    setIsLastMimiqueModalOpen(newGame === undefined);

    if (previousMimic !== null) {
      setPreviousMimic(previousMimic);
    }
    setLoadingGame(false);
  }, [getRandomGame, previousMimic]);

  // Get next game on start and on village change.
  useEffect(() => {
    getNextGame().catch();
  }, [getNextGame]);

  const userMap = useMemo(
    () =>
      users.reduce<{ [key: number]: number }>((acc, u, index) => {
        acc[u.id] = index;
        return acc;
      }, {}),
    [users],
  );
  const mimicContent = useMemo(() => {
    if (game === undefined) {
      return undefined;
    }
    try {
      const { id, origine, fakeSignification1, fakeSignification2, signification, video } = game;
      const content: MimicData = { gameId: id, createDate: new Date(), origine, fakeSignification1, fakeSignification2, signification, video };
      return content;
    } catch (e) {
      return undefined;
    }
  }, [game]);

  const ResponseButtonDataMapper = useMemo(
    () => [
      {
        value: MimicResponseValue.SIGNIFICATION,
        signification: mimicContent?.signification,
        isSuccess: true,
        isColoredRadio: found || foundError,
        isGreenRadio: true,
      },
      {
        value: MimicResponseValue.FAKE_SIGNIFICATION_1,
        signification: mimicContent?.fakeSignification1,
        isColoredRadio: fake1Selected,
      },
      {
        value: MimicResponseValue.FAKE_SIGNIFICATION_2,
        signification: mimicContent?.fakeSignification2,
        isColoredRadio: fake2Selected,
      },
    ],
    [mimicContent, found, foundError, fake1Selected, fake2Selected],
  );

  const gameCreator = useMemo(() => {
    if (game === undefined) {
      return undefined;
    }
    return userMap[game.userId] !== undefined ? users[userMap[game.userId]] : undefined;
  }, [game, userMap, users]);

  const gameCreatorIsPelico = gameCreator !== undefined && gameCreator.type >= UserType.OBSERVATOR;
  const userIsPelico = user !== null && user.type >= UserType.OBSERVATOR;
  const ableToValidate = selected !== null;
  const choices = useMemo(() => (game !== undefined ? shuffleArray([0, 1, 2]) : [0, 1, 2]), [game]);

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
        <AlreadyPlayerModal isOpen={isLastMimiqueModalOpen} />
      </Base>
    );
  }

  return (
    // TODO : replace true by activity.displayUser when activiy problem is resolve
    <Base rightNav={<RightNavigation activityUser={gameCreator} displayAsUser={false} />} hideLeftNav showSubHeader>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem', marginBottom: '3rem' }}>
        <Box display="flex" flexDirection="column">
          <Box alignItems="flex-start">
            <h1>Jouer au jeu des mimiques !</h1>
            <p style={{ marginBottom: 0 }}>A vous de décider avec quelle mimique vous allez jouer !</p>
            <p style={{ marginTop: 0 }}>
              Vous pouvez choisir comment les faire défiler ou les afficher, par défaut vous visualisez la dernière mimique publiée.
            </p>
          </Box>
          <div className="activity-card__header">
            <AvatarImg user={gameCreator} size="small" style={{ margin: '0.25rem 0rem 0.25rem 0.25rem' }} noLink={false} />
            <div
              className="activity-card__header_info"
              style={{ display: 'block,', justifyContent: 'center', alignItems: 'center', paddingBottom: '1rem' }}
            >
              <h3 className="text" style={{ marginTop: '0.7rem' }}>
                {'Une mimique proposée par '}
                <UserDisplayName className="text" user={gameCreator} noLink={false} />
              </h3>
              {mimicContent && mimicContent.createDate && (
                <p style={{ fontSize: '0.8rem', color: 'gray' }}>
                  {'publié le '}
                  {new Date(mimicContent.createDate).toLocaleDateString()}
                  {gameCreatorIsPelico ? (
                    <PelicoNeutre style={{ marginLeft: '0.6rem', height: '16px', width: 'auto' }} />
                  ) : (
                    <Flag country={gameCreator.country.isoCode} size="small" style={{ marginLeft: '0.6rem' }} />
                  )}
                </p>
              )}
            </div>
          </div>
          {/* <Grid container spacing={1} alignItems="flex-end" justifyItems="flex-end" justifyContent="space-between" style={{ flex: 1 }}> */}
          <Grid container spacing={1} alignItems="flex-start" justifyContent="space-between" style={{ flex: 1 }}>
            <Grid item xs={3} display="flex" justifyContent="flex-start">
              <Button variant="outlined" color="primary" onClick={getLastMimicPlayed} disabled={!ableToValidate}>
                mimique précédente
              </Button>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="center">
              <RadioGroup row>
                <FormControlLabel
                  sx={{ ml: 1 }}
                  value="nouvelle"
                  control={<Radio sx={{ py: 0 }} />}
                  label={
                    <>
                      <AccessTimeIcon sx={{ fontSize: 16, verticalAlign: 'middle', ml: 0.5 }} /> Nouvelle
                    </>
                  }
                  labelPlacement="end"
                />
                <FormControlLabel
                  sx={{ ml: 1 }}
                  value="aleatoire"
                  control={<Radio sx={{ py: 0 }} />}
                  label={
                    <>
                      <ShuffleIcon sx={{ fontSize: 16, verticalAlign: 'middle', ml: 0.5 }} /> Aléatoire
                    </>
                  }
                  labelPlacement="end"
                />
                <FormControlLabel
                  sx={{ ml: 1 }}
                  value="mosaique"
                  control={<Radio sx={{ py: 0 }} />}
                  label={
                    <>
                      <AppsIcon sx={{ fontSize: 16, verticalAlign: 'middle', ml: 0.5 }} /> Mosaïque
                    </>
                  }
                  labelPlacement="end"
                />
              </RadioGroup>
            </Grid>
            <Grid item xs={3} display="flex" justifyContent="flex-end">
              <Button variant="outlined" color="primary" onClick={getNextGame}>
                mimique suivante
              </Button>
            </Grid>
          </Grid>
          <Box border={1} borderColor={primaryColor} p={1} my={1} boxSizing="border-box" style={{ flex: 1 }}>
            <Grid container spacing={3} alignItems="flex-start" justifyContent="flex-start">
              <Grid item xs={12} md={12}>
                {mimicContent !== undefined && mimicContent.video !== null && <VideoView id={0} value={mimicContent.video}></VideoView>}
              </Grid>
              <Grid container spacing={0} p={2} m={4}>
                <h1>Que signifie cette mimique ?</h1>
              </Grid>
              <Grid container spacing={0} p={2} m={4}>
                <RadioGroup value={selected} onChange={onChange} style={{ marginTop: '1.6rem' }}>
                  {choices &&
                    choices.map((val) => {
                      const { value, isSuccess, signification, isGreenRadio, isColoredRadio } = ResponseButtonDataMapper[val];
                      return (
                        <ResponseButton
                          key={val}
                          value={value}
                          onClick={onValidate}
                          isSuccess={isSuccess}
                          isColoredRadio={isColoredRadio}
                          signification={signification}
                          isGreenRadio={isGreenRadio}
                        />
                      );
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
                      userIsPelico
                        ? village.countries[1].isoCode
                        : village.countries.map((c) => c.isoCode).find((i) => i !== user.country.isoCode) || ''
                    }
                    userMap={userMap}
                    users={users}
                  />
                </>
              )}
              <Grid item xs={12} md={12}>
                {found && <p>C’est exact ! Vous avez trouvé la signification de cette mimique.</p>}
                {(found || foundError) && (
                  <>
                    <h2>Origine de cette mimique :</h2>
                    <p>{mimicContent?.origine || ''}</p>
                  </>
                )}
              </Grid>
            </Grid>
          </Box>
          <Box>{/* <ActivityComments activity={activityComment} usersMap={{}} /> */}</Box>
        </Box>
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
        <AlreadyPlayerModal isOpen={isLastMimiqueModalOpen} />
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
