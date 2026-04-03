import { useSnackbar } from 'notistack';
import React, { useState } from 'react';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button, Alert, AlertTitle } from '@mui/material';

import PdfDisplay from './PdfDisplay';
import { useUploadFiles } from 'src/api/files/uploadFiles.post';
import { Modal } from 'src/components/Modal';
import { bgPage } from 'src/styles/variables.const';

interface DocumentEditorProps {
  id: number;
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
  onDeleteEditor: () => void;
  onChange(newValue: string): void;
}

export default function DocumentModal({ id, isModalOpen, setIsModalOpen, onDeleteEditor, onChange }: DocumentEditorProps) {
  const uploadFiles = useUploadFiles();
  const [urls, setUrls] = useState<string[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  let previewText;
  if (uploadFiles && uploadFiles.isError) {
    previewText = "Erreur lors de l'import du fichier";
  } else {
    previewText = 'Aperçu';
  }

  async function handleUploadFiles(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      try {
        const urls = await uploadFiles.mutateAsync(files);
        setUrls(urls);
      } catch (err: unknown) {
        let causeErrorMessage;
        if (err && typeof err === 'object' && err !== null && 'cause' in err) {
          causeErrorMessage = <>{(err as Error).cause}</>;
        }
        enqueueSnackbar(
          <Alert severity="error">
            <AlertTitle>Une erreur s’est produite lors de l’import de votre fichier.</AlertTitle>
            {causeErrorMessage ? (
              <p>{causeErrorMessage}</p>
            ) : (
              <p>Merci de vous déconnecter et de vous reconnecter à 1Village avant de réimporter votre fichier.</p>
            )}
          </Alert>,
          {
            variant: 'error',
            autoHideDuration: 10000,
          },
        );
      }
    }
  }
  return (
    <Modal
      open={isModalOpen}
      fullWidth
      noCloseOutsideModal
      maxWidth="md"
      title="Choisir un document"
      confirmLabel="Choisir"
      onConfirm={() => {
        setIsModalOpen(false);
        onChange(urls[0]);
      }}
      onClose={() => {
        setIsModalOpen(false);
        onDeleteEditor();
      }}
      ariaLabelledBy={`document-edit-${id}`}
      ariaDescribedBy={`document-edit-${id}-desc`}
    >
      <div style={{ display: 'flex', width: '100%' }}>
        <div style={{ flex: 1, height: '100%', padding: '2rem 0', minWidth: 0 }}>
          <div style={{ textAlign: 'center', justifyContent: 'center' }}>
            <Button component="label" variant="outlined" color="secondary" startIcon={<CloudUploadIcon />} style={{ cursor: 'pointer' }}>
              Importer
              <input
                type="file"
                // TODO: update the whole activity editor logique
                // add multiple to handle multiple file (backend ready)
                // multiple
                accept="application/pdf"
                //to accept futur docx and pptx
                //                   accept="application/pdf,
                //                   application/vnd.ms-powerpoint,
                // -  application/vnd.openxmlformats-officedocument.presentationml.presentation,
                // -  application/msword,
                // -  application/vnd.openxmlformats-officedocument.wordprocessingml.document,"
                style={{ display: 'none' }}
                onChange={handleUploadFiles}
              />
            </Button>
          </div>
        </div>
        <div style={{ flex: '1', padding: '0.5rem', minWidth: 0 }}>
          <div style={{ width: '100%', minHeight: '15rem', backgroundColor: bgPage, padding: '0.5rem' }}>
            <div className="text-center text text--bold" style={{ height: '10%' }}>
              {previewText}
            </div>

            {urls.length ? (
              <div key={urls[0]}>
                <PdfDisplay url={urls[0]} />
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
