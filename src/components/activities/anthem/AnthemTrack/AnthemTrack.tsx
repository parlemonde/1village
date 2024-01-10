import React from 'react';

import EditIcon from '@mui/icons-material/Edit';
import PianoIcon from '@mui/icons-material/Piano';
import { Badge, Button, ButtonBase, TextField } from '@mui/material';

import { AnthemTrackSampleEditor } from '../../content/editors/AnthemTrackSampleEditor';
import styles from './AnthemTrack.module.css';
import type { Track } from 'src/activity-types/anthem.types';

interface AnthemTrackProps {
  id: number;
  track: Track;
  updateTrackInActivity: (id: number, track: Track) => void;
}

const AnthemTrack = ({ id, track, updateTrackInActivity }: AnthemTrackProps) => {
  const [isEditingLabel, setIsEditingLabel] = React.useState(false);
  const [isAnthemTrackSampleEditorModalOpen, setIsAnthemTrackSampleEditorModalOpen] = React.useState(false);

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

      {!track.sampleUrl && (
        <Button
          onClick={() => {
            setIsAnthemTrackSampleEditorModalOpen(true);
          }}
          variant="text"
          endIcon={<div></div>}
        >
          Ajouter un son
        </Button>
      )}
      {isAnthemTrackSampleEditorModalOpen && (
        <AnthemTrackSampleEditor
          value={track.sampleUrl}
          edit
          //   setTime={(time) => {
          //     setTimes({ ...times, [editingSampleIndex]: time });
          //   }}
          onChange={updateTrackInActivity}
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
