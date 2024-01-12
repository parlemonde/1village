import { useSnackbar } from 'notistack';
import React from 'react';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button, Divider, TextField } from '@mui/material';
import Alert from '@mui/material/Alert';

import styles from './AnthemTrackSampleEditor.module.css';
import { Modal } from 'src/components/Modal';
import { isValidHttpUrl } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';

export interface AnthemTrackSampleEditorProps {
  value?: string;
  onChange?(sampleUrl: string): void;
  onDelete?(): void;
  onPause?(): void;
  onPlay?(): void;
  setTime?(args: number): void;
  onClose?(idx: number): void;
  idx?: number;
  edit?: boolean;
  audio?: boolean;
}

const AnthemTrackSampleEditorWithRef = (
  {
    value = '',
    onChange = () => {},
    onDelete = () => {},
    setTime = () => {},
    onClose = () => {},
    onPlay = () => {},
    onPause = () => {},
    idx = 0,
    edit = false,
  }: AnthemTrackSampleEditorProps,
  ref?: React.ForwardedRef<HTMLAudioElement | null>,
) => {
  const { enqueueSnackbar } = useSnackbar();

  const [soundUrl, setSoundUrl] = React.useState(value);

  const [isModalOpen, setIsModalOpen] = React.useState(value === '');
  const [tempSoundUrl, setTempSoundUrl] = React.useState('');

  const [preview, setPreview] = React.useState<{ url: string; mode: number }>({
    url: '',
    mode: 0,
  }); // 0 no preview, 1: preview, 2: error
  const [isModalLoading, setIsModalLoading] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const inputFile = React.useRef<HTMLInputElement>(null);
  const prevUpload = React.useRef<string | null>(null);

  const localRef = React.useRef<HTMLAudioElement | null>(null);
  const audioRef = ref !== undefined && ref !== null && typeof ref !== 'function' ? ref : localRef;

  const prevIsModalOpen = React.useRef<boolean | null>(null);
  React.useEffect(() => {
    if (isModalOpen && isModalOpen !== prevIsModalOpen.current && value) {
      setTempSoundUrl(value);
      setPreview({
        mode: 1,
        url: value,
      });
    }
    prevIsModalOpen.current = isModalOpen;
  }, [isModalOpen, value]);

  const onChangeSound = React.useCallback(
    (sampleUrl: string) => {
      onChange(sampleUrl);
      setSoundUrl(sampleUrl);
    },
    [onChange, setSoundUrl],
  );

  const uploadSound = async () => {
    setIsModalLoading(true);

    // delete previous uploaded sound, not needed anymore.
    if (prevUpload.current !== null) {
      await axiosRequest({
        method: 'DELETE',
        url: prevUpload.current.slice(4),
      });
    }

    const formData = new FormData();
    if (file === null) {
      setIsModalLoading(false);
      return;
    }
    formData.append('audio', file);
    const response = await axiosRequest({
      method: 'POST',
      url: '/audios',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.error) {
      onChangeSound('');
      prevUpload.current = null;
      enqueueSnackbar('Une erreur est survenue...', {
        variant: 'error',
      });
    } else {
      onChangeSound(response.data.url);
      prevUpload.current = response.data.url || null;
      if (!response.data.url) {
        enqueueSnackbar('Une erreur est survenue...', {
          variant: 'error',
        });
      }
    }
    setIsModalLoading(false);
  };

  const displayPreview = () => {
    setPreview({
      mode: 1,
      url: tempSoundUrl,
    });
  };
  const resetPreview = () => {
    setPreview({
      mode: 0,
      url: '',
    });
  };

  const onFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const filesArr = Array.prototype.slice.call(files) as File[];
    if (filesArr.length > 0) {
      setFile(filesArr[0]);
      setTempSoundUrl(URL.createObjectURL(filesArr[0]));
      setPreview({
        mode: 1,
        url: URL.createObjectURL(filesArr[0]),
      });
    } else {
      setFile(null);
      setTempSoundUrl('');
      resetPreview();
    }
  };

  return (
    <Modal
      open={isModalOpen}
      fullWidth
      noCloseOutsideModal
      maxWidth="md"
      title="Choisir un son"
      confirmLabel="Choisir"
      onConfirm={async () => {
        if (file !== null) {
          await uploadSound();
        } else {
          onChangeSound(tempSoundUrl);
        }
        setIsModalOpen(false);
        resetPreview();
      }}
      onClose={() => {
        onClose(idx);
        console.log('GO ON CLOSE');
        setIsModalOpen(false);
        resetPreview();
        if (soundUrl.length === 0) {
          onDelete();
        }
      }}
      loading={isModalLoading}
      disabled={preview.mode !== 1}
      ariaLabelledBy={`sound-edit-${idx}`}
      ariaDescribedBy={`sound-edit-${idx}-desc`}
    >
      <div className={styles.editorContentContainer}>
        <div className={styles.dataSelectionContainer}>
          <div id={`sound-edit-${idx}-desc`} className={styles.dataSelectionContent}>
            <TextField
              label="Entrez l'URL du son"
              variant="outlined"
              color="secondary"
              fullWidth
              value={file === null ? tempSoundUrl : ''}
              onBlur={() => {
                if (isValidHttpUrl(tempSoundUrl)) {
                  displayPreview();
                } else {
                  resetPreview();
                }
              }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                if (file !== null) {
                  setFile(null);
                  resetPreview();
                  if (inputFile.current) {
                    inputFile.current.value = '';
                  }
                }
                setTempSoundUrl(event.target.value);
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
                  <input ref={inputFile} type="file" multiple={false} accept="audio/*" onChange={onFileSelect} />
                </>
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.dataPreviewContainer}>
          <div className={styles.dataPreviewContent}>
            <div className={styles.dataPreviewContentTitle}>Aperçu</div>
            {preview.mode === 1 && (
              <div className={styles.sampleControlsContainer}>
                <audio controls src={preview.url}>
                  <Alert severity="error">{'Erreur: impossible de charger le son.'}</Alert>
                </audio>
              </div>
            )}
            {preview.mode === 2 && <Alert severity="error">{'Erreur: impossible de charger le son.'}</Alert>}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export const AnthemTrackSampleEditor = React.forwardRef(AnthemTrackSampleEditorWithRef);
