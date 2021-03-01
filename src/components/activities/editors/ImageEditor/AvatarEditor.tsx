import React from 'react';

import AddIcon from '@material-ui/icons/Add';

import { AvatarView } from 'src/components/activities/views/AvatarView';

import type { EditorProps } from '../../editing.types';

import { ImageModal } from './ImageModal';

export const AvatarEditor: React.FC<EditorProps> = ({ id, value = '', onChange = () => {}, onDelete = () => {} }: EditorProps) => {
  const [imageUrl, setImageUrl] = React.useState(typeof value === 'string' ? value : URL.createObjectURL(value));

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <AvatarView value={imageUrl} onClick={() => setIsModalOpen(true)}>
        {imageUrl || <AddIcon style={{ fontSize: '80px' }} />}
      </AvatarView>
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
    </>
  );
};
