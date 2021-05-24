import { Button, FormControlLabel, Grid, Radio, RadioGroup, RadioProps, LinearProgress, Typography, Box } from '@material-ui/core';
import React from 'react';
import ReactPlayer from 'react-player';
import { UserContext } from 'src/contexts/userContext';
import { Base } from 'src/components/Base';
import { Mimique } from 'types/mimique.type';
import { useVillageUsers } from 'src/services/useVillageUsers';
import { UserDisplayName } from 'src/components/UserDisplayName';
import { User } from 'types/user.type';
import { MimiqueResponse, MimiqueResponseValue } from 'types/mimiqueResponse.type';
import { green, red } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { Modal } from 'src/components/Modal';
import { useRouter } from 'next/router';
import { LinearProgressProps } from '@material-ui/core/LinearProgress';
import { Flag } from 'src/components/Flag';

const GreenRadio = withStyles({
  root: {
    color: green[400],
  },
  disabled: {
    color: green[400],
  },
})((props: RadioProps) => <Radio color="default" {...props} />);
const RedRadio = withStyles({
  root: {
    color: red[400],
  },
  disabled: {
    color: red[400],
    '&$disabled': {
      color: red[400],
    },
  },
})((props: RadioProps) => <Radio color="default" {...props} />);

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

const PlayMimique: React.FC = () => {
  const router = useRouter();
  const [tryCount, setTryCount] = React.useState<number>(0);
  const [found, setFound] = React.useState<boolean>(false);
  const [foundError, setFoundError] = React.useState<boolean>(false);
  const [fake1Selected, setFake1Selected] = React.useState<boolean>(false);
  const [fake2Selected, setFake2Selected] = React.useState<boolean>(false);
  const [errorModalOpen, setErrorModalOpen] = React.useState<boolean>(false);
  const [lastMimiqueModalOpen, setLastMimiqueModalOpen] = React.useState<boolean>(false);
  const [mimique, setMimique] = React.useState<Mimique>(null);
  const [user, setUser] = React.useState<User>(null);
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const [selected, setSelected] = React.useState<MimiqueResponseValue | null>(null);
  const [mimiqueResponses, setMimiqueResponses] = React.useState<MimiqueResponse[] | null>(null);
  const [stats, setStats] = React.useState<StatsProps | null>(null);

  const { users } = useVillageUsers();
  const userMap = React.useMemo(
    () =>
      users.reduce<{ [key: number]: number }>((acc, u, index) => {
        acc[u.id] = index;
        return acc;
      }, {}),
    [users],
  );

  const choices = React.useMemo(() => mimique && shuffleArray([0, 1, 2]), [mimique]);

  React.useEffect(() => {
    axiosLoggedRequest({
      method: 'GET',
      url: `/mimiques/play`,
    }).then((response) => {
      console.log(response);
      if (!response.error && response.data) {
        setMimique(response.data as Mimique);
      } else {
        setLastMimiqueModalOpen(true);
      }
    });
  }, [setMimique]);

  React.useEffect(() => {
    if (mimique) {
      setUser(userMap[mimique.userId] !== undefined ? users[userMap[mimique.userId]] : undefined);
    }
  }, [mimique, userMap]);

  React.useEffect(() => {
    if (mimiqueResponses) {
      console.log(mimiqueResponses);
      const resStats: StatsProps = {};
      mimiqueResponses.forEach((val: MimiqueResponse) => {
        if (resStats[val.user.countryCode] && resStats[val.user.countryCode][val.value]) {
          resStats[val.user.countryCode][val.value] = resStats[val.user.countryCode][val.value] + 1;
          resStats[val.user.countryCode].total = resStats[val.user.countryCode].total + 1;
        } else {
          if (!resStats[val.user.countryCode]) {
            resStats[val.user.countryCode] = {
              total: 0,
            };
          }
          if (!resStats[val.user.countryCode][val.value]) {
            resStats[val.user.countryCode][val.value] = 1;
            resStats[val.user.countryCode].total = resStats[val.user.countryCode].total + 1;
          }
        }
      });
      setStats(resStats);
      console.log(resStats, Object.keys(resStats));
    }
  }, [mimiqueResponses, userMap]);

  const validate = () => {
    if (selected === null) {
      return;
    }
    axiosLoggedRequest({
      method: 'PUT',
      url: `/mimiques/play/${mimique.id}`,
      data: { value: selected },
    }).then(() => {
      if (tryCount == 0) {
        if (selected == 0) {
          console.log('found !');
          setFound(true);
          setSelected(null);
          axiosLoggedRequest({
            method: 'GET',
            url: `/mimiques/stats/${mimique.id}`,
          }).then((response) => {
            if (!response.error && response.data) {
              setMimiqueResponses(response.data as MimiqueResponse[]);
            }
          });
        } else if (selected == 1) {
          console.log('fake1 !');
          setFake1Selected(true);
          setSelected(null);
          setErrorModalOpen(true);
        } else {
          console.log('fake2 !');
          setFake2Selected(true);
          setSelected(null);
          setErrorModalOpen(true);
        }
        setTryCount(tryCount + 1);
      } else if (tryCount == 1) {
        if (selected == 0) {
          console.log('found !');
          setFound(true);
          setSelected(null);
        } else if (selected == 1) {
          console.log('fake1 !');
          setFake1Selected(true);
          setSelected(null);
          setFoundError(true);
        } else {
          console.log('fake2 !');
          setFake2Selected(true);
          setSelected(null);
          setFoundError(true);
        }
        axiosLoggedRequest({
          method: 'GET',
          url: `/mimiques/stats/${mimique.id}`,
        }).then((response) => {
          if (!response.error && response.data) {
            setMimiqueResponses(response.data as MimiqueResponse[]);
          }
        });
      }
    });
  };
  const onChange = (event: { target: HTMLInputElement }) => {
    setSelected(parseInt(event.target.value) as MimiqueResponseValue);
  };

  if (!mimique || !user) {
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

  function shuffleArray(array: Array<any>) {
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
        <p>
          {'Une mimique proposée par '}
          <UserDisplayName user={user} />
        </p>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <ReactPlayer light url={mimique.video} controls />
          </Grid>
          <Grid item xs={12} md={4}>
            <RadioGroup aria-label="gender" name="gender1" value={selected} onChange={onChange} style={{ marginTop: '1.6rem' }}>
              {choices &&
                choices.map((val) => {
                  if (val === 0) {
                    return (
                      <FormControlLabel
                        key="1"
                        value={MimiqueResponseValue.SIGNIFICATION}
                        control={found || foundError ? <GreenRadio icon={<FiberManualRecordIcon style={{ color: green[400] }} />} /> : <Radio />}
                        label={mimique.signification}
                        disabled={found || foundError ? true : false}
                      />
                    );
                  } else if (val === 1) {
                    return (
                      <FormControlLabel
                        key="2"
                        value={MimiqueResponseValue.FAKE_SIGNIFICATION_1}
                        control={fake1Selected ? <RedRadio icon={<FiberManualRecordIcon style={{ color: red[400] }} />} /> : <Radio />}
                        label={mimique.fakeSignification1}
                        disabled={fake1Selected || found || foundError ? true : false}
                      />
                    );
                  } else {
                    return (
                      <FormControlLabel
                        key="3"
                        value={MimiqueResponseValue.FAKE_SIGNIFICATION_2}
                        control={fake2Selected ? <RedRadio icon={<FiberManualRecordIcon style={{ color: red[400] }} />} /> : <Radio />}
                        label={mimique.fakeSignification2}
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
                <Grid item xs={12} md={4} key={country}>
                  <span>Réponses des pélicopains </span>
                  <Flag country={country} />
                  {choices.map((val) => {
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
          <Grid item xs={12} md={12}>
            {found && <p>C’est exact ! Vous avez trouvé la signification de cette mimique.</p>}
            {foundError && <p>Dommage ! Vous n’avez pas trouvé la bonne réponse cette fois-ci.</p>}
            {(found || foundError) && (
              <>
                <h2>L'origine de cette mimique :</h2>
                <p>{mimique.origine}</p>
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
          >
            Valider
          </Button>
        )}
        {(found || foundError) && (
          <Button
            style={{
              float: 'right',
            }}
            variant="outlined"
            color="primary"
            onClick={() => router.reload()}
          >
            Rejouer
          </Button>
        )}
      </div>
    </Base>
  );
};

export default PlayMimique;
