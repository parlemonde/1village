import { useRouter } from 'next/router';
import React from 'react';

import { TextField, Grid, Box ,Button,Radio ,RadioGroup,FormControlLabel} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

import { isGame, isPresentation } from 'src/activity-types/anyActivity';
import { DEFAULT_MIMIQUE_DATA, isMimique, GAME } from 'src/activity-types/game.const';
import { MimiqueData, MimiquesData } from 'src/activity-types/game.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { BackButton } from 'src/components/buttons/BackButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { getUserDisplayName, pluralS } from 'src/utils';
import { ActivityType, ActivityStatus } from 'types/activity.type';
import { EditButton } from 'src/components/buttons/EditButton';
import { VideoModals } from 'src/components/activities/content/editors/VideoEditor/VideoModals';
import { AvatarImg } from 'src/components/Avatar';
import UploadIcon from 'src/svg/jeu/mimique.svg';


const GreenRadio = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props: RadioProps) => <Radio color="default" {...props} />);
const MimiqueStep4: React.FC = () => {
  const router = useRouter();
  const [isError, setIsError] = React.useState<boolean>(false);
  const { activity, updateActivity, createActivityIfNotExist, save } = React.useContext(ActivityContext);
  const { user } = React.useContext(UserContext);
  const labelPresentation = getUserDisplayName(user, false);
  const created = React.useRef(false);
  
React.useEffect(() => {
    if (!created.current) {
      if (!activity) {
        created.current = true;
        createActivityIfNotExist(ActivityType.GAME, GAME.MIMIQUE, {
          ...DEFAULT_MIMIQUE_DATA,
          presentation: labelPresentation,
        }).catch(console.error);
      } else if (activity && (!isGame(activity) || !isMimique(activity))) {
        created.current = true;
        createActivityIfNotExist(ActivityType.GAME, GAME.MIMIQUE, {
          ...DEFAULT_MIMIQUE_DATA,
          presentation: labelPresentation,
        }).catch(console.error);
      }
    }
  }, [activity, labelPresentation, createActivityIfNotExist, router]);
  const data = (activity?.data as MimiquesData) || null;
  const [value, setValue] = React.useState(data.mimique1.signification);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  if (!activity) {
    return (
      <Base>
        <div></div>
      </Base>
    );
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
      
        <Steps steps={['1ère mimique', '2ème mimique', '3ème mimique', 'Prévisualiser']} activeStep={3} />
        <div className="width-900">
          <h1>Pré-visualisez votre mimiques et publiez les !</h1>
          <h6 style={{ width: '100%', textAlign: 'left', margin: '1rem 0' }}>
            Vous pouvez modifier chaque mimique si vous le souhaitez. Quand vous êtes prêts :
          </h6>
          <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
                <Button variant="outlined" color="primary">
                Publier … et jouer à votre tour !
                </Button>
          </div>
          {/* Mimique 1 */}
          <div className="preview-block">
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                  <Box display="flex" justifyContent="right" m={1}>
                  <Button name="video" style={{ width: '100%', height:'80%',background: data.mimique1.video ? 'lightgrey' : 'lightgrey' }}>
                  {<UploadIcon style={{ fill: 'currentcolor', width: '3rem', height: '3rem', margin: '30px' }} />}
              </Button>
                  </Box>
                </Grid>
              <Grid item xs={12} md={6}>
                <RadioGroup aria-label="signification" name="signification1" value={value} onChange={handleChange}>
                  <FormControlLabel  value={data.mimique1.signification} control={<GreenRadio />} label={data.mimique1.signification} />
                  <FormControlLabel  control={<Radio />} label={data.mimique1.fakeSignification1} />
                  <FormControlLabel  control={<Radio />} label={data.mimique1.fakeSignification2} />
                </RadioGroup>
                </Grid>
                <Grid item xs={12} md={2}>
                <EditButton
                  onClick={() => {
                    router.push('/creer-un-jeu/mimique/1');
                  }}
                  isGreen
                  style={{ position: 'absolute', top: '40%', right: '0.5rem'}}
                />
                </Grid>
            </Grid>
            <h6 style={{ width: '100%', textAlign: 'left', margin: '1rem 0' }}>{data.mimique1.origine} </h6>
          </div>
          {/* Mimique 2 */}
          <div className="preview-block">
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                  <Box display="flex" justifyContent="center" m={0}>
                  <Button name="video" style={{ width: '100%', height:'80%',background: data.mimique2.video ? 'lightgrey' : 'lightgrey' }}>
                  {<UploadIcon style={{ fill: 'currentcolor', width: '3rem', height: '3rem', margin: '30px' }} />}
              </Button>
                  </Box>
                </Grid>
              <Grid item xs={12} md={6}>
                <RadioGroup aria-label="signification" name="signification1" value={value} onChange={handleChange}>
                  <FormControlLabel  value={data.mimique2.signification} control={<GreenRadio />} label={data.mimique2.signification} />
                  <FormControlLabel  control={<Radio />} label={data.mimique2.fakeSignification1} />
                  <FormControlLabel  control={<Radio />} label={data.mimique2.fakeSignification2} />
                </RadioGroup>
                </Grid>
                <Grid item xs={12} md={2}>
                <EditButton
                  onClick={() => {
                    router.push('/creer-un-jeu/mimique/2');
                  }}
                  isGreen
                  style={{ position: 'absolute', top: '40%', right: '0.5rem' }}
                />
                </Grid>
            </Grid>
            <h6 style={{ width: '100%', textAlign: 'left', margin: '1rem 0' }}>{data.mimique2.origine} </h6>
          </div>
          {/* Mimique 3 */}
          <div className="preview-block">
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                  <Box display="flex" justifyContent="center" m={0}>
                  <Button name="video" style={{ width: '100%', height:'80%',background: data.mimique3.video ? 'lightgrey' : 'lightgrey' }}>
                  {<UploadIcon style={{ fill: 'currentcolor', width: '3rem', height: '3rem', margin: '30px' }} />}
              </Button>
                  </Box>
                </Grid>
              <Grid item xs={12} md={6}>
                <RadioGroup aria-label="signification" name="signification1" value={value} onChange={handleChange}>
                  <FormControlLabel  value={data.mimique3.signification} control={<GreenRadio />} label={data.mimique3.signification} />
                  <FormControlLabel  control={<Radio />} label={data.mimique3.fakeSignification1} />
                  <FormControlLabel  control={<Radio />} label={data.mimique3.fakeSignification2} />
                </RadioGroup>
                </Grid>
                <Grid item xs={12} md={2}>
                <EditButton
                  onClick={() => {
                    router.push('/creer-un-jeu/mimique/3');
                  }}
                  isGreen
                  style={{ position: 'absolute', top: '40%', right: '0.5rem' }}
                />
                </Grid>
            </Grid>
            <h6 style={{ width: '100%', textAlign: 'left', margin: '1rem 0' }}>{data.mimique3.origine} </h6>
          </div>
         </div>
      </div>
    </Base>
  );
};

export default MimiqueStep4;
