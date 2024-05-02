import Image from 'next/image';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button, Divider, TextField } from '@mui/material';
import Alert from '@mui/material/Alert';

import type { ImgCroppieRef } from 'src/components/ImgCroppie';
import { ImgCroppie } from 'src/components/ImgCroppie';
import { KeepRatio } from 'src/components/KeepRatio';
import { Modal } from 'src/components/Modal';
import { LightBox } from 'src/components/lightbox/Lightbox';
import { fontDetailColor, bgPage } from 'src/styles/variables.const';
import { isValidHttpUrl } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';

interface DocumentEditorProps {
  id: number;
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
  onDeleteEditor: () => void;
}

export default function DocumentModal({ id, isModalOpen, setIsModalOpen, onDeleteEditor }: DocumentEditorProps) {
  // const [files, setFiles] = useState<File[] | null>(null);
  const [files, setFiles] = useState<string[] | null>(null);
  return (
    <Modal
      open={isModalOpen}
      fullWidth
      noCloseOutsideModal
      maxWidth="md"
      title="Choisir un document"
      confirmLabel="Choisir"
      onConfirm={async () => {
        // if (file !== null || useCrop) {
        //   await uploadImage();
        // } else {
        //   setImageUrl(tempImageUrl);
        // }
        // setIsModalOpen(false);
        // resetPreview();
      }}
      onClose={() => {
        setIsModalOpen(false);
        // resetPreview();
        // if (imageUrl.length === 0) {
        onDeleteEditor();
        // }
      }}
      ariaLabelledBy={''}
      ariaDescribedBy={''} //   loading={isModalLoading}
      //   disabled={preview.mode !== 1}
      // ariaLabelledBy={`image-edit-${id}`}
      // ariaDescribedBy={`image-edit-${id}-desc`}
    >
      <div style={{ display: 'flex', width: '100%' }}>
        <div style={{ flex: 1, height: '100%', padding: '2rem 0', minWidth: 0 }}>
          <div style={{ marginTop: '2rem' }}>
            <div className="text-center" style={{ margin: '-0.8rem 0 1.5rem 0' }}>
              <span style={{ backgroundColor: 'white', padding: '0 0.5rem', color: fontDetailColor, fontSize: '1.1rem' }}>Ou</span>
            </div>
            <div className="text-center">
              <Button component="label" variant="outlined" color="secondary" startIcon={<CloudUploadIcon />} style={{ cursor: 'pointer' }}>
                <>
                  Importer
                  <input
                    type="file"
                    multiple
                    accept="application/pdf,
  application/vnd.ms-powerpoint,
  application/vnd.openxmlformats-officedocument.presentationml.presentation,
  application/msword,
  application/vnd.openxmlformats-officedocument.wordprocessingml.document,"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files) {
                        // setFiles(Array.from(e.target.files));
                        setFiles(Array.from(e.target.value));
                      }
                      console.log(e.target.files);
                    }}
                  />
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
            {/* {files && <DocViewer documents={[{ uri: files[0], fileType: 'application/pdf' }]} style={{ width: 'auto', height: 500 }} />} */}
          </div>
        </div>
      </div>
    </Modal>
  );
}
