import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState, useCallback, useMemo, useContext, useEffect } from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AppsIcon from '@mui/icons-material/Apps';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import type { SvgIconTypeMap } from '@mui/material';
import { Box, Button, FormControlLabel, Grid, Radio, RadioGroup } from '@mui/material';
import type { OverridableComponent } from '@mui/material/OverridableComponent';

import { AvatarImg } from 'src/components/Avatar';
import { Base } from 'src/components/Base';
import { Flag } from 'src/components/Flag';
import { Modal } from 'src/components/Modal';
import { UserDisplayName } from 'src/components/UserDisplayName';
import { RightNavigation } from 'src/components/accueil/RightNavigation';
import GameStats from 'src/components/activities/GameStats';
import { VideoView } from 'src/components/activities/content/views/VideoView';
import ResponseButton from 'src/components/buttons/GameResponseButton';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { useGameRequests } from 'src/services/useGames';
import { useVillageUsers } from 'src/services/useVillageUsers';
import { primaryColor } from 'src/styles/variables.const';
import PelicoNeutre from 'src/svg/pelico/pelico_neutre.svg';
import { GameType } from 'types/game.type';
import type { Game, MimicData } from 'types/game.type';
import type { GameResponse } from 'types/gameResponse.type';
import { GameResponseValue } from 'types/gameResponse.type';
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

/* partie à déplacer et à centraliser avec les prochains jeux*/
type AlreadyPlayerModalProps = {
  isOpen: boolean;
  gameId: number;
  handleSuccessClick: () => void;
};

enum RadioBoxValues {
  NEW = 'Nouvelle',
  RANDOM = 'Aléatoire',
  MOSAIC = 'Mosaïque',
}

type RadioNextGameProps = {
  value: RadioBoxValues;
  Icon: OverridableComponent<SvgIconTypeMap<unknown, 'svg'>> & {
    muiName: string;
  };
  onChange: (event: React.SyntheticEvent) => void;
  checked: boolean;
};

const radioListComponentMapper = {
  [RadioBoxValues.NEW]: AccessTimeIcon,
  [RadioBoxValues.RANDOM]: ShuffleIcon,
  [RadioBoxValues.MOSAIC]: AppsIcon,
};

const RadioNextGame: React.FC<RadioNextGameProps> = ({ value, Icon, onChange, checked }) => (
  <FormControlLabel
    sx={{ ml: 1 }}
    value={value}
    control={<Radio sx={{ py: 0 }} />}
    label={
      <>
        <Icon sx={{ fontSize: 16, verticalAlign: 'middle', ml: 0.5 }} /> {value}
      </>
    }
    labelPlacement="end"
    checked={checked}
    onChange={onChange}
  />
);

const AlreadyPlayerModal: React.FC<AlreadyPlayerModalProps> = ({ isOpen, handleSuccessClick }) => {
  const router = useRouter();

  return (
    <Modal
      open={isOpen}
      title="Oups"
      cancelLabel="Retourner à l'accueil"
      confirmLabel="Rejouer"
      maxWidth="lg"
      ariaDescribedBy="new-user-desc"
      ariaLabelledBy="new-user-title"
      onClose={() => router.push('/')}
      onConfirm={handleSuccessClick}
    >
      C’était la dernière mimique disponible ! Dès que de nouvelles mimiques sont ajoutées, cela apparaîtra dans le fil d’activité.
    </Modal>
  );
};
/* FIN partie à déplacer et à centraliser avec les prochains jeux*/

const PlayMimic = () => {
  const { user } = useContext(UserContext);
  const { village } = useContext(VillageContext);
  const { users } = useVillageUsers();
  const { getRandomGame, sendNewGameResponse, getGameStats, getAvailableGames, resetGamesPlayedForUser } = useGameRequests();

  const [game, setGame] = useState<Game | undefined>(undefined);
  const [tryCount, setTryCount] = useState<number>(0);
  const [found, setFound] = useState<boolean>(false);
  const [errorModalOpen, setErrorModalOpen] = useState<boolean>(false);
  const [isLastMimicModalOpen, setIsLastMimicModalOpen] = useState<boolean>(false);
  const [loadingGame, setLoadingGame] = useState<boolean>(true);
  const [gameResponses, setGameResponses] = useState<GameResponse[]>([]);
  const [selectedValue, setSelectedValue] = useState(RadioBoxValues.NEW);
  const router = useRouter();

  const handleConfirmModal = async () => {
    const success = await resetGamesPlayedForUser();
    setIsLastMimicModalOpen(false);

    if (success) {
      router.reload();
    } else {
      router.push('/');
    }
  };

  const sortGamesByDescOrder = (games: Game[]) => {
    return games.sort((a, b) => {
      const dateA = a.createDate ? new Date(a.createDate).getTime() : 0;
      const dateB = b.createDate ? new Date(b.createDate).getTime() : 0;
      return dateB - dateA;
    });
  };

  const getNextGame = useCallback(async () => {
    setLoadingGame(true);

    // [1] Reset game.
    setFound(false);
    setGameResponses([]);
    setTryCount(0);
    setErrorModalOpen(false);

    const availableGames = await getAvailableGames(GameType.MIMIC);
    const availableGamesByDescOrder = sortGamesByDescOrder(availableGames);

    const currentGameIndex = availableGamesByDescOrder.findIndex((g) => g.id === game?.id);

    const isLastGame = currentGameIndex === availableGamesByDescOrder.length - 1;

    const NEXT_GAME_MAPPER = {
      [RadioBoxValues.NEW]: () => availableGamesByDescOrder[currentGameIndex + 1],
      [RadioBoxValues.RANDOM]: async () => {
        return await getRandomGame(GameType.MIMIC);
      },
      [RadioBoxValues.MOSAIC]: () => {
        console.error('Not implemented yet');
        return undefined;
      },
    };

    const nextGame = isLastGame ? undefined : await NEXT_GAME_MAPPER[selectedValue]();

    setGame(nextGame);
    if (isLastGame) {
      setIsLastMimicModalOpen(isLastGame);
    }

    setLoadingGame(false);
  }, [getRandomGame, selectedValue, game, getAvailableGames]);

  // Get next game on start and on village change.
  useEffect(() => {
    const getFirstGame = async () => {
      try {
        const availableGames = await getAvailableGames(GameType.MIMIC);
        if (availableGames.length === 0) {
          setIsLastMimicModalOpen(true);
        }
        const availableGamesByDescOrder = sortGamesByDescOrder(availableGames);
        setGame(availableGamesByDescOrder[0]); // Utiliser le dernier jeu (plus récent)
        setLoadingGame(false);
      } catch (error) {
        console.error('Error fetching or processing available games:', error);
        setLoadingGame(false); // Assurez-vous de gérer les erreurs correctement
      }
    };
    getFirstGame().catch();
  }, [getAvailableGames]);

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
        value: GameResponseValue.SIGNIFICATION,
        signification: mimicContent?.signification,
        isSuccess: true,
        isGreenRadio: true,
      },
      {
        value: GameResponseValue.FAKE_SIGNIFICATION_1,
        signification: mimicContent?.fakeSignification1,
      },
      {
        value: GameResponseValue.FAKE_SIGNIFICATION_2,
        signification: mimicContent?.fakeSignification2,
      },
    ],
    [mimicContent],
  );

  const gameCreator = useMemo(() => {
    if (game === undefined) {
      return undefined;
    }
    return userMap[game.userId] !== undefined ? users[userMap[game.userId]] : undefined;
  }, [game, userMap, users]);
  const gameCreatorIsPelico = gameCreator !== undefined && gameCreator.type <= UserType.MEDIATOR;
  const userIsPelico = user !== null && user.type <= UserType.MEDIATOR;
  const choices = React.useMemo(() => (game !== undefined ? shuffleArray([0, 1, 2]) : [0, 1, 2]), [game]);

  const handleRadioButtonChange = (event: React.SyntheticEvent) => {
    const selected = (event as React.ChangeEvent<HTMLInputElement>).target.value;
    setSelectedValue(selected as RadioBoxValues);
  };

  const handleClick = useCallback(
    async (selection: GameResponseValue, isSuccess: boolean = false) => {
      if (game === undefined) {
        return;
      }
      const apiResponse = await sendNewGameResponse(game.id, selection);
      if (!apiResponse) {
        console.error('Error reaching server');
        return;
      }

      setFound(isSuccess);
      setErrorModalOpen(!isSuccess);
      if (isSuccess || tryCount === 1) {
        setGameResponses(await getGameStats(game.id));
      }
      setTryCount(tryCount + 1);
    },
    [getGameStats, sendNewGameResponse, setFound, setErrorModalOpen, setGameResponses, setTryCount, tryCount, game],
  );

  if (user === null || village === null || loadingGame) {
    return <Base></Base>;
  }

  // Modal dernière mimique
  if (!game || !gameCreator) {
    return (
      <Base>
        <AlreadyPlayerModal handleSuccessClick={handleConfirmModal} isOpen={isLastMimicModalOpen} gameId={game?.id || 0} />
      </Base>
    );
  }

  return (
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
                    gameCreator && gameCreator.country && <Flag country={gameCreator.country.isoCode} size="small" style={{ marginLeft: '0.6rem' }} />
                  )}
                </p>
              )}
            </div>
          </div>
          <Grid container spacing={1} style={{ flex: 1, justifyContent: 'space-around' }}>
            <RadioGroup row defaultValue={RadioBoxValues.NEW}>
              {Object.keys(radioListComponentMapper).map((value: string, index: number) => {
                return (
                  <RadioNextGame
                    key={index}
                    value={value as RadioBoxValues}
                    Icon={radioListComponentMapper[value as RadioBoxValues]}
                    onChange={handleRadioButtonChange}
                    checked={selectedValue === value}
                  />
                );
              })}
            </RadioGroup>
          </Grid>
          <Grid
            container
            border={1}
            borderColor={primaryColor}
            p={3}
            my={1}
            boxSizing="border-box"
            style={{ flex: 1 }}
            spacing={3}
            alignItems="flex-start"
            justifyContent="flex-start"
          >
            <Grid item xs={12} md={12} justifyContent="center" style={{ width: '100%' }}>
              {mimicContent !== undefined && mimicContent.video !== null && <VideoView id={0} value={mimicContent.video}></VideoView>}
            </Grid>
            <Grid container xs={12} spacing={0} pb={1} mx={1} mb={2} alignItems="center" justifyContent="center">
              <h1>Que signifie cette mimique ?</h1>
            </Grid>
            <Grid container direction="row" spacing={5} pt={1}>
              <Grid item xs={4}>
                {choices &&
                  choices.map((val) => {
                    const { value, isSuccess, signification } = ResponseButtonDataMapper[val];
                    const isCorrect = isSuccess && found;
                    const mimicOrigine = mimicContent?.origine || '';
                    const isDisabled = (isSuccess && tryCount > 1) || (!isSuccess && found);
                    return (
                      <ResponseButton
                        key={val}
                        value={value}
                        onClick={() => handleClick(value, isSuccess)}
                        isSuccess={isSuccess}
                        signification={signification}
                        disabled={isDisabled}
                        isCorrect={isCorrect || (tryCount > 1 && isSuccess)}
                        mimicOrigine={mimicOrigine}
                      />
                    );
                  })}
              </Grid>
              {(found || tryCount > 1) && (
                <>
                  {user.country && (
                    <GameStats
                      gameResponses={gameResponses}
                      choices={choices}
                      country={userIsPelico ? village.countries[0].isoCode : user.country?.isoCode}
                      userMap={userMap}
                      users={users}
                    />
                  )}
                  <GameStats
                    gameResponses={gameResponses}
                    choices={choices}
                    country={
                      userIsPelico
                        ? village.countries[1].isoCode
                        : village.countries.map((c) => c.isoCode).find((i) => i !== user.country?.isoCode) || ''
                    }
                    userMap={userMap}
                    users={users}
                  />
                </>
              )}
            </Grid>

            <Grid item xs={12} md={12}>
              {found && <p>C’est exact ! Vous avez trouvé la signification de cette mimique.</p>}
            </Grid>
          </Grid>
          <Grid>{/* <ActivityComments activity={activityComment} usersMap={{}} /> */}</Grid>
        </Box>
        <Modal
          open={errorModalOpen}
          title="Oups"
          cancelLabel={tryCount > 1 && !found ? 'Fermer' : 'Réessayer'}
          maxWidth="lg"
          ariaDescribedBy="new-user-desc"
          ariaLabelledBy="new-user-title"
          onClose={() => setErrorModalOpen(false)}
        >
          {tryCount > 1 && !found ? (
            <p>Dommage ! Vous n’avez pas trouvé la bonne réponse cette fois-ci.</p>
          ) : (
            <p>Dommage ! Ce n’est pas cette réponse. Essayez encore !</p>
          )}
        </Modal>
        <AlreadyPlayerModal handleSuccessClick={handleConfirmModal} isOpen={isLastMimicModalOpen} gameId={game?.id || 0} />
        <Grid container justifyContent="space-between">
          {/* Todo : modifier la logique du bouton pour qu'il récupère la mimique précédente */}
          {/* <Grid item xs={3} display="flex" justifyContent="flex-start">
            <Button variant="outlined" color="primary" onClick={getNextGame}>
              mimique précédente
            </Button>
          </Grid> */}
          <Grid item xs={6} style={{ textAlign: 'center' }}>
            {(found || tryCount > 1) && (
              <div style={{ textAlign: 'center' }}>
                <p
                  style={{
                    margin: '0.5rem 1rem',
                    textDecorationLine: 'underline',
                  }}
                >
                  <Link href="/" passHref>
                    {"Ou revenir à l'accueil"}
                  </Link>
                </p>
              </div>
            )}
          </Grid>
          <Grid item xs={3} display="flex" justifyContent="flex-end">
            <Button variant="outlined" color="primary" onClick={getNextGame}>
              mimique suivante
            </Button>
          </Grid>
        </Grid>
      </div>
    </Base>
  );
};

export default PlayMimic;
