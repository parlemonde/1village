import Image from 'next/image';
import { useSnackbar } from 'notistack';
import React from 'react';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Alert from '@mui/material/Alert';
import { Button, Divider, TextField } from '@mui/material';

import type { ImgCroppieRef } from 'src/components/ImgCroppie';
import { ImgCroppie } from 'src/components/ImgCroppie';
import { KeepRatio } from 'src/components/KeepRatio';
import { Modal } from 'src/components/Modal';
import { UserContext } from 'src/contexts/userContext';
import { fontDetailColor, bgPage } from 'src/styles/variables.const';
import { isValidHttpUrl } from 'src/utils';

import type { EditorProps } from '../../content.types';

interface ImageModalProps extends EditorProps {
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
  imageUrl: string;
  setImageUrl: (val: string) => void;
  useCrop?: boolean;
}

export const ImageModal = ({
  isModalOpen,
  setIsModalOpen,
  imageUrl,
  setImageUrl,
  id,
  value = '',
  onChange = () => {},
  onDelete = () => {},
  useCrop = false,
}: ImageModalProps) => {
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const [tempImageUrl, setTempImageUrl] = React.useState('');
  const previewRef = React.useRef<HTMLDivElement>(null);
  const croppieRef = React.useRef<ImgCroppieRef>(null);
  const [preview, setPreview] = React.useState<{ url: string; mode: number }>({
    url: '',
    mode: 0,
  }); // 0 no preview, 1: preview, 2: error
  const [previewSize, setPreviewSize] = React.useState(100);
  const [isModalLoading, setIsModalLoading] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const inputFile = React.useRef<HTMLInputElement>(null);
  const prevUpload = React.useRef<string | null>(null);

  // On value change, update image.
  const prevValue = React.useRef(value);
  React.useEffect(() => {
    if (prevValue.current !== value) {
      prevValue.current = value;
      setImageUrl(value);
    }
  }, [value, setImageUrl]);

  const prevIsModalOpen = React.useRef<boolean | null>(null);
  React.useEffect(() => {
    if (isModalOpen && isModalOpen !== prevIsModalOpen.current && value) {
      setTempImageUrl(value);
      setPreview({
        mode: 1,
        url: value,
      });
    }
    prevIsModalOpen.current = isModalOpen;
  }, [isModalOpen, value]);

  const onChangeImage = React.useCallback(
    (newValue: string) => {
      prevValue.current = newValue;
      onChange(newValue);
      setImageUrl(typeof newValue === 'string' ? newValue : URL.createObjectURL(newValue));
    },
    [onChange, setImageUrl],
  );

  const uploadImage = async () => {
    setIsModalLoading(true);

    // delete previous uploaded image, not needed anymore.
    if (prevUpload.current !== null) {
      await axiosLoggedRequest({
        method: 'DELETE',
        url: prevUpload.current.slice(4),
      });
    }

    const formData = new FormData();
    if (useCrop) {
      if (!croppieRef.current) {
        setIsModalLoading(false);
        return;
      }
      formData.append('image', (await croppieRef.current.getBlob()) || '');
    } else {
      if (file === null) {
        setIsModalLoading(false);
        return;
      }
      formData.append('image', file);
    }
    const response = await axiosLoggedRequest({
      method: 'POST',
      url: '/images',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.error) {
      onChangeImage('');
      prevUpload.current = null;
      enqueueSnackbar('Une erreur est survenue...', {
        variant: 'error',
      });
    } else {
      onChangeImage(response.data.url);
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
      url: tempImageUrl,
    });
  };
  const resetPreview = () => {
    setPreview({
      mode: 0,
      url: '',
    });
  };

  React.useLayoutEffect(() => {
    if (preview.mode === 1 && previewRef.current) {
      setPreviewSize(previewRef.current.getBoundingClientRect().width);
    }
  }, [preview.mode]);

  const onFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const filesArr = Array.prototype.slice.call(files) as File[];
    if (filesArr.length > 0) {
      setFile(filesArr[0]);
      setTempImageUrl(URL.createObjectURL(filesArr[0]));
      setPreview({
        mode: 1,
        url: URL.createObjectURL(filesArr[0]),
      });
    } else {
      setFile(null);
      setTempImageUrl('');
      resetPreview();
    }
  };

  return (
    <Modal
      open={isModalOpen}
      fullWidth
      noCloseOutsideModal
      maxWidth="md"
      title="Choisir une image"
      confirmLabel="Choisir"
      onConfirm={async () => {
        if (file !== null || useCrop) {
          await uploadImage();
        } else {
          onChangeImage(tempImageUrl);
        }
        setIsModalOpen(false);
        resetPreview();
      }}
      onClose={() => {
        setIsModalOpen(false);
        resetPreview();
        if (imageUrl.length === 0) {
          onDelete();
        }
      }}
      loading={isModalLoading}
      disabled={preview.mode !== 1}
      ariaLabelledBy={`image-edit-${id}`}
      ariaDescribedBy={`image-edit-${id}-desc`}
    >
      <div style={{ display: 'flex', width: '100%' }}>
        <div style={{ flex: 1, height: '100%', padding: '2rem 0', minWidth: 0 }}>
          <div id={`image-edit-${id}-desc`} style={{ marginTop: '2rem' }}>
            <TextField
              label="Entrez l'URL de l'image"
              variant="outlined"
              color="secondary"
              fullWidth
              value={file === null ? tempImageUrl : ''}
              onBlur={() => {
                if (isValidHttpUrl(tempImageUrl)) {
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
                setTempImageUrl(event.target.value);
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
                  <input ref={inputFile} type="file" multiple={false} accept="image/*" style={{ display: 'none' }} onChange={onFileSelect} />
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
            {preview.mode === 1 && useCrop ? (
              <div style={{ margin: '1rem 0' }}>
                <KeepRatio ratio={1} width="70%">
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      paddingBottom: '2rem',
                    }}
                    ref={previewRef}
                  >
                    <ImgCroppie
                      ref={croppieRef}
                      alt="preview"
                      src={preview.url}
                      imgWidth={previewSize * 0.8}
                      imgHeight={previewSize * 0.8}
                      type="circle"
                    />
                  </div>
                </KeepRatio>
              </div>
            ) : preview.mode === 1 ? (
              <div
                style={{
                  width: '100%',
                  margin: '0.5rem 0',
                  height: '13rem',
                  position: 'relative',
                }}
              >
                <Image layout="fill" objectFit="contain" src={preview.url} unoptimized />
              </div>
            ) : null}
            {preview.mode === 2 && <Alert severity="error">{"Erreur: impossible de charger l'image."}</Alert>}
          </div>
        </div>
      </div>
    </Modal>
  );
};
