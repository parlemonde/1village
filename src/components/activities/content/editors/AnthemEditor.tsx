import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button, Divider, TextField } from '@mui/material';
import Alert from '@mui/material/Alert';
import { useSnackbar } from 'notistack';
import React from 'react';

import { Modal } from 'src/components/Modal';
import { DeleteButton } from 'src/components/buttons/DeleteButton';
import { EditButton } from 'src/components/buttons/EditButton';
import { UserContext } from 'src/contexts/userContext';
import { fontDetailColor, bgPage } from 'src/styles/variables.const';
import { isValidHttpUrl } from 'src/utils';

export interface AnthemEditorProps {
  value?: string;
  onChange?(newValue: string): void;
  onDelete?(): void;
  onPause?(): void;
  onPlay?(): void;
  setTime?(args: number): void;
  onClose?(idx: number): void;
  idx?: number;
  edit?: boolean;
  audio?: boolean;
}

const AnthemEditorWithRef = (
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
  }: AnthemEditorProps,
  ref?: React.ForwardedRef<HTMLAudioElement | null>,
) => {
  const { axiosLoggedRequest } = React.useContext(UserContext);
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
    (newValue: string) => {
      onChange(newValue);
      setSoundUrl(newValue);
    },
    [onChange, setSoundUrl],
  );

  const uploadSound = async () => {
    setIsModalLoading(true);

    // delete previous uploaded sound, not needed anymore.
    if (prevUpload.current !== null) {
      await axiosLoggedRequest({
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
    const response = await axiosLoggedRequest({
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

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setTime(audioRef.current.duration);
    }
  };

  return (
    <>
      {soundUrl && (
        <>
          <div style={{ display: 'flex' }}>
            <audio
              controls
              src={soundUrl}
              ref={audioRef}
              onPlay={onPlay}
              onPause={onPause}
              onLoadedMetadata={onLoadedMetadata}
              style={{ width: '250px', height: '30px' }}
            >
              <Alert severity="error">{'Erreur: impossible de charger le son.'}</Alert>
            </audio>
            {edit && (
              <EditButton
                style={{ marginLeft: '12px' }}
                size="small"
                onClick={() => {
                  setIsModalOpen(true);
                }}
              />
            )}
            {edit && (
              <DeleteButton
                style={{ marginLeft: '6px' }}
                color="red"
                confirmTitle="Supprimer ce son ?"
                confirmLabel="Voulez-vous vraiment supprimer ce son ?"
                onDelete={onDelete}
              ></DeleteButton>
            )}
          </div>
        </>
      )}
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
        <div style={{ display: 'flex', width: '100%' }}>
          <div style={{ flex: 1, height: '100%', padding: '2rem 0', minWidth: 0 }}>
            <div id={`sound-edit-${idx}-desc`} style={{ marginTop: '2rem' }}>
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
              <Divider style={{ marginTop: '2rem' }} />
              <div className="text-center" style={{ margin: '-0.8rem 0 1.5rem 0' }}>
                <span style={{ backgroundColor: 'white', padding: '0 0.5rem', color: fontDetailColor, fontSize: '1.1rem' }}>Ou</span>
              </div>
              <div className="text-center">
                <Button component="label" variant="outlined" color="secondary" startIcon={<CloudUploadIcon />} style={{ cursor: 'pointer' }}>
                  <>
                    Importer
                    <input ref={inputFile} type="file" multiple={false} accept="audio/*" style={{ display: 'none' }} onChange={onFileSelect} />
                  </>
                </Button>
              </div>
            </div>
          </div>
          <div style={{ flex: '1', padding: '0.5rem', minWidth: 0 }}>
            <div style={{ width: '100%', minHeight: '15rem', backgroundColor: bgPage, padding: '0.5rem' }}>
              <div className="text-center text text--bold" style={{ height: '10%' }}>
                Aperçu
              </div>
              {preview.mode === 1 && (
                <div className="text-center" style={{ margin: '1rem 0' }}>
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
    </>
  );
};

export const AnthemEditor = React.forwardRef(AnthemEditorWithRef);
