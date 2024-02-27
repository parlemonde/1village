import React, { useState } from 'react';

import { Alert, Button, TextField, IconButton, Autocomplete, Popper, Fade, Paper, Box, Icon } from '@mui/material';

import AudioEditor from '../../content/editors/AudioEditor/AudioEditor';
import styles from './AnthemTrack.module.css';
import { InstrumentSvg } from './InstrumentSvg';
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
  const [currentIcon, setCurrentIcon] = useState(<InstrumentSvg instrumentName={'accordion'} />);
  const anchorEl = React.useRef(null);

  const handleSampleUpdate = (url: string, duration: number) => {
    handleTrackUpdate({ ...track, sampleUrl: url, sampleDuration: duration });
  };

  return (
    <div className={styles.trackContainer}>
      <div className={styles.trackContainer}>
        <div className={styles.trackPicture}>
          <IconButton aria-label="fingerprint" color="primary" ref={anchorEl} onClick={() => setOpen(!open)}>
            {currentIcon}
          </IconButton>
          {/* TODO change scrollbar aspect */}
          <Popper open={open} anchorEl={anchorEl.current} placement={'bottom-start'} transition>
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper>
                  <Box className={styles.autocompleteList}>
                    <Autocomplete
                      id="instruments-list"
                      className={styles.autocompleteBox}
                      sx={{ width: 300 }}
                      disablePortal
                      options={instruments}
                      isOptionEqualToValue={(option, value) => option.name === value.name}
                      autoHighlight
                      getOptionLabel={(option) => option.name}
                      open={open}
                      onClose={() => setOpen(false)}
                      PopperComponent={({ children, ...popperProps }) => (
                        <div {...popperProps} style={{ position: 'absolute', top: '100%', left: 0, width: '100%', zIndex: 1 }}>
                          {children}
                        </div>
                      )}
                      PaperComponent={({ children, ...paperProps }) => (
                        <div {...paperProps} className={styles.paperComp}>
                          {children}
                        </div>
                      )}
                      renderOption={(props, option) => (
                        <Box
                          className={styles.instrumentList}
                          component="li"
                          sx={{ '& > span': { mr: 2, flexShrink: 0 } }}
                          {...props}
                          onClick={() => {
                            setOpen(false);
                            setCurrentIcon(<InstrumentSvg instrumentName={option.value} />);
                            handleTrackUpdate({ ...track, iconUrl: <InstrumentSvg instrumentName={option.value} /> });
                          }}
                        >
                          <div className={styles.iconList}>
                            <Icon>
                              {/* <InstrumentSvg instrumentName={option.value} /> */}
                              {currentIcon}
                            </Icon>
                          </div>
                          {option.name}
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          label="Instruments"
                          placeholder=""
                          autoFocus
                          InputProps={{
                            ...params.InputProps,
                            style: {
                              border: '1px solid #ccc',
                              padding: '8px',
                              borderRadius: '4px',
                            },
                            startAdornment: <>{params.InputProps.startAdornment}</>,
                          }}
                        />
                      )}
                    />
                  </Box>
                </Paper>
              </Fade>
            )}
          </Popper>
        </div>
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
