import React from 'react';

import { Button } from '@material-ui/core';

import { primaryColor } from 'src/styles/variables.const';

import type { EditorProps } from '../../content.types';
import { EditorContainer } from '../EditorContainer';

import { ImageModal } from './ImageModal';

export const ImageEditor: React.FC<EditorProps> = ({ id, value = '', onChange = () => {}, onDelete = () => {} }: EditorProps) => {
  const [imageUrl, setImageUrl] = React.useState(value);
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
      {imageUrl && (
        <>
          <div
            style={{
              width: '15rem',
              height: '10rem',
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              borderRight: `1px dashed ${primaryColor}`,
            }}
          ></div>
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
        value={value}
        onChange={onChange}
        onDelete={onDelete}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
      />
    </EditorContainer>
  );
};
