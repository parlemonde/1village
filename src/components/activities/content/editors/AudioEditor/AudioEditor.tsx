import { useSnackbar } from 'notistack';
import React from 'react';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button, Divider, TextField } from '@mui/material';
import Alert from '@mui/material/Alert';

import styles from './AudioEditor.module.css';
import { Modal } from 'src/components/Modal';
import { isValidHttpUrl } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';
import type { Track } from 'types/anthem.type';

export interface AudioEditorProps {
  track: Track;
  handleSampleUpdate: (url: string, duration: number) => void;
  setIsAudioEditorOpen: (value: boolean) => void;
}

const AudioEditor = ({ track, handleSampleUpdate, setIsAudioEditorOpen }: AudioEditorProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const [isModalLoading, setIsModalLoading] = React.useState(false);

  const [tempSampleUrl, setTempSampleUrl] = React.useState(track.sampleUrl || '');
  const [tempSampleDuration, setTempSampleDuration] = React.useState(track.sampleDuration || 0);
  const [tempSampleFile, setTempSampleFile] = React.useState<File | null>(null);

  const uploadSampleFile = async () => {
    setIsModalLoading(true);

    const formData = new FormData();
    if (!tempSampleFile) {
      setIsModalLoading(false);
      return;
    }

    formData.append('audio', tempSampleFile);
    const response = await axiosRequest({
      method: 'POST',
      url: '/audios',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.error || !response.data.url) {
      enqueueSnackbar('Une erreur est survenue...', {
        variant: 'error',
      });
    } else if (response.data.url) {
      handleSampleUpdate(response.data.url, tempSampleDuration);
    }
  };

  const onFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const filesArr = Array.prototype.slice.call(files) as File[];
    if (filesArr.length > 0) {
      setTempSampleFile(filesArr[0]);
      setTempSampleUrl(URL.createObjectURL(filesArr[0]));
    } else {
      setTempSampleUrl('');
    }
  };

  return (
    <Modal
      open={true}
      fullWidth
      noCloseOutsideModal
      maxWidth="md"
      title="Choisir un son"
      confirmLabel="Choisir"
      onConfirm={async () => {
        tempSampleFile ? await uploadSampleFile() : handleSampleUpdate(tempSampleUrl, tempSampleDuration);
        setIsAudioEditorOpen(false);
      }}
      onClose={() => {
        if (!track.sampleUrl) handleSampleUpdate('', 0);
        setIsAudioEditorOpen(false);
      }}
      loading={isModalLoading}
      disabled={!tempSampleUrl}
      ariaLabelledBy={`sound-edit`}
      ariaDescribedBy={`sound-edit-desc`}
    >
      <div className={styles.editorContentContainer}>
        <div className={styles.dataSelectionContainer}>
          <div id={`sound-edit-desc`} className={styles.dataSelectionContent}>
            <TextField
              label="Entrez l'URL du son"
              variant="outlined"
              color="secondary"
              fullWidth
              defaultValue={track.sampleUrl || ''}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                if (isValidHttpUrl(event.target.value)) {
                  if (tempSampleFile) setTempSampleFile(null);
                  setTempSampleUrl(event.target.value);
                }
              }}
            />
            <Divider style={{ marginTop: '2rem' }} /> {/*style from class don't work, write inline-style*/}
            <div className={styles.dataSelectionContentDivider}>
              <span>Ou</span>
            </div>
            <div className={styles.importButtonWrapper}>
              <Button component="label" variant="outlined" color="secondary" startIcon={<CloudUploadIcon />} style={{ cursor: 'pointer' }}>
                <>
                  Importer
                  <input type="file" multiple={false} accept="audio/*" onChange={onFileSelect} />
                </>
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.dataPreviewContainer}>
          <div className={styles.dataPreviewContent}>
            <div className={styles.dataPreviewContentTitle}>Aperçu</div>
            {tempSampleUrl && (
              <div className={styles.sampleControlsContainer}>
                <audio controls src={tempSampleUrl} onLoadedMetadata={(e) => setTempSampleDuration(e.currentTarget.duration)}>
                  <Alert severity="error">{'Erreur: impossible de charger le son.'}</Alert>
                </audio>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AudioEditor;
