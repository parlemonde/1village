import Image from 'next/image';
import React, { useState } from 'react';

import { Button } from '@mui/material';

import type { EditorProps } from '../../content.types';
import { EditorContainer } from '../EditorContainer';
import DocumentModal from './DocumentModal';
import { primaryColor } from 'src/styles/variables.const';

export const DocumentEditor = ({ id, value, onChange, onDelete = () => '' }: EditorProps) => {
  const [isModalOpen, setIsModalOpen] = useState(value === '');
  return (
    <EditorContainer
      deleteButtonProps={{
        confirmLabel: 'Voulez-vous vraiment supprimer ce document ?',
        confirmTitle: 'Supprimer',
        onDelete: () => onDelete,
      }}
      className="document-editor"
    >
      <div
        style={{
          width: '15rem',
          height: '10rem',
          borderRight: `1px dashed ${primaryColor}`,
          position: 'relative',
        }}
      >
        {/* <Image layout="fill" objectFit="contain" src={value} unoptimized /> */}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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

      <DocumentModal
        id={id}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        // imageUrl={value}
        // setImageUrl={onChange}
        onDeleteEditor={() => onDelete()}
      />
    </EditorContainer>
  );
};
