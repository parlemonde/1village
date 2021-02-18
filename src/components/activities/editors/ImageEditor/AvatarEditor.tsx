import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Avatar } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import type { EditorProps } from '../../editing.types';

import { ImageModal } from './ImageModal';

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(18),
    height: theme.spacing(18),
  },
}));

export const AvatarEditor: React.FC<EditorProps> = ({ id, value = '', onChange = () => {}, onDelete = () => {} }: EditorProps) => {
  const classes = useStyles();
  const [imageUrl, setImageUrl] = React.useState(typeof value === 'string' ? value : URL.createObjectURL(value));

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <Avatar alt={'avatar'} src={imageUrl} className={classes.large} onClick={() => setIsModalOpen(true)}>
        {imageUrl || <AddIcon style={{ fontSize: '80px' }} />}
      </Avatar>
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
