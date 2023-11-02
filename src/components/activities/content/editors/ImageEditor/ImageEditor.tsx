import Image from 'next/image';
import React from 'react';

import { Button } from '@mui/material';

import type { EditorProps } from '../../content.types';
import { EditorContainer } from '../EditorContainer';
import { ImageModal } from './ImageModal';
import { primaryColor } from 'src/styles/variables.const';

export const ImageEditor = ({ id, value = '', onChange = () => {}, onDelete = () => {} }: EditorProps) => {
  const [isModalOpen, setIsModalOpen] = React.useState(value === '');

  return (
    <EditorContainer
      deleteButtonProps={{
        confirmLabel: 'Voulez-vous vraiment supprimer cette image ?',
        confirmTitle: 'Supprimer',
        onDelete,
      }}
      className="image-editor"
    >
      {value && (
        <>
          <div
            style={{
              width: '15rem',
              height: '10rem',
              borderRight: `1px dashed ${primaryColor}`,
              position: 'relative',
            }}
          >
            <Image layout="fill" objectFit="contain" src={value} unoptimized />
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
              {"Changer d'image"}
            </Button>
          </div>
        </>
      )}
      <ImageModal
        id={id}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        imageUrl={value}
        setImageUrl={onChange}
        onDeleteEditor={onDelete}
      />
    </EditorContainer>
  );
};
