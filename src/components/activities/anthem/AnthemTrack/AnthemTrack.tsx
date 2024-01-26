import e from 'express';
import React, { useState } from 'react';

// import EditIcon from '@mui/icons-material/Edit';
import Fingerprint from '@mui/icons-material/Fingerprint';
import PianoIcon from '@mui/icons-material/Piano';
import { Alert, Badge, Button, TextField, Stack, IconButton, Autocomplete, Popper, Fade, Paper, Typography } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import AudioEditor from '../../content/editors/AudioEditor/AudioEditor';
import styles from './AnthemTrack.module.css';
import type { Track } from 'src/activity-types/anthem.types';
import { DeleteButton } from 'src/components/buttons/DeleteButton';
import { EditButton } from 'src/components/buttons/EditButton';

interface AnthemTrackProps {
  track: Track;
  handleTrackUpdate: (track: Track) => void;
}

interface IconType {
  label: string;
  icon: React.ReactElement<IconType>;
}

const instrumentsList: IconType[] = [
  { label: 'guitar', icon: <PianoIcon /> },
  { label: 'drum', icon: <PianoIcon /> },
  { label: 'flute', icon: <PianoIcon /> },
  { label: 'piano', icon: <PianoIcon /> },
  { label: 'trumpet', icon: <PianoIcon /> },
];
const AnthemTrack = ({ track, handleTrackUpdate }: AnthemTrackProps) => {
  const [isEditingLabel, setIsEditingLabel] = React.useState(false);
  const [isAudioEditorOpen, setIsAudioEditorOpen] = React.useState(false);
  const [autocompleteVisible, setAutocompleteVisible] = React.useState(false);
  // const [anchorEl, setAnchorElVisible] = React.useState<null | HTMLElement>(null);
  // const [value, setValue] = React.useState<IconType | null>(null);
  // const [searchValue, setSearchValue] = React.useState('');
  const [open, setOpen] = useState(false);
  const anchorEl = React.useRef(null);
  // const open = Boolean(anchorEl);

  const handleSampleUpdate = (url: string, duration: number) => {
    handleTrackUpdate({ ...track, sampleUrl: url, sampleDuration: duration });
  };

  // const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   setAnchorEl(event.currentTarget);
  //   // setAutocompleteVisible(true);
  // };
  const handleClose = () => {
    // setAnchorElVisible(null);
    setAutocompleteVisible(false);
  };

  // const handleOptionClick = (option: IconType) => {
  //   setValue(option);
  //   handleClose();
  // };

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
                    disablePortal
                    id="combo-box-demo"
                    options={instrumentsList}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Instrument" />}
                    onClick={() => setOpen(!open)}
                  />
                </Paper>
              </Fade>
            )}
          </Popper>
        </Stack>

        {/* <Badge
          badgeContent={<EditIcon />}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        > */}
        {/* <Button
          className={styles.instrumentButton}
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <PianoIcon />
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <TextField
            label="Rechercher"
            variant="outlined"
            fullWidth
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              console.log('e.target.value=', e.target.value);
            }}
            style={{ display: anchorEl ? 'block' : 'none' }}
          />
          {instrumentsList
            .filter((instr) => instr.label.toLowerCase().includes(searchValue.toLowerCase()))
            .map((instr) => (
              <MenuItem key={instr.label} onClick={() => handleOptionClick(instr)}>
                {instr.icon}
                {instr.label}
              </MenuItem>
            ))}
        </Menu> */}
        {/* </Badge> */}
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
