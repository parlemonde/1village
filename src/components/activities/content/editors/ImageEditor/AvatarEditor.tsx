import React from 'react';

import AddIcon from '@mui/icons-material/Add';
import { ButtonBase } from '@mui/material';

import { AvatarImg } from 'src/components/Avatar';

import type { EditorProps } from '../../content.types';

import { ImageModal } from './ImageModal';

export const AvatarEditor = ({ id, value = '', onChange = () => {}, onDelete = () => {}, isRounded = true }: EditorProps) => {
  const [imageUrl, setImageUrl] = React.useState(value);

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <ButtonBase onClick={() => setIsModalOpen(true)} style={{ borderRadius: isRounded ? '50%' : '0%' }}>
        <AvatarImg src={imageUrl} noLink isRounded={isRounded}>
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
        useCrop={isRounded}
      />
    </>
  );
};
