import React from 'react';

import EditIcon from '@mui/icons-material/Edit';
import PianoIcon from '@mui/icons-material/Piano';
import { Badge, Button, ButtonBase, TextField } from '@mui/material';

import styles from './AnthemTrack.module.css';
import type { Track } from 'src/activity-types/anthem.types';
// import { AnthemSampleEditor } from 'src/components/activities/content/editors/AnthemSampleEditor/AnthemSampleEditor';

interface AnthemTrackProps {
  id: number;
  track: Track;
  updateTrackInActivity: (id: number, track: Track) => void;
}

const AnthemTrack = () => {
  const [isEditingLabel, setIsEditingLabel] = React.useState(false);
  const [isAnthemSampleEditorModalOpen, setIsAnthemSampleEditorModalOpen] = React.useState(false);

  return (
    //     <div className={styles.sampleContainer}>
    //       <div className={styles.samplePicture}>
    //         <Badge
    //           badgeContent={<EditIcon />}
    //           anchorOrigin={{
    //             vertical: 'bottom',
    //             horizontal: 'right',
    //           }}
    //         >
    //           <ButtonBase>
    //             <PianoIcon /> {/*add choose icon func*/}
    //           </ButtonBase>
    //         </Badge>
    //       </div>

    //       <div className={styles.sampleLabel}>
    //         {isEditingLabel ? (
    //           <TextField
    //             defaultValue={track.label}
    //             onBlur={(e) => {
    //               setIsEditingLabel(false);
    //               if (e.target.value.length > 0) updateTrackInActivity(id, { ...track, label: e.target.value });
    //             }}
    //             autoFocus
    //           ></TextField>
    //         ) : (
    //           <span onClick={() => setIsEditingLabel(true)}>{track.label}</span>
    //         )}
    //       </div>

    //       {!track.sampleUrl && (
    //         <Button />
    //           onClick={() => {
    //             handleAddSample(id);
    //           }}
    //           variant="text"
    //           endIcon={<div></div>}
    //         >
    //           Ajouter un son
    //         </Button>
    //       )}
    //       {isAnthemSampleEditorModalOpen && (
    //         <AnthemSampleEditor
    //           value={track.sampleUrl}
    //           edit
    //           setTime={(time) => {
    //             setTimes({ ...times, [editingSampleIndex]: time });
    //           }}
    //           onChange={updateSample}
    //           onDelete={() => {
    //             onUpdateVerseAudios(editingSampleIndex)('');
    //           }}
    //           onClose={() => {
    //             setEditingSampleIndex(null);
    //             setIsAnthemEditorModalOpen(false);
    //           }}
    //         />
    //       )}
    //     </div>
    <div>OKAY</div>
  );
};

export default AnthemTrack;
