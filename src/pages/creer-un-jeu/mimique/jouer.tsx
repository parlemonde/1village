import { Button, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import React from 'react';
import ReactPlayer from 'react-player';
import { UserContext } from 'src/contexts/userContext';
import { Base } from 'src/components/Base';
import { Mimique } from 'types/mimique.type';
import { useVillageUsers } from 'src/services/useVillageUsers';
import { UserDisplayName } from 'src/components/UserDisplayName';
import { User } from 'types/user.type';
import { MimiqueResponseValue } from 'types/mimiqueResponse.type';

const PlayMimique: React.FC = () => {
  const [end, setEnd] = React.useState<boolean>(false);
  const [mimique, setMimique] = React.useState<Mimique>(null);
  const [user, setUser] = React.useState<User>(null);
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const [selected, setSelected] = React.useState<MimiqueResponseValue | null>(null);

  const { users } = useVillageUsers();
  const userMap = React.useMemo(
    () =>
      users.reduce<{ [key: number]: number }>((acc, u, index) => {
        acc[u.id] = index;
        return acc;
      }, {}),
    [users],
  );

  const choices = React.useMemo(
    () =>
      mimique &&
      shuffleArray([
        <FormControlLabel value={MimiqueResponseValue.SIGNIFICATION} control={<Radio />} label={mimique.signification} />,
        <FormControlLabel value={MimiqueResponseValue.FAKE_SIGNIFICATION_1} control={<Radio />} label={mimique.fakeSignification1} />,
        <FormControlLabel value={MimiqueResponseValue.FAKE_SIGNIFICATION_2} control={<Radio />} label={mimique.fakeSignification2} />,
      ]),
    [mimique],
  );

  React.useEffect(() => {
    axiosLoggedRequest({
      method: 'GET',
      url: `/mimiques/play`,
    }).then((response) => {
      if (!response.error && response.data) {
        setMimique(response.data as Mimique);
      } else {
        setEnd(true);
      }
    });
  }, [setMimique]);

  React.useEffect(() => {
    if (mimique) {
      setUser(userMap[mimique.userId] !== undefined ? users[userMap[mimique.userId]] : undefined);
    }
  }, [mimique, userMap]);

  const validate = () => {
    if (selected === null) {
      return;
    }
    axiosLoggedRequest({
      method: 'PUT',
      url: `/mimiques/play/${mimique.id}`,
      data: { value: selected },
    }).then((response) => {
      if (!response.error && response.data) {
        setMimique(response.data as Mimique);
      } else {
        setEnd(true);
      }
    });
  };
  const onChange = (event: { target: HTMLInputElement }) => {
    setSelected(parseInt(event.target.value) as MimiqueResponseValue);
  };

  if (end) {
    return (
      <Base>
        <div>vous avez découvert toutes les mimiques</div>
      </Base>
    );
  }

  if (!mimique || !user) {
    return (
      <Base>
        <div>loading ...</div>
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
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <h1>Que signifie cette mimique ?</h1>
        <p>
          {'Une mimique proposée par '}
          <UserDisplayName user={user} />
        </p>

        <ReactPlayer light url={mimique.video} controls />
        <RadioGroup aria-label="gender" name="gender1" value={selected} onChange={onChange}>
          {choices}
        </RadioGroup>
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
      </div>
    </Base>
  );
};

export default PlayMimique;
