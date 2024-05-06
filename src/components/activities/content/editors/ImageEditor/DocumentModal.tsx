import Image from 'next/image';
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button } from '@mui/material';

import { useUploadFiles } from 'src/api/files/uploadFiles.post';
import { Modal } from 'src/components/Modal';
import { fontDetailColor, bgPage } from 'src/styles/variables.const';

interface DocumentEditorProps {
  id: number;
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
  onDeleteEditor: () => void;
}
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function DocumentModal({ id, isModalOpen, setIsModalOpen, onDeleteEditor }: DocumentEditorProps) {
  // const [file, setFile] = useState<{ path: string; extention: string; file: File } | null>(null);
  const [urls, setUrls] = useState<string[]>([]);
  const [numPages, setNumPages] = useState<number>(1);
  const uploadFiles = useUploadFiles();
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }
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
                Importer
                <input
                  type="file"
                  multiple
                  accept="application/pdf"
                  //to accept futur docx and pptx
                  //                   accept="application/pdf,
                  //                   application/vnd.ms-powerpoint,
                  // -  application/vnd.openxmlformats-officedocument.presentationml.presentation,
                  // -  application/msword,
                  // -  application/vnd.openxmlformats-officedocument.wordprocessingml.document,"
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    if (e.target.files) {
                      const files = Array.from(e.target.files);
                      const urls = await uploadFiles.mutateAsync(files);
                      setUrls(urls);
                    }
                  }}
                />
              </Button>
            </div>
          </div>
        </div>
        <div style={{ flex: '1', padding: '0.5rem', minWidth: 0 }}>
          <div style={{ width: '100%', minHeight: '15rem', backgroundColor: bgPage, padding: '0.5rem' }}>
            <div className="text-center text text--bold" style={{ height: '10%' }}>
              Aperçu
            </div>

            {urls.length
              ? urls.map((url) => (
                  <div key={url}>
                    <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
                      <Page width={380} renderTextLayer={false} renderAnnotationLayer={false} pageNumber={1} pageIndex={0} />
                    </Document>
                    <hr />
                  </div>
                ))
              : ''}
          </div>
        </div>
      </div>
    </Modal>
  );
}
