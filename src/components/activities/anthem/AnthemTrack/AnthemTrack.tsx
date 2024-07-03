import React from 'react';

import { Alert, Box, TextField } from '@mui/material';

import type { DisplayableInstrumentsType } from '../../../../utils/instruments';
import AudioEditor from '../../content/editors/AudioEditor/AudioEditor';
import AnthemTrackIcon from '../AnthemTrackIcon/AnthemTrackIcon';
import AddAudioButton from 'src/components/buttons/AddAudioButton';
import { DeleteButton } from 'src/components/buttons/DeleteButton';
import { EditButton } from 'src/components/buttons/EditButton';
import type { Track } from 'types/anthem.type';

interface AnthemTrackProps {
  track: Track;
  instruments: DisplayableInstrumentsType[];
  handleTrackUpdate: (track: Track) => void;
}

const AnthemTrack = ({ track, instruments, handleTrackUpdate }: AnthemTrackProps) => {
  const [isEditingLabel, setIsEditingLabel] = React.useState(false);
  const [isAudioEditorOpen, setIsAudioEditorOpen] = React.useState(false);

  const handleSampleUpdate = (url: string, duration?: number) => {
    handleTrackUpdate({ ...track, sampleUrl: url, sampleDuration: duration || 0 });
  };

  const handleIconUpdate = (track: Track, iconUrl: string) => {
    handleTrackUpdate({ ...track, iconUrl });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: {
          xs: track.sampleUrl ? 'column' : 'row',
          sm: 'row',
        },
        alignItems: {
          xs: track.sampleUrl ? 'start' : 'center',
          sm: 'center',
        },
        justifyContent: 'space-between',
        marginBottom: '10px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginBottom: {
            xs: track.sampleUrl && '10px',
            sm: '0',
          },
        }}
      >
        <AnthemTrackIcon track={track} handleIconUpdate={handleIconUpdate} instruments={instruments} />
        <div style={{ marginLeft: '10px' }}>
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
      </Box>

      {!track.sampleUrl ? (
        <AddAudioButton onClick={() => setIsAudioEditorOpen(true)} />
      ) : (
        <div style={{ display: 'flex' }}>
          <Box component="audio" controls src={'track.sampleUrl'} sx={{ width: { xs: '220px', sm: '250px', md: '300px' }, height: '30px' }}>
            <Alert sx={{ padding: '0 16px' }} severity="error">
              {'Erreur: impossible de charger le son.'}
            </Alert>
          </Box>
          <EditButton //add edit condition ??
            style={{ marginLeft: '6px' }}
            size="small"
            onClick={() => {
              setIsAudioEditorOpen(true);
            }}
          />
          <DeleteButton
            style={{ marginLeft: '6px' }}
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
      {isAudioEditorOpen && (
        <AudioEditor
          sampleUrl={track.sampleUrl}
          sampleDuration={track.sampleDuration}
          handleSampleUpdate={handleSampleUpdate}
          setIsAudioEditorOpen={setIsAudioEditorOpen}
        />
      )}
    </Box>
  );
};

export default AnthemTrack;
