import React, { useState } from 'react';

import PianoIcon from '@mui/icons-material/Piano';
import { Alert, Button, TextField, Stack, IconButton, Autocomplete, Popper, Fade, Paper, Box, InputAdornment } from '@mui/material';
import Icon from '@mui/material/Icon';

import AudioEditor from '../../content/editors/AudioEditor/AudioEditor';
// import accordion from './../../../../svg/anthem/instruments/accordion.svg';
// import alboka from './../../../../svg/anthem/instruments/alboka.svg';
// import altoClarinet from './../../../../svg/anthem/instruments/alto_clarinet.svg';
// import altoSarrusophone from './../../../../svg/anthem/instruments/alto_sarrusophone.svg';
import styles from './AnthemTrack.module.css';
// import instruments from './instruments';
import type { Track } from 'src/activity-types/anthem.types';
import { DeleteButton } from 'src/components/buttons/DeleteButton';
import { EditButton } from 'src/components/buttons/EditButton';

interface AnthemTrackProps {
  track: Track;
  handleTrackUpdate: (track: Track) => void;
}

// export type InstrumentsType = {
//   name: string;
//   svg?: SVGElement;
// };
const allMUIIcons = [
  {
    label: '10k',
    code: '10k e951',
  },
  {
    label: '10mp',
    code: '10mp e952',
  },
  {
    label: '11mp',
    code: '11mp e953',
  },
  {
    label: '123',
    code: '123 eb8d',
  },
];

const AnthemTrack = ({ track, handleTrackUpdate }: AnthemTrackProps) => {
  const [isEditingLabel, setIsEditingLabel] = React.useState(false);
  const [isAudioEditorOpen, setIsAudioEditorOpen] = React.useState(false);
  const [open, setOpen] = useState(false);
  const anchorEl = React.useRef(null);

  const handleSampleUpdate = (url: string, duration: number) => {
    handleTrackUpdate({ ...track, sampleUrl: url, sampleDuration: duration });
  };

  // const instrumentsName = instruments.map((instrument) => {
  //   return instrument.name;
  // });
  // const instrumentIcon = instruments.map((instrument) => {
  //   return instrument.svg;
  // });
  let currentIcon: string | null = null;

  return (
    <div className={styles.trackContainer}>
      <div className={styles.trackPicture}>
        <Stack direction="row" spacing={1}>
          <IconButton aria-label="fingerprint" color="primary" onClick={() => setOpen(!open)} ref={anchorEl}>
            <PianoIcon />
          </IconButton>
          <Popper open={open} anchorEl={anchorEl.current} transition placement={'bottom-start'}>
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper>
                  {/* <Autocomplete
                    id="search"
                    options={instrumentsName}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Instrument" />}
                  /> */}
                  {/* <Autocomplete
                    id="instruments-list"
                    sx={{ width: 300 }}
                    options={allMUIIcons}
                    isOptionEqualToValue={(option, value) => option.label === value.label}
                    autoHighlight
                    getOptionLabel={(option) => option.label}
                    defaultValue={{ label: 'instruments', code: '10k e951' }}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > span': { mr: 2, flexShrink: 0 } }} {...props}>
                        <Icon>{option.code}</Icon>
                        {option.label}
                      </Box>
                    )}
                    renderInput={(params) => {
                      return (
                        <TextField
                          {...params}
                          variant="standard"
                          label="Recherche"
                          placeholder="Selectionner un instrument"
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                <InputAdornment position="start">
                                  <Icon>{currentIcon}</Icon>
                                </InputAdornment>
                                {params.InputProps.startAdornment}
                              </>
                            ),
                          }}
                        />
                      );
                    }}
                    onInputChange={(_, value) => {
                      currentIcon = value;
                    }}
                  /> */}
                  <Autocomplete
                    id="icon-select-demo"
                    sx={{ width: 300 }}
                    options={allMUIIcons}
                    isOptionEqualToValue={(option, value) => option.code === value.code}
                    autoHighlight
                    getOptionLabel={(option) => option.label}
                    defaultValue={{ label: 'sell', code: 'sell f05b' }}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > span': { mr: 2, flexShrink: 0 } }} {...props} key={option.code}>
                        <Icon>{option.code}</Icon>
                        {option.label}
                      </Box>
                    )}
                    renderInput={(params) => {
                      return (
                        <TextField
                          {...params}
                          variant="standard"
                          label="Icon Selector"
                          placeholder="Select an icon..."
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                <InputAdornment position="start">
                                  <Icon>{currentIcon}</Icon>
                                </InputAdornment>
                                {params.InputProps.startAdornment}
                              </>
                            ),
                          }}
                        />
                      );
                    }}
                    onInputChange={(_, value) => {
                      // Update the icon at the start of the input field
                      // (currentIcon is used to render the startAdornment)
                      currentIcon = value;
                    }}
                  />
                </Paper>
              </Fade>
            )}
          </Popper>
        </Stack>
      </div>

      <div className={styles.trackLabel}>
        {isEditingLabel ? (
          <TextField
            defaultValue={track.label}
            onBlur={(e) => {
              setIsEditingLabel(false);
              if (e.target.value.length > 0) handleTrackUpdate({ ...track, label: e.target.value });
            }}
            autoFocus
          ></TextField>
        ) : (
          <span onClick={() => setIsEditingLabel(true)}>{track.label}</span>
        )}
      </div>

      {!track.sampleUrl ? (
        <Button
          onClick={() => {
            setIsAudioEditorOpen(true);
          }}
          variant="text"
          endIcon={<div></div>}
        >
          Ajouter un son
        </Button>
      ) : (
        <div className={styles.sampleControlsContainer}>
          <audio controls src={track.sampleUrl} className={styles.sampleAudioControl}>
            <Alert severity="error">{'Erreur: impossible de charger le son.'}</Alert>
          </audio>
          <EditButton //add edit condition ??
            size="small"
            onClick={() => {
              setIsAudioEditorOpen(true);
            }}
          />
          <DeleteButton
            color="red"
            confirmTitle="Supprimer ce son ?"
            confirmLabel="Voulez-vous vraiment supprimer ce son ?"
            onDelete={() => {
              handleTrackUpdate({ ...track, sampleUrl: '' });
              setIsAudioEditorOpen(false);
            }}
          />
        </div>
      )}
      {isAudioEditorOpen && <AudioEditor track={track} handleSampleUpdate={handleSampleUpdate} setIsAudioEditorOpen={setIsAudioEditorOpen} />}
    </div>
  );
};

export default AnthemTrack;
