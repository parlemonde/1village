import { Button, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import React from 'react';
import ReactPlayer from 'react-player';
import { UserContext } from 'src/contexts/userContext';
import { Base } from 'src/components/Base';
import { Mimique } from 'types/mimique.type';

const PlayMimique: React.FC = () => {
  const [mimique, setMimique] = React.useState<Mimique>(null);
  const { axiosLoggedRequest } = React.useContext(UserContext);

  React.useEffect(() => {
    axiosLoggedRequest({
      method: 'GET',
      url: `/mimiques/play`,
    }).then((response) => {
      if (!response.error) {
        setMimique(response.data as Mimique);
      }
    });
  }, [setMimique]);

  const validate = () => {};

  if (!mimique) {
    return (
      <Base>
        <div></div>
      </Base>
    );
  }
  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <h1>Que signifie cette mimique ?</h1>
        <p>Une mimique proposée par la classe de CE2 à Ain El-Rihani</p>
        <ReactPlayer width="100%" height="100%" light url="" controls />
        <RadioGroup aria-label="gender" name="gender1" value="">
          <FormControlLabel value="0" control={<Radio />} label={mimique.signification} />
          <FormControlLabel value="1" control={<Radio />} label={mimique.fakeSignification1} />
          <FormControlLabel value="2" control={<Radio />} label={mimique.fakeSignification2} />
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
