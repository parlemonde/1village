import React from 'react';

import { Button, Divider, TextField } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Alert } from '@material-ui/lab';

import { Modal } from 'src/components/Modal';
import { UserContext } from 'src/contexts/userContext';
import { fontDetailColor, bgPage } from 'src/styles/variables.const';
import { isValidHttpUrl } from 'src/utils';

import type { EditorProps } from '../../editing.types';

export const ImageModal: React.FC<EditorProps> = ({
  isModalOpen,
  setIsModalOpen,
  imageUrl,
  setImageUrl,
  id,
  value = '',
  onChange = () => {},
  onDelete = () => {},
}: EditorProps) => {
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const [tempImageUrl, setTempImageUrl] = React.useState('');
  const [preview, setPreview] = React.useState<{ url: string; mode: number }>({
    url: '',
    mode: 0,
  }); // 0 no preview, 1: preview, 2: error
  const [isModalLoading, setIsModalLoading] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const inputFile = React.useRef<HTMLInputElement>(null);

  // On value change, update image.
  const prevValue = React.useRef(value);
  React.useEffect(() => {
    if (prevValue.current !== value) {
      prevValue.current = value;
      setImageUrl(typeof value === 'string' ? value : URL.createObjectURL(value));
    }
  }, [value, setImageUrl]);

  const onChangeImage = React.useCallback(
    (newValue: string) => {
      prevValue.current = newValue;
      onChange(newValue);
      setImageUrl(typeof newValue === 'string' ? newValue : URL.createObjectURL(newValue));
    },
    [onChange],
  );

  const uploadImage = async () => {
    if (file === null) {
      return;
    }
    setIsModalLoading(true);
    const formData = new FormData();
    formData.append('image', file);
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
    } else {
      onChangeImage(response.data.url);
    }
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
        if (file !== null) {
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
      <div style={{ display: 'flex', width: '100%', height: '20rem' }}>
        <div style={{ flex: 1, height: '100%', padding: '2rem 0' }}>
          <div id={`image-edit-${id}-desc`}>
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
        <div style={{ flex: '1', padding: '0.5rem' }}>
          <div style={{ width: '100%', height: '100%', backgroundColor: bgPage, padding: '0.5rem' }}>
            <div className="text-center text text--bold" style={{ height: '10%' }}>
              Aperçu
            </div>
            {preview.mode === 1 && (
              <div
                style={{
                  width: '100%',
                  height: '90%',
                  backgroundImage: `url(${preview.url})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}
              ></div>
            )}
            {preview.mode === 2 && <Alert severity="error">{"Erreur: impossible de charger l'image."}</Alert>}
          </div>
        </div>
      </div>
    </Modal>
  );
};
