import Image from 'next/image';
import React from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button, Divider, TextField } from '@mui/material';
import Alert from '@mui/material/Alert';
import { useSnackbar } from 'notistack';

import type { ImgCroppieRef } from 'src/components/ImgCroppie';
import { ImgCroppie } from 'src/components/ImgCroppie';
import { KeepRatio } from 'src/components/KeepRatio';
import { Modal } from 'src/components/Modal';
import { LightBox } from 'src/components/lightbox/Lightbox';
import { fontDetailColor, bgPage } from 'src/styles/variables.const';
import { isValidHttpUrl } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';

interface ImageModalProps {
  id: number;
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
  imageUrl: string;
  setImageUrl: (val: string) => void;
  useCrop?: boolean;
  onDeleteEditor?: () => void;
}

export const ImageModal = ({
  id,
  isModalOpen,
  setIsModalOpen,
  imageUrl,
  setImageUrl,
  useCrop = false,
  onDeleteEditor = () => {},
}: ImageModalProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [tempImageUrl, setTempImageUrl] = React.useState(imageUrl);
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

  // On url change, update image.
  const prevValue = React.useRef(imageUrl);
  React.useEffect(() => {
    if (prevValue.current !== imageUrl) {
      prevValue.current = imageUrl;
      setTempImageUrl(imageUrl);
    }
  }, [imageUrl]);

  const prevIsModalOpen = React.useRef<boolean | null>(null);
  React.useEffect(() => {
    if (isModalOpen && isModalOpen !== prevIsModalOpen.current) {
      setTempImageUrl(prevValue.current);
      setFile(null);
      setPreview({
        mode: prevValue.current ? 1 : 0,
        url: prevValue.current,
      });
    }
    prevIsModalOpen.current = isModalOpen;
  }, [isModalOpen]);

  const uploadImage = async () => {
    setIsModalLoading(true);

    // delete previous uploaded image, not needed anymore.
    if (prevUpload.current !== null) {
      await axiosRequest({
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
    const response = await axiosRequest({
      method: 'POST',
      url: '/images',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.error) {
      setTempImageUrl('');
      setFile(null);
      prevUpload.current = null;
      enqueueSnackbar('Une erreur est survenue...', {
        variant: 'error',
      });
    } else {
      prevValue.current = response.data.url;
      setImageUrl(response.data.url);
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
          setImageUrl(tempImageUrl);
        }
        setIsModalOpen(false);
        resetPreview();
      }}
      onClose={() => {
        setIsModalOpen(false);
        resetPreview();
        if (imageUrl.length === 0) {
          onDeleteEditor();
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
                <LightBox url={preview.url} isImage={true}>
                  <Image layout="fill" objectFit="contain" src={preview.url} unoptimized />
                </LightBox>
              </div>
            ) : null}
            {preview.mode === 2 && <Alert severity="error">{"Erreur: impossible de charger l'image."}</Alert>}
          </div>
        </div>
      </div>
    </Modal>
  );
};
