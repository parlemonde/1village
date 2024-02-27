import React from 'react';

import Add from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PianoIcon from '@mui/icons-material/Piano';
import { Alert, Badge, Button, ButtonBase, TextField } from '@mui/material';

import AudioEditor from '../../content/editors/AudioEditor/AudioEditor';
import styles from './AnthemTrack.module.css';
import { DeleteButton } from 'src/components/buttons/DeleteButton';
import { EditButton } from 'src/components/buttons/EditButton';
import type { Track } from 'types/anthem.type';

interface AnthemTrackProps {
  track: Track;
  handleTrackUpdate: (track: Track) => void;
}

const AnthemTrack = ({ track, handleTrackUpdate }: AnthemTrackProps) => {
  const [isEditingLabel, setIsEditingLabel] = React.useState(false);
  const [isAudioEditorOpen, setIsAudioEditorOpen] = React.useState(false);

  const handleSampleUpdate = (url: string, duration: number) => {
    handleTrackUpdate({ ...track, sampleUrl: url, sampleDuration: duration });
  };

  return (
    <div className={styles.trackContainer}>
      <div className={styles.trackPicture}>
        <Badge
          badgeContent={<EditIcon />}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <ButtonBase>
            <PianoIcon /> {/*add choose icon func*/}
          </ButtonBase>
        </Badge>
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
          <Add />
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
              handleSampleUpdate('', 0);
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
