import { useSnackbar } from 'notistack';
import React from 'react';

import { Button, Divider, TextField } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Alert } from '@material-ui/lab';

import { Modal } from 'src/components/Modal';
import { UserContext } from 'src/contexts/userContext';
import { fontDetailColor, bgPage, primaryColor } from 'src/styles/variables.const';
import { isValidHttpUrl } from 'src/utils';

import type { EditorProps } from '../content.types';

import { EditorContainer } from './EditorContainer';

export const SoundEditor: React.FC<EditorProps> = ({ id, value = '', onChange = () => {}, onDelete = () => {} }: EditorProps) => {
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

  return (
    <EditorContainer
      deleteButtonProps={{
        confirmLabel: 'Voulez-vous vraiment supprimer ce son ?',
        confirmTitle: 'Supprimer',
        onDelete,
      }}
      className="image-editor"
    >
      {soundUrl && (
        <>
          <div
            className="text-center"
            style={{
              padding: '1rem',
              borderRight: `1px dashed ${primaryColor}`,
            }}
          >
            <audio controls src={soundUrl}>
              <Alert severity="error">{'Erreur: impossible de charger le son.'}</Alert>
            </audio>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button
              variant="outlined"
              size="small"
              color="primary"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              {'Changer de son'}
            </Button>
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
          setIsModalOpen(false);
          resetPreview();
          if (soundUrl.length === 0) {
            onDelete();
          }
        }}
        loading={isModalLoading}
        disabled={preview.mode !== 1}
        ariaLabelledBy={`sound-edit-${id}`}
        ariaDescribedBy={`sound-edit-${id}-desc`}
      >
        <div style={{ display: 'flex', width: '100%' }}>
          <div style={{ flex: 1, height: '100%', padding: '2rem 0', minWidth: 0 }}>
            <div id={`sound-edit-${id}-desc`} style={{ marginTop: '2rem' }}>
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
    </EditorContainer>
  );
};
