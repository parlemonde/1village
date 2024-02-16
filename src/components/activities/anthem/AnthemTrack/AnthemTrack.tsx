import React, { useState } from 'react';

import PianoIcon from '@mui/icons-material/Piano';
import { Alert, Button, TextField, Stack, IconButton, Autocomplete, Popper, Fade, Paper, Box, Icon, InputAdornment } from '@mui/material';

import AudioEditor from '../../content/editors/AudioEditor/AudioEditor';
import styles from './AnthemTrack.module.css';
import instruments from './instruments';
import type { Track } from 'src/activity-types/anthem.types';
import { DeleteButton } from 'src/components/buttons/DeleteButton';
import { EditButton } from 'src/components/buttons/EditButton';

interface AnthemTrackProps {
  track: Track;
  handleTrackUpdate: (track: Track) => void;
}

const AnthemTrack = ({ track, handleTrackUpdate }: AnthemTrackProps) => {
  const [isEditingLabel, setIsEditingLabel] = React.useState(false);
  const [isAudioEditorOpen, setIsAudioEditorOpen] = React.useState(false);
  const [open, setOpen] = useState(false);
  const anchorEl = React.useRef(null);

  const handleSampleUpdate = (url: string, duration: number) => {
    handleTrackUpdate({ ...track, sampleUrl: url, sampleDuration: duration });
  };

  const currentIcon: string | null = null;

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
                  <Autocomplete
                    id="instruments-list"
                    sx={{ width: 300 }}
                    onClick={() => setOpen(!open)}
                    options={instruments}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    autoHighlight
                    getOptionLabel={(option) => option.name}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > span': { mr: 2, flexShrink: 0 } }} {...props}>
                        <Icon>{option.svg}</Icon>
                        {option.name}
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
                    // onInputChange={(_, value) => {
                    //   currentIcon = value;
                    // }}
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
