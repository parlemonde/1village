import { Button } from '@mui/material';
import React, { useState } from 'react';

import { EditorContainer } from '../EditorContainer';
import DocumentModal from './DocumentModal';
import PdfDisplay from './PdfDisplay';
import { primaryColor } from 'src/styles/variables.const';

interface DocumentEditorProps {
  id: number;
  onDeleteEditor: () => void;
  onChange(newValue: string): void;
  value?: string;
}

export const DocumentEditor = ({ id, value, onChange, onDeleteEditor }: DocumentEditorProps) => {
  const [isModalOpen, setIsModalOpen] = useState(value === '');

  return (
    <EditorContainer
      deleteButtonProps={{
        confirmLabel: 'Voulez-vous vraiment supprimer ce document ?',
        confirmTitle: 'Supprimer',
        onDelete: onDeleteEditor,
      }}
      className="document-editor"
    >
      <div style={{ display: 'flex' }}>
        <div
          style={{
            // width: '15rem',
            // height: '10rem',
            borderRight: `1px dashed ${primaryColor}`,
            // position: 'relative',
          }}
        >
          {value && <PdfDisplay url={value} />}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Changer de document
          </Button>
        </div>
      </div>
      <DocumentModal id={id} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} onChange={onChange} onDeleteEditor={() => onDeleteEditor()} />
    </EditorContainer>
  );
};
