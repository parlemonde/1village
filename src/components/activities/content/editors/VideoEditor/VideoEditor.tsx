import ReactPlayer from 'react-player';
import React from 'react';

import { Button } from '@mui/material';

import { primaryColor } from 'src/styles/variables.const';

import type { EditorProps } from '../../content.types';
import { EditorContainer } from '../EditorContainer';

import { VideoModals } from './VideoModals';

export const VideoEditor: React.FC<EditorProps> = ({ id, value = '', onChange = () => {}, onDelete = () => {} }: EditorProps) => {
  const [videoUrl, setVideoUrl] = React.useState(value);
  const [isModalOpen, setIsModalOpen] = React.useState(value === '');

  // On value change, update image.
  const prevValue = React.useRef(value);
  React.useEffect(() => {
    if (prevValue.current !== value) {
      prevValue.current = value;
      setVideoUrl(value);
    }
  }, [value]);

  return (
    <EditorContainer
      deleteButtonProps={{
        confirmLabel: 'Voulez-vous vraiment supprimer cette vidéo ?',
        confirmTitle: 'Supprimer',
        onDelete,
      }}
      className="image-editor"
    >
      {videoUrl && (
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
              <ReactPlayer width="100%" height="100%" light url={videoUrl} controls />
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
        videoUrl={videoUrl}
        setVideoUrl={setVideoUrl}
        onChange={onChange}
        onDelete={onDelete}
      />
    </EditorContainer>
  );
};
