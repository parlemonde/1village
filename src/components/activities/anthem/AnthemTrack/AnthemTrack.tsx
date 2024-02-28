import React from 'react';

import { Alert, Button, TextField } from '@mui/material';

import AudioEditor from '../../content/editors/AudioEditor/AudioEditor';
import styles from './AnthemTrack.module.css';
import AnthemTrackIcon from './AnthemTrackIcon';
import type { DisplayableInstrumentsType } from './instruments';
import type { Track } from 'src/activity-types/anthem.types';
import { DeleteButton } from 'src/components/buttons/DeleteButton';
import { EditButton } from 'src/components/buttons/EditButton';

interface AnthemTrackProps {
  track: Track;
  instruments: DisplayableInstrumentsType[];
  handleTrackUpdate: (track: Track) => void;
}

const AnthemTrack = ({ track, instruments, handleTrackUpdate }: AnthemTrackProps) => {
  const [isEditingLabel, setIsEditingLabel] = React.useState(false);
  const [isAudioEditorOpen, setIsAudioEditorOpen] = React.useState(false);

  const handleSampleUpdate = (url: string, duration: number) => {
    handleTrackUpdate({ ...track, sampleUrl: url, sampleDuration: duration });
  };

  const handleIconUpdate = (track: Track, iconUrl: string) => {
    handleTrackUpdate({ ...track, iconUrl });
  };

  return (
    <div className={styles.trackContainer}>
      <div className={styles.trackContainer}>
        <AnthemTrackIcon track={track} handleIconUpdate={handleIconUpdate} instruments={instruments} />
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
