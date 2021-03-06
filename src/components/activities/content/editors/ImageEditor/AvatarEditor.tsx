import React from 'react';

import { ButtonBase } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { AvatarImg } from 'src/components/Avatar';

import type { EditorProps } from '../../content.types';

import { ImageModal } from './ImageModal';

export const AvatarEditor: React.FC<EditorProps> = ({ id, value = '', onChange = () => {}, onDelete = () => {} }: EditorProps) => {
  const [imageUrl, setImageUrl] = React.useState(value);

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <ButtonBase onClick={() => setIsModalOpen(true)} style={{ borderRadius: '50%' }}>
        <AvatarImg src={imageUrl} noLink>
          {imageUrl || <AddIcon style={{ fontSize: '80px' }} />}
        </AvatarImg>
      </ButtonBase>
      <ImageModal
        id={id}
        value={value}
        onChange={onChange}
        onDelete={onDelete}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        useCrop
      />
    </>
  );
};
