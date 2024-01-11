import React from 'react';

import EditIcon from '@mui/icons-material/Edit';
import PianoIcon from '@mui/icons-material/Piano';
import { Alert, Badge, Button, ButtonBase, TextField } from '@mui/material';

import { AnthemTrackSampleEditor } from '../../content/editors/AnthemTrackSampleEditor';
import styles from './AnthemTrack.module.css';
import type { Track } from 'src/activity-types/anthem.types';
import { DeleteButton } from 'src/components/buttons/DeleteButton';
import { EditButton } from 'src/components/buttons/EditButton';

interface AnthemTrackProps {
  id: number;
  track: Track;
  updateTrackInActivity: (id: number, track: Track) => void;
}

const AnthemTrack = ({ id, track, updateTrackInActivity }: AnthemTrackProps) => {
  const [isEditingLabel, setIsEditingLabel] = React.useState(false);
  const [isAnthemTrackSampleEditorModalOpen, setIsAnthemTrackSampleEditorModalOpen] = React.useState(false);

  const handleAddSampleUrl = (url: string) => {
    updateTrackInActivity(id, { ...track, sampleUrl: url });
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
              if (e.target.value.length > 0) updateTrackInActivity(id, { ...track, label: e.target.value });
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
            setIsAnthemTrackSampleEditorModalOpen(true);
          }}
          variant="text"
          endIcon={<div></div>}
        >
          Ajouter un son
        </Button>
      ) : (
        <div style={{ display: 'flex' }}>
          <audio controls src={track.sampleUrl} style={{ width: '250px', height: '30px' }}>
            <Alert severity="error">{'Erreur: impossible de charger le son.'}</Alert>
          </audio>
          <EditButton //add edit condition ??
            style={{ marginLeft: '12px' }}
            size="small"
            onClick={() => {
              setIsAnthemTrackSampleEditorModalOpen(true);
            }}
          />
          <DeleteButton
            style={{ marginLeft: '6px' }}
            color="red"
            confirmTitle="Supprimer ce son ?"
            confirmLabel="Voulez-vous vraiment supprimer ce son ?"
            onDelete={() => {
              updateTrackInActivity(id, { ...track, sampleUrl: '' });
              setIsAnthemTrackSampleEditorModalOpen(false);
            }}
          />
        </div>
      )}
      {isAnthemTrackSampleEditorModalOpen && (
        <AnthemTrackSampleEditor
          value={track.sampleUrl}
          edit
          //   setTime={(time) => {
          //     setTimes({ ...times, [editingSampleIndex]: time });
          //   }}
          onChange={handleAddSampleUrl}
          onDelete={() => {
            updateTrackInActivity(id, { ...track, sampleUrl: '' });
          }}
          onClose={() => {
            setIsAnthemTrackSampleEditorModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default AnthemTrack;
