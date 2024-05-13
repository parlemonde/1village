import React, { useState } from 'react';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button } from '@mui/material';

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

  async function handleUploadFiles(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const urls = await uploadFiles.mutateAsync(files);
      setUrls(urls);
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
              Aperçu
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
