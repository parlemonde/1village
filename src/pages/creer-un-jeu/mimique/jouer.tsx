import Link from 'next/link';
import { useRouter } from 'next/router';
import type { SourceProps } from 'react-player/base';
import ReactPlayer from 'react-player';
import React from 'react';

import type { LinearProgressProps } from '@mui/material/LinearProgress';
import { Button, FormControlLabel, Grid, Radio, RadioGroup, LinearProgress, Typography, Box } from '@mui/material';

import { AvatarImg } from 'src/components/Avatar';
import { Base } from 'src/components/Base';
import { Flag } from 'src/components/Flag';
import { Modal } from 'src/components/Modal';
import { UserDisplayName } from 'src/components/UserDisplayName';
import { CustomRadio as GreenRadio } from 'src/components/buttons/CustomRadio';
import { CustomRadio as RedRadio } from 'src/components/buttons/CustomRadio';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { useVillageUsers } from 'src/services/useVillageUsers';
import PelicoNeutre from 'src/svg/pelico/pelico_neutre.svg';
import { serializeToQueryUrl } from 'src/utils';
import type { Game } from 'types/game.type';
import { GameType } from 'types/game.type';
import type { MimicData } from 'types/game.type';
import type { GameResponse } from 'types/gameResponse.type';
import { MimicResponseValue } from 'types/mimicResponse.type';
import type { User } from 'types/user.type';
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

interface StatsProps {
  [key: string]: { [key: string]: number };
}

const mimicContentPropsDefault = {
  gameId: 0,
  origine: '',
  signification: '',
  fakeSignification1: '',
  fakeSignification2: '',
  video: '',
};

const PlayMimique = () => {
  const router = useRouter();
  const [tryCount, setTryCount] = React.useState<number>(0);
  const [found, setFound] = React.useState<boolean>(false);
  const [foundError, setFoundError] = React.useState<boolean>(false);
  const [fake1Selected, setFake1Selected] = React.useState<boolean>(false);
  const [fake2Selected, setFake2Selected] = React.useState<boolean>(false);
  const [errorModalOpen, setErrorModalOpen] = React.useState<boolean>(false);
  const [lastMimiqueModalOpen, setLastMimiqueModalOpen] = React.useState<boolean>(false);
  const [game, setGame] = React.useState<Game>();
  const [mimicContent, setMimicContent] = React.useState<MimicData>(mimicContentPropsDefault);
  const [gameResponses, setGameResponses] = React.useState<GameResponse[]>();
  const [user, setUser] = React.useState<User>();
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const [selected, setSelected] = React.useState<MimicResponseValue | null>(null);
  const [stats, setStats] = React.useState<StatsProps>();
  const { village } = React.useContext(VillageContext);
  const [isReloading, setIsReloading] = React.useState<boolean>(false);
  const [ableToValidate, setAbleToValidate] = React.useState<boolean>(false);
  const [firstCountryToAnswer, setFirstCountryToAnswer] = React.useState<boolean>(false);
  const [connectedUserId, setconnectedUserId] = React.useState<number>(0);
  const [connectedUserIsoCode, setconnectedUserIsoCode] = React.useState('');

  const [userIsPelico, setUserIsPelico] = React.useState<boolean>(true);

  const { users } = useVillageUsers();
  const userMap = React.useMemo(
    () =>
      users.reduce<{ [key: number]: number }>((acc, u, index) => {
        acc[u.id] = index;
        return acc;
      }, {}),
    [users],
  );

  const choices = React.useMemo(() => game && shuffleArray([0, 1, 2]), [game]);

  React.useEffect(() => {
    if (isReloading) {
      setMimicContent(mimicContentPropsDefault);
      setIsReloading(false);
      setFound(false);
      setFoundError(false);
      setFake1Selected(false);
      setFake2Selected(false);
      setGameResponses([] as GameResponse[]);
      setStats({} as StatsProps);
      setSelected(null);
      setTryCount(0);
      setErrorModalOpen(false);
      setAbleToValidate(false);
    }
    if (isReloading || village) {
      axiosLoggedRequest({
        method: 'GET',
        url: `/games/play${serializeToQueryUrl({
          villageId: village?.id,
          type: GameType.MIMIC,
        })}`,
      }).then((response) => {
        if (!response.error && response.data) {
          const game = response.data as Game;
          const gameValues = Object.values(game);
          // Pick a random mimic game
          const randomGamePick = gameValues[Math.floor(Math.random() * gameValues.length)] as Game;
          setGame(randomGamePick);
          const mimicContent = JSON.parse(randomGamePick.content) as unknown as MimicData;
          setMimicContent(mimicContent);
        } else {
          setLastMimiqueModalOpen(true);
        }
      });
    }
  }, [mimicContent.gameId, isReloading, village, axiosLoggedRequest]);

  React.useEffect(() => {
    if (game) {
      const user = userMap[game.userId] !== undefined ? users[userMap[game.userId]] : undefined;
      if (user && user.type !== UserType.OBSERVATOR) setUser(user as unknown as User);
      if (user && user.type === UserType.OBSERVATOR) setUserIsPelico(false);
    }
  }, [game, userMap, users]);

  React.useEffect(() => {
    if (gameResponses) {
      const resStats: StatsProps = {};
      gameResponses.forEach((val: GameResponse) => {
        // connected user's id
        const classUserId = val.userId;
        setconnectedUserId(classUserId);
        // connected user's country
        const classUserIsoCode = val.user.country.isoCode;
        setconnectedUserIsoCode(classUserIsoCode);
        if (resStats[val.user.country.isoCode] && resStats[val.user.country.isoCode][val.user.id]) {
          resStats[val.user.country.isoCode].total = resStats[val.user.country.isoCode].total + 1;
          resStats[val.user.country.isoCode][val.value] = resStats[val.user.country.isoCode][val.value] + 1;
        } else {
          if (!resStats[val.user.country.isoCode]) {
            resStats[val.user.country.isoCode] = {
              total: 0,
            };
          }
          if (!resStats[val.user.country.isoCode][val.value]) {
            resStats[val.user.country.isoCode][val.value] = 1;
            resStats[val.user.country.isoCode].total = resStats[val.user.country.isoCode].total + 1;
          }
        }
      });
      setStats(resStats);
      const resStatsCountries = Object.keys(resStats);
      // if the array contains only one country, the other country has not played the same game yet
      if (resStatsCountries.length === 1) {
        setFirstCountryToAnswer(true);
      } else {
        setFirstCountryToAnswer(false);
      }
    }
  }, [firstCountryToAnswer, gameResponses, userMap]);

  const validate = () => {
    if (selected === null) return;
    axiosLoggedRequest({
      method: 'PUT',
      url: `/games/play/${game?.id}`,
      data: { value: selected },
    }).then(() => {
      if (tryCount == 0) {
        if (selected == MimicResponseValue.SIGNIFICATION) {
          setFound(true);
          setSelected(null);
          axiosLoggedRequest({
            method: 'GET',
            url: `/games/stats/${game?.id}`,
          }).then((response) => {
            if (!response.error && response.data) {
              setGameResponses(response.data as GameResponse[]);
            }
          });
        } else if (selected == MimicResponseValue.FAKE_SIGNIFICATION_1) {
          setFake1Selected(true);
          setSelected(null);
          setErrorModalOpen(true);
        } else {
          setFake2Selected(true);
          setSelected(null);
          setErrorModalOpen(true);
        }
        setTryCount(tryCount + 1);
      } else if (tryCount == 1) {
        if (selected == MimicResponseValue.SIGNIFICATION) {
          setFound(true);
          setSelected(null);
        } else if (selected == MimicResponseValue.FAKE_SIGNIFICATION_1) {
          setFake1Selected(true);
          setSelected(null);
          setFoundError(true);
        } else {
          setFake2Selected(true);
          setSelected(null);
          setFoundError(true);
        }
        axiosLoggedRequest({
          method: 'GET',
          url: `/games/stats/${game?.id}`,
        }).then((response) => {
          if (!response.error && response.data) {
            setGameResponses(response.data as GameResponse[]);
          }
        });
      }
    });
  };

  const onChange = (event: { target: HTMLInputElement }) => {
    setSelected(event.target.value as MimicResponseValue);
    setAbleToValidate(true);
  };

  if (!game || !user) {
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

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem', marginBottom: '3rem' }}>
        <h1>Que signifie cette mimique ?</h1>
        <div className="activity-card__header">
          <AvatarImg user={user} size="small" style={{ margin: '0.25rem 0rem 0.25rem 0.25rem' }} noLink={false} />
          <div className="activity-card__header_info">
            <p className="text" style={{ marginTop: '0.7rem' }}>
              {'Une mimique proposée par '}
              <UserDisplayName className="text" user={user} noLink={false} />
              {!userIsPelico ? (
                <PelicoNeutre style={{ marginLeft: '0.6rem', height: '16px', width: 'auto' }} />
              ) : (
                <Flag country={user.country.isoCode} size="small" style={{ marginLeft: '0.6rem' }} />
              )}
            </p>
          </div>
        </div>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <ReactPlayer light url={mimicContent.video as string | string[] | MediaStream | SourceProps[] | undefined} controls />
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
                        label={mimicContent.signification}
                        disabled={found || foundError ? true : false}
                      />
                    );
                  } else if (val === 1) {
                    return (
                      <FormControlLabel
                        key="2"
                        value={MimicResponseValue.FAKE_SIGNIFICATION_1}
                        control={fake1Selected ? <RedRadio isChecked /> : <Radio />}
                        label={mimicContent.fakeSignification1}
                        disabled={fake1Selected || found || foundError ? true : false}
                      />
                    );
                  } else {
                    return (
                      <FormControlLabel
                        key="3"
                        value={MimicResponseValue.FAKE_SIGNIFICATION_2}
                        control={fake2Selected ? <RedRadio isChecked /> : <Radio />}
                        label={mimicContent.fakeSignification2}
                        disabled={fake2Selected || found || foundError ? true : false}
                      />
                    );
                  }
                })}
            </RadioGroup>
          </Grid>
          {stats &&
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
          {stats && firstCountryToAnswer === true ? (
            Object.keys(stats).map((country: string) => {
              return (
                <Grid item xs={5} md={5} key={country}>
                  <span style={{ paddingRight: '0.5rem' }}>Pas de réponses des Pélicopains</span>
                  {/* First, we make sure the connected user is different from the user who has already played. 
                  Then check if they are from the same country. Based on the user's id, we display the correct flag. */}
                  {user.id !== connectedUserId && user.country.isoCode === connectedUserIsoCode && <Flag country={connectedUserIsoCode} />}
                  {user.id !== connectedUserId && user.country.isoCode !== connectedUserIsoCode && <Flag country={user.country.isoCode} />}
                </Grid>
              );
            })
          ) : (
            <div></div>
          )}

          <Grid item xs={12} md={12}>
            {found && <p>C’est exact ! Vous avez trouvé la signification de cette mimique.</p>}
            {foundError && <p>Dommage ! Vous n’avez pas trouvé la bonne réponse cette fois-ci.</p>}
            {(found || foundError) && (
              <>
                <h2>Origine de cette mimique :</h2>
                <p>{mimicContent.origine}</p>
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
            onClick={validate}
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
                onClick={() => setIsReloading(true)}
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
