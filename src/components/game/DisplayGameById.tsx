import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState, useCallback, useMemo, useContext } from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Grid } from '@mui/material';

import { KeepRatio } from '../KeepRatio';
import { ActivityComments } from '../activities/ActivityComments';
import { useOneGameById } from 'src/api/game/game.getOneGameById';
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
import type { Game } from 'types/game.type';
import type { GameResponse } from 'types/gameResponse.type';
import type { User } from 'types/user.type';
import { UserType } from 'types/user.type';

function shuffleArray(size: number) {
  const array = Array.from(Array(size)).map((_, i) => i);
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

/* partie à déplacer et à centraliser avec les prochains jeux*/
type AlreadyPlayedModalProps = {
  isOpen: boolean;
  gameId: number;
  handleSuccessClick: () => void;
};

enum RadioBoxValues {
  NEW = 'Nouvelle',
  RANDOM = 'Aléatoire',
  // MOSAIC = 'Mosaïque',
}

// type RadioNextGameProps = {
//   value: RadioBoxValues;
//   Icon: OverridableComponent<SvgIconTypeMap<unknown, 'svg'>> & {
//     muiName: string;
//   };
//   onChange: (event: React.SyntheticEvent) => void;
//   checked: boolean;
// };

// const radioListComponentMapper = {
//   [RadioBoxValues.NEW]: AccessTimeIcon,
//   [RadioBoxValues.RANDOM]: ShuffleIcon,
//   //[RadioBoxValues.MOSAIC]: AppsIcon,
// };

// const RadioNextGame: React.FC<RadioNextGameProps> = ({ value, Icon, onChange, checked }) => (
//   <FormControlLabel
//     sx={{ ml: 1 }}
//     value={value}
//     control={<Radio sx={{ py: 0 }} />}
//     label={
//       <>
//         <Icon sx={{ fontSize: 16, verticalAlign: 'middle', ml: 0.5 }} /> {value}
//       </>
//     }
//     labelPlacement="end"
//     checked={checked}
//     onChange={onChange}
//   />
// );

const AlreadyPlayedModal: React.FC<AlreadyPlayedModalProps> = ({ isOpen, handleSuccessClick }) => {
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
      C’était le dernier jeu disponible ! Dès que de nouveaux seront ajoutées, cela apparaîtra dans le fil d’activité.
    </Modal>
  );
};
/* FIN partie à déplacer et à centraliser avec les prochains jeux*/

const POSITION = ['c', 'f', 'i'];

type SubTypeProps = {
  subType: GameType;
};

const DisplayGameById = ({ subType }: SubTypeProps) => {
  const { user } = useContext(UserContext);
  const { village } = useContext(VillageContext);
  const { users } = useVillageUsers();
  const { getRandomGame, sendNewGameResponse, getGameStats, getAvailableGames, resetGamesPlayedForUser } = useGameRequests();
  const [tryCount, setTryCount] = useState<number>(0);
  const [found, setFound] = useState<boolean>(false);
  const [errorModalOpen, setErrorModalOpen] = useState<boolean>(false);
  const [isGameModalOpen, setIsLastGameModalOpen] = useState<boolean>(false);
  const [gameResponses, setGameResponses] = useState<GameResponse[]>([]);
  const [selectedValue] = useState(RadioBoxValues.NEW);
  const router = useRouter();
  const { id } = router.query;

  const gameId = parseInt(String(id));
  const { data: getOneGameById } = useOneGameById(subType, gameId || 0);

  const usersMap = React.useMemo(() => {
    return users.reduce<{ [key: number]: User }>((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});
  }, [users]);

  const TYPE_OF_GAME = {
    [GameType.MIMIC]: 'mimique',
    [GameType.MONEY]: 'objet',
    [GameType.EXPRESSION]: 'expression',
  };

  const phrase = {
    [GameType.MIMIC]: {
      title: 'des mimiques',
      phraseDelamodal: 'la signification de cette mimique',
      question: 'Que signifie cette mimique ?',
      presentation: 'Une mimique proposé par ',
      moreInfos: '',
    },
    [GameType.MONEY]: {
      title: 'de la monnaie',
      phraseDelamodal: 'combien vaut cet objet',
      question: 'Combien vaut cet objet ?',
      presentation: 'Un objet proposé par ',
      moreInfos: '',
    },
    [GameType.EXPRESSION]: {
      title: 'des expressions',
      phraseDelamodal: 'la signification de cette expression',
      question: 'Que signifie cette expression ?',
      presentation: 'Une expression proposé par ',
      moreInfos: ` en ${getOneGameById?.content.language?.toLowerCase()}, ${getOneGameById?.content.radio}`,
    },
  };

  const typeOfGame = TYPE_OF_GAME[subType];
  const displayPhrasesByType = phrase[subType];
  const handleConfirmModal = async () => {
    const success = await resetGamesPlayedForUser();
    setIsLastGameModalOpen(false);

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
    setFound(false);
    setGameResponses([]);
    setTryCount(0);
    setErrorModalOpen(false);

    const allGames = await getAvailableGames(subType);
    const availableGamesByDescOrder = sortGamesByDescOrder(allGames);
    const currentGameIndex = availableGamesByDescOrder.findIndex((g) => g.id === gameId);
    const availableGames = allGames.filter((g) => g.id !== gameId);

    const isLastGame = availableGames.length === 0;

    const NEXT_GAME_MAPPER = {
      [RadioBoxValues.NEW]: () => availableGamesByDescOrder[currentGameIndex + 1 < availableGamesByDescOrder.length ? currentGameIndex + 1 : 0],
      [RadioBoxValues.RANDOM]: async () => {
        return await getRandomGame(subType);
      },
    };

    const nextGame = isLastGame ? undefined : await NEXT_GAME_MAPPER[selectedValue]();

    if (isLastGame || !nextGame) {
      setIsLastGameModalOpen(true);
      return;
    }
    router.push(`./${nextGame?.id}`);
  }, [getAvailableGames, subType, selectedValue, router, gameId, getRandomGame]);

  const userMap = useMemo(
    () =>
      users.reduce<{ [key: number]: number }>((acc, u, index) => {
        acc[u.id] = index;
        return acc;
      }, {}),
    [users],
  );

  const playContent = useMemo(() => {
    if (!getOneGameById) {
      return { responses: [] };
    }

    const {
      id,
      content,
      content: {
        game: steps,
        labelPresentation,
        radio,
        language,
        monney,
        game: [
          {
            inputs: [{ selectedValue: media, type }],
          },
        ],
      },
      createDate,
      villageId,
    } = getOneGameById || {};

    const responses: { signification: string; isSuccess: boolean; value: number }[] = [];

    let fakeSignificationIndex = 1;
    const euro = content.monney;
    steps.map(({ inputs }) => {
      inputs.map((input) => {
        if (input.response || input.response === false) {
          if (getOneGameById.subType === GameType.MONEY) {
            const significationWithEuro = `${input.selectedValue} ${euro}`;
            responses.push({ isSuccess: input.response, signification: significationWithEuro, value: input.response ? 0 : fakeSignificationIndex });
          } else {
            responses.push({ isSuccess: input.response, signification: input.selectedValue, value: input.response ? 0 : fakeSignificationIndex });
          }
          if (input.response === false) {
            ++fakeSignificationIndex;
          }
        }
      });
    });
    return {
      responses,
      labelPresentation,
      radio,
      monney,
      language,
      createDate,
      id,
      media,
      type,
      villageId,
    };
  }, [getOneGameById]);

  const gameCreator = useMemo(() => {
    if (getOneGameById === undefined) {
      return undefined;
    }
    return userMap[getOneGameById.userId] !== undefined ? users[userMap[getOneGameById.userId]] : undefined;
  }, [getOneGameById, userMap, users]);
  const gameCreatorIsPelico = gameCreator !== undefined && gameCreator.type <= UserType.MEDIATOR;
  const userIsPelico = user !== null && user.type <= UserType.MEDIATOR;

  const choices = React.useMemo(() => (playContent.responses.length > 0 ? shuffleArray(playContent.responses.length) : []), [playContent.responses]);

  const handleClick = useCallback(
    async (selection: string, isSuccess: boolean = false) => {
      if (playContent.responses.length === 0) {
        return;
      }
      const apiResponse = await sendNewGameResponse(playContent.id || 0, selection, playContent.villageId || 0);
      if (!apiResponse) {
        console.error('Error reaching server');
        return;
      }

      setFound(isSuccess);
      setErrorModalOpen(!isSuccess);
      if (isSuccess || tryCount === 1) {
        setGameResponses(await getGameStats(playContent.id || 0));
      }
      setTryCount(tryCount + 1);
    },
    [
      getGameStats,
      sendNewGameResponse,
      setFound,
      playContent.responses,
      setErrorModalOpen,
      setGameResponses,
      setTryCount,
      tryCount,
      playContent?.id,
      playContent.villageId,
    ],
  );

  if (user == null || village == null) {
    return <Base></Base>;
  }

  // Modal dernier jeux
  if (playContent.responses.length === 0 || !gameCreator) {
    return (
      <Base>
        <AlreadyPlayedModal handleSuccessClick={handleConfirmModal} isOpen={isGameModalOpen} gameId={playContent.id || 0} />
      </Base>
    );
  }

  return (
    <Base rightNav={<RightNavigation activityUser={gameCreator} displayAsUser={false} />} hideLeftNav showSubHeader>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem', marginBottom: '3rem' }}>
        <Box display="flex" flexDirection="column">
          <Box alignItems="flex-start">
            <div>
              {displayPhrasesByType && (
                <div>
                  <h1>Jouer au jeu {displayPhrasesByType.title} !</h1>
                </div>
              )}
            </div>
          </Box>
          <div className="activity-card__header">
            <AvatarImg user={gameCreator} size="small" style={{ margin: '0.25rem 0rem 0.25rem 0.25rem' }} noLink={false} />
            <div
              className="activity-card__header_info"
              style={{ display: 'block,', justifyContent: 'center', alignItems: 'center', paddingBottom: '1rem' }}
            >
              <h3 className="text" style={{ marginTop: '0.7rem' }}>
                {displayPhrasesByType.presentation}
                <UserDisplayName className="text" user={gameCreator} noLink={false} />
                {displayPhrasesByType.moreInfos}
              </h3>
              {playContent && playContent.createDate && (
                <p style={{ fontSize: '0.8rem', color: 'gray' }}>
                  {'Publié le '}
                  {new Date(playContent.createDate).toLocaleDateString()}
                  {gameCreatorIsPelico ? (
                    <PelicoNeutre style={{ marginLeft: '0.6rem', height: '16px', width: 'auto' }} />
                  ) : (
                    gameCreator && gameCreator.country && <Flag country={gameCreator.country.isoCode} size="small" style={{ marginLeft: '0.6rem' }} />
                  )}
                </p>
              )}
            </div>
          </div>
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
            <Link href={`/creer-un-jeu/${typeOfGame}/displayList`}>
              <ArrowBackIcon />
            </Link>

            <Grid item xs={12} md={12} justifyContent="center" style={{ width: '100%' }}>
              {playContent !== undefined && playContent.media !== null && playContent.type === 4 && (
                <VideoView id={0} value={playContent.media}></VideoView>
              )}
              {playContent !== undefined && playContent.media !== null && playContent.type === 3 && (
                <div className="text-center activity-data">
                  <KeepRatio ratio={9 / 16} maxWidth="600px">
                    <Image src={playContent.media} layout="fill" objectFit="contain" unoptimized />
                  </KeepRatio>
                </div>
              )}
            </Grid>
            <Grid container spacing={0} pb={1} mx={1} mb={2} alignItems="center" justifyContent="center">
              <h1>{displayPhrasesByType.question}</h1>
            </Grid>
            <div
              className="display-ended-game"
              style={{
                display: 'grid',
                width: '100%',
                gridTemplateColumns: '1fr 2fr 2fr',
                gridTemplateRows: 'repeat(3,auto)',
                gridTemplateAreas: '". a b " "c d e" "f g h" "i j k"',
              }}
            >
              {choices &&
                choices.map((val, index) => {
                  const { value, isSuccess, signification } = playContent.responses[val];
                  const isCorrect = isSuccess && found;
                  const isDisabled = (isSuccess && tryCount > 1) || (!isSuccess && found);
                  return (
                    <div key={val} style={{ display: 'grid', gridArea: POSITION[index] }}>
                      <ResponseButton
                        value={value}
                        onClick={() => handleClick(value.toString(), isSuccess)}
                        isSuccess={isSuccess}
                        signification={signification}
                        disabled={isDisabled}
                        isCorrect={isCorrect || (tryCount > 1 && isSuccess)}
                      />
                    </div>
                  );
                })}
              {(found || tryCount > 1) && (
                <>
                  {user.country && (
                    <GameStats
                      gameResponses={gameResponses}
                      choices={choices}
                      country={userIsPelico ? village.countries[0].isoCode : user.country?.isoCode}
                      userMap={userMap}
                      users={users}
                      position={0}
                    />
                  )}
                  <GameStats
                    gameResponses={gameResponses}
                    choices={choices}
                    position={1}
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
            </div>

            <Grid item xs={12} md={12}>
              {found && <p>C’est exact ! Vous avez trouvé {displayPhrasesByType.phraseDelamodal}.</p>}
            </Grid>
          </Grid>
          <Grid style={{ textAlign: 'right' }}>
            <Button variant="outlined" color="primary" onClick={getNextGame}>
              Jeu suivant
            </Button>
          </Grid>
          <Grid>{getOneGameById ? <ActivityComments activity={getOneGameById} usersMap={usersMap} /> : null}</Grid>
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
        <AlreadyPlayedModal handleSuccessClick={handleConfirmModal} isOpen={isGameModalOpen} gameId={gameId} />
        <Grid item xs={6}>
          {(found || tryCount > 1 || true) && (
            <div style={{ textAlign: 'left' }}>
              <p
                style={{
                  margin: '0.5rem 1rem',
                  textDecorationLine: 'underline',
                }}
              >
                <Link href="/" passHref>
                  {"Revenir à l'accueil"}
                </Link>
              </p>
            </div>
          )}
        </Grid>
      </div>
    </Base>
  );
};

export default DisplayGameById;
