import { Button } from '@mui/material';
import React from 'react';
import ReactPlayer from 'react-player';

import type { EditorProps } from '../../content.types';
import { EditorContainer } from '../EditorContainer';
import { VideoModals } from './VideoModals';
import { primaryColor } from 'src/styles/variables.const';

export const VideoEditor = ({ id, value = '', onChange = () => {}, onDelete = () => {} }: EditorProps) => {
  const [isModalOpen, setIsModalOpen] = React.useState(value === '');

  return (
    <EditorContainer
      deleteButtonProps={{
        confirmLabel: 'Voulez-vous vraiment supprimer cette vidéo ?',
        confirmTitle: 'Supprimer',
        onDelete,
      }}
      className="image-editor"
    >
      {value && (
        <>
          <div className="text-center" style={{ height: '9rem', borderRight: `1px dashed ${primaryColor}` }}>
            <div
              style={{
                display: 'inline-block',
                width: '16rem',
                height: '9rem',
                backgroundColor: 'black',
              }}
            >
              <ReactPlayer width="100%" height="100%" url={value} controls />
            </div>
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
              {'Changer de vidéo'}
            </Button>
          </div>
        </>
      )}
      <VideoModals
        id={id}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        videoUrl={value}
        setVideoUrl={onChange}
        onDeleteEditor={onDelete}
      />
    </EditorContainer>
  );
};
