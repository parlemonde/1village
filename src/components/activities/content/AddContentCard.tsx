import AppsIcon from '@mui/icons-material/Apps';
import { ButtonBase, Card } from '@mui/material';
import React from 'react';

import { UserContext } from 'src/contexts/userContext';
import DocumentIcon from 'src/svg/editor/document_icon.svg';
import ImageIcon from 'src/svg/editor/image_icon.svg';
import SoundIcon from 'src/svg/editor/sound_icon.svg';
import TextIcon from 'src/svg/editor/text_icon.svg';
import VideoIcon from 'src/svg/editor/video_icon.svg';
import type { ActivityContentType } from 'types/activity.type';
import { UserType } from 'types/user.type';

interface AddContentCardProps {
  addContent?(type: ActivityContentType): void;
}

export const AddContentCard = ({ addContent = () => {} }: AddContentCardProps) => {
  const { user } = React.useContext(UserContext);
  const isPelico = user !== null && user.type <= UserType.MEDIATOR;

  return (
    <Card style={{ display: 'inline-block' }}>
      <div style={{ display: 'inline-flex', padding: '0.2rem 1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <span className="text text--bold" style={{ margin: '0 0.5rem' }}>
          Ajouter à votre description :
        </span>
        <ButtonBase
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '0 0.5rem',
            padding: '0.2rem',
            borderRadius: '5px',
          }}
          onClick={() => {
            addContent('text');
          }}
        >
          <TextIcon height="1.25rem" />
          <span className="text text--small" style={{ marginTop: '0.1rem' }}>
            Texte
          </span>
        </ButtonBase>
        <ButtonBase
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '0 0.5rem',
            padding: '0.2rem',
            borderRadius: '5px',
          }}
          onClick={() => {
            addContent('image');
          }}
        >
          <ImageIcon height="1.25rem" />
          <span className="text text--small" style={{ marginTop: '0.1rem' }}>
            Image
          </span>
        </ButtonBase>
        <ButtonBase
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '0 0.5rem',
            padding: '0.2rem',
            borderRadius: '5px',
          }}
          onClick={() => {
            addContent('document');
          }}
        >
          <DocumentIcon height="1.25rem" />
          <span className="text text--small" style={{ marginTop: '0.1rem' }}>
            Document
          </span>
        </ButtonBase>
        <ButtonBase
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '0 0.5rem',
            padding: '0.2rem',
            borderRadius: '5px',
          }}
          onClick={() => {
            addContent('video');
          }}
        >
          <VideoIcon height="1.25rem" />
          <span className="text text--small" style={{ marginTop: '0.1rem' }}>
            Vidéo
          </span>
        </ButtonBase>
        <ButtonBase
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '0 0.5rem',
            padding: '0.2rem',
            borderRadius: '5px',
          }}
          onClick={() => {
            addContent('sound');
          }}
        >
          <SoundIcon height="1.25rem" />
          <span className="text text--small" style={{ marginTop: '0.1rem' }}>
            Son
          </span>
        </ButtonBase>
        {isPelico && (
          <ButtonBase
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              margin: '0 0.5rem',
              padding: '0.2rem',
              borderRadius: '5px',
            }}
            onClick={() => {
              addContent('h5p');
            }}
          >
            <AppsIcon color="primary" style={{ height: '1.25rem' }} />
            <span className="text text--small" style={{ marginTop: '0.1rem' }}>
              h5p
            </span>
          </ButtonBase>
        )}
      </div>
    </Card>
  );
};
