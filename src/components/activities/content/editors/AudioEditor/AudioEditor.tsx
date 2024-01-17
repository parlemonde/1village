import { useSnackbar } from 'notistack';
import React from 'react';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button, Divider, TextField } from '@mui/material';
import Alert from '@mui/material/Alert';

import styles from './AudioEditor.module.css';
import type { Track } from 'src/activity-types/anthem.types';
import { Modal } from 'src/components/Modal';
import { isValidHttpUrl } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';

export interface AudioEditorProps {
  track: Track;
  handleSampleUrlUpdate: (url: string) => void;
}

const AudioEditor = ({ track, handleSampleUrlUpdate }: AudioEditorProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const [isModalLoading, setIsModalLoading] = React.useState(false);

  const [tempSampleUrl, setTempSampleUrl] = React.useState('');
  const [tempSampleFile, setTempSampleFile] = React.useState<File | null>(null);

  const uploadSound = async () => {
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
    }
    setIsModalLoading(false);
  };

  const onFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const filesArr = Array.prototype.slice.call(files) as File[];
    if (filesArr.length > 0) {
      setTempSampleFile(filesArr[0]);
      setTempSampleUrl(URL.createObjectURL(filesArr[0]));
    } else {
      setTempSampleFile(null);
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
        if (tempSampleFile) await uploadSound();
        handleSampleUrlUpdate(tempSampleUrl);
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
              value={tempSampleFile ? '' : tempSampleUrl}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                if (tempSampleFile) setTempSampleFile(null);
                setTempSampleUrl(event.target.value);
              }}
            />
            <Divider style={{ marginTop: '2rem' }} /> {/*style from class don't work, write inline-style*/}
            <div className={styles.dataSelectionContentDivider}>
              <span>Ou</span>
            </div>
            <div className={styles.importButtonWrapper}>
              <Button component="label" variant="outlined" color="secondary" startIcon={<CloudUploadIcon />}>
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
                <audio controls src={tempSampleUrl}>
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
