import Image from 'next/image';
import { useSnackbar } from 'notistack';
import React from 'react';

import { Button, Divider, TextField } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Alert } from '@material-ui/lab';

import type { ImgCroppieRef } from 'src/components/ImgCroppie';
import { ImgCroppie } from 'src/components/ImgCroppie';
import { KeepRatio } from 'src/components/KeepRatio';
import { Modal } from 'src/components/Modal';
import { UserContext } from 'src/contexts/userContext';
import { fontDetailColor, bgPage } from 'src/styles/variables.const';
import { isValidHttpUrl } from 'src/utils';

import type { EditorProps } from '../../content.types';


export const ImageComponent = (useCrop: boolean) => {
    const { axiosLoggedRequest } = React.useContext(UserContext);
    const { enqueueSnackbar } = useSnackbar();
    const previewRef = React.useRef<HTMLDivElement>(null);
    const [tempImageUrl, setTempImageUrl] = React.useState('');
    const [file, setFile] = React.useState<File | null>(null);
    const [preview, setPreview] = React.useState<{ url: string; mode: number }>({
      url: '',
      mode: 0,
    }); // 0 no preview, 1: preview, 2: error
    const [previewSize, setPreviewSize] = React.useState(100);
    const inputFile = React.useRef<HTMLInputElement>(null);
    const croppieRef = React.useRef<ImgCroppieRef>(null);
    const prevUpload = React.useRef<string | null>(null);


    const displayPreview = () => {
        setPreview({
          mode: 1,
          url: tempImageUrl,
        });
      };

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
  const uploadImage = async () => {

    // delete previous uploaded image, not needed anymore.
    if (prevUpload.current !== null) {
      await axiosLoggedRequest({
        method: 'DELETE',
        url: prevUpload.current.slice(4),
      });
    }
    const formData = new FormData();
    if (useCrop) {
      formData.append('image', await croppieRef.current.getBlob());
    } else {
      if (file === null) {
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
  };

  const resetPreview = () => {
    setPreview({
      mode: 0,
      url: '',
    });
  };

return (
    <div style={{ display: 'flex', width: '100%' }}>
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
)};