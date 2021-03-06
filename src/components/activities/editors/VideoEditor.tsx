import Link from 'next/link';
import { useSnackbar } from 'notistack';
import ReactPlayer from 'react-player';
import { useQueryCache } from 'react-query';
import React from 'react';

import { Button, Divider, TextField } from '@material-ui/core';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SettingsIcon from '@material-ui/icons/Settings';
import { Alert } from '@material-ui/lab';

import { Modal } from 'src/components/Modal';
import { UserContext } from 'src/contexts/userContext';
import { useCopy } from 'src/hooks/useCopy';
import { primaryColor } from 'src/styles/variables.const';
import { fontDetailColor, bgPage } from 'src/styles/variables.const';
import { isValidHttpUrl } from 'src/utils';

import type { EditorProps } from '../editing.types';

import { EditorContainer } from './EditorContainer';

export const VideoEditor: React.FC<EditorProps> = ({ id, value = '', onChange = () => {}, onDelete = () => {} }: EditorProps) => {
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const queryCache = useQueryCache();
  const { enqueueSnackbar } = useSnackbar();
  const { copyText } = useCopy();
  const [videoUrl, setVideoUrl] = React.useState(value);
  const [tempVideoUrl, setTempVideoUrl] = React.useState('');
  const [name, setName] = React.useState('');
  const [preview, setPreview] = React.useState<{ url: string; mode: number }>({
    url: '',
    mode: 0,
  }); // 0 no preview, 1: preview, 2: error
  const [isModalOpen, setIsModalOpen] = React.useState(value === '');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [progress, setProgress] = React.useState(-1);
  const [file, setFile] = React.useState<File | null>(null);
  const inputFile = React.useRef<HTMLInputElement>(null);

  // On value change, update image.
  const prevValue = React.useRef(value);
  React.useEffect(() => {
    if (prevValue.current !== value) {
      prevValue.current = value;
      setVideoUrl(value);
    }
  }, [value]);

  const displayPreview = async () => {
    if (ReactPlayer.canPlay(tempVideoUrl)) {
      setPreview({
        mode: 1,
        url: tempVideoUrl,
      });
    } else {
      setPreview({
        mode: 2,
        url: '',
      });
    }
  };
  const resetPreview = () => {
    setPreview({
      mode: 0,
      url: '',
    });
  };

  const onChangeVideo = React.useCallback(
    (newValue: string) => {
      prevValue.current = newValue;
      onChange(newValue);
      setVideoUrl(newValue);
    },
    [onChange],
  );

  const onFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const filesArr = Array.prototype.slice.call(files) as File[];
    if (filesArr.length > 0) {
      setFile(filesArr[0]);
      setTempVideoUrl(URL.createObjectURL(filesArr[0]));
      setPreview({
        mode: 1,
        url: URL.createObjectURL(filesArr[0]),
      });
    } else {
      setFile(null);
      setTempVideoUrl('');
      resetPreview();
    }
  };

  const uploadVideo = async () => {
    if (file === null) {
      return;
    }
    setProgress(0);
    const formData = new FormData();
    formData.append('video', file);
    formData.append('name', name);
    const response = await axiosLoggedRequest({
      method: 'POST',
      url: '/videos',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress(progressEvent) {
        const totalLength = progressEvent.lengthComputable
          ? progressEvent.total
          : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
        if (totalLength !== null) {
          setProgress(Math.round((progressEvent.loaded * 100) / totalLength));
        }
      },
    });
    if (response.error) {
      onChangeVideo('');
      enqueueSnackbar('Une erreur est survenue...', {
        variant: 'error',
      });
    } else {
      onChangeVideo(response.data.url);
      if (!response.data.url) {
        enqueueSnackbar('Une erreur est survenue...', {
          variant: 'error',
        });
      } else {
        queryCache.invalidateQueries('videos');
        setIsSuccessModalOpen(true);
      }
    }
    setProgress(-1);
    setName('');
  };

  return (
    <EditorContainer
      deleteButtonProps={{
        confirmLabel: 'Voulez-vous vraiment supprimer cette vidéo ?',
        confirmTitle: 'Supprimer',
        onDelete,
      }}
      className="image-editor"
    >
      {videoUrl && (
        <>
          <div className="text-center" style={{ height: '9rem', borderRight: `1px dashed ${primaryColor}` }}>
            <div
              style={{
                display: 'inline-block',
                width: '16rem',
                height: '9rem',
                backgroundColor: 'black',
              }}
            >
              <ReactPlayer width="100%" height="100%" light url={videoUrl} controls />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button
              variant="outlined"
              size="small"
              color="primary"
              onClick={() => {
                setProgress(-1);
                setStep(0);
                setIsModalOpen(true);
              }}
            >
              {'Changer de vidéo'}
            </Button>
          </div>
        </>
      )}
      <Modal
        open={isModalOpen}
        fullWidth
        noCloseOutsideModal
        maxWidth="md"
        title="Choisir une vidéo"
        confirmLabel={step === 1 ? 'Uploader' : 'Choisir'}
        onConfirm={async () => {
          if (file !== null) {
            if (step === 0) {
              setStep(1);
              return;
            } else {
              await uploadVideo();
            }
          } else {
            onChangeVideo(tempVideoUrl);
          }
          setIsModalOpen(false);
          resetPreview();
        }}
        onClose={() => {
          setIsModalOpen(false);
          if (videoUrl.length === 0) {
            onDelete();
          }
        }}
        disabled={preview.mode !== 1}
        ariaLabelledBy={`video-edit-${id}`}
        ariaDescribedBy={`video-edit-${id}-desc`}
        loadingLabel="Upload de votre vidéo en cours..."
        loading={progress >= 0}
        progress={progress}
      >
        {step === 0 && (
          <>
            <div style={{ padding: '0.5rem' }}>
              <Alert icon={<ArrowRightAltIcon />} severity="info">
                Créer une vidéo sur{' '}
                <a className="text text--bold" href="https://clap.parlemonde.org" target="_blank" rel="noreferrer">
                  Clap!
                </a>
              </Alert>
            </div>
            <div style={{ display: 'flex', width: '100%', height: '20rem' }}>
              <div style={{ flex: 1, height: '100%', padding: '4rem 0.5rem', minWidth: 0 }}>
                <div id={`image-edit-${id}-desc`}>
                  <TextField
                    label="Entrez l'URL de la vidéo"
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    value={file === null ? tempVideoUrl : ''}
                    onBlur={() => {
                      if (isValidHttpUrl(tempVideoUrl)) {
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
                      setTempVideoUrl(event.target.value);
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
                        <input ref={inputFile} type="file" multiple={false} accept="video/*" style={{ display: 'none' }} onChange={onFileSelect} />
                      </>
                    </Button>
                  </div>
                </div>
              </div>
              <div style={{ flex: '1', padding: '0.5rem', minWidth: 0 }}>
                <div style={{ width: '100%', height: '100%', backgroundColor: bgPage, padding: '0.5rem' }}>
                  <div className="text-center text text--bold" style={{ height: '10%' }}>
                    Aperçu
                  </div>
                  {preview.mode === 1 && (
                    <div style={{ width: '100%', height: '90%', backgroundColor: 'black' }}>
                      <ReactPlayer width="100%" height="100%" light url={preview.url} controls />
                    </div>
                  )}
                  {preview.mode === 2 && <Alert severity="error">{'Erreur: impossible de lire cette vidéo.'}</Alert>}
                </div>
              </div>
            </div>
          </>
        )}
        {step === 1 && (
          <div style={{ minHeight: '10rem' }}>
            <h3 className="text--primary" style={{ margin: '1rem 0' }}>
              {"Entrez le nom de votre vidéo avant de l'uploader:"}
            </h3>

            <TextField
              color="primary"
              variant="outlined"
              fullWidth
              label="Nom de la vidéo"
              value={name}
              onChange={(event) => {
                setName(event.target.value.slice(0, 64));
              }}
            />
          </div>
        )}
      </Modal>
      <Modal
        title="Vidéo mise en ligne avec succès !"
        fullWidth
        maxWidth="md"
        open={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
        }}
        ariaDescribedBy="success-desc"
        ariaLabelledBy="success-title"
        cancelLabel="Continuer"
        noCloseOutsideModal
      >
        <div id="success-desc">
          <h3 className="text--primary" style={{ marginBottom: '0.5rem' }}>
            Votre vidéo a bien été mise en ligne, voici le lien :
          </h3>
          <Alert
            icon={false}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  copyText(value);
                }}
              >
                COPIER
              </Button>
            }
            severity="info"
          >
            {value}
          </Alert>
          <p className="text text--bold">Quelques informations: </p>
          <ul>
            <li style={{ margin: '0.2rem 0' }}>
              <strong>Conservez ce lien,</strong> vous pouvez le réutiliser si vous supprimez par erreur ce bloc {"d'édition vidéo"}.
            </li>
            <li style={{ margin: '0.2rem 0' }}>
              Vos vidéos mises en ligne sur 1village sont accessibles sur{' '}
              <Link href="/mes-videos">
                <a
                  href="/mes-videos"
                  target="_blank"
                  rel="noopener"
                  style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'bottom' }}
                >
                  <SettingsIcon /> {'->'} <i>mes vidéos</i>
                </a>
              </Link>
            </li>
            <li style={{ margin: '0.2rem 0' }}>
              La vidéo peut mettre <strong>plusieurs minutes</strong> pour être prête et affichera un écran noir en attendant. Vous pouvez cependant
              continuer à éditer et publier votre activité. {"Évitez d'uploader plusieurs fois la même vidéo."}
            </li>
            <li style={{ margin: '0.2rem 0' }}>
              Votre vidéo est <strong>privée</strong> et le lien ne fonctionne que sur le site de 1village.
            </li>
          </ul>
        </div>
      </Modal>
    </EditorContainer>
  );
};
