import AddIcon from '@mui/icons-material/Add';
import { ButtonBase } from '@mui/material';

import type { EditorProps } from '../../content.types';

import React from 'react';

import { AvatarImg } from 'src/components/Avatar';

import { ImageModal } from './ImageModal';

export const AvatarEditor = ({ id, value = '', onChange = () => {}, onDelete = () => {}, isRounded = true }: EditorProps) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <ButtonBase onClick={() => setIsModalOpen(true)} style={{ borderRadius: isRounded ? '50%' : '0%' }}>
        <AvatarImg src={value} noLink isRounded={isRounded}>
          {value || <AddIcon style={{ fontSize: '80px' }} />}
        </AvatarImg>
      </ButtonBase>
      <ImageModal
        id={id}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        imageUrl={value}
        setImageUrl={onChange}
        useCrop={isRounded}
        onDeleteEditor={onDelete}
      />
    </>
  );
};
