import React from 'react';

import { ButtonBase, Card } from '@material-ui/core';
import AppsIcon from '@material-ui/icons/Apps';

import type { EditorTypes } from 'src/activity-types/extendedActivity.types';
import { UserContext } from 'src/contexts/userContext';
import ImageIcon from 'src/svg/editor/image_icon.svg';
import SoundIcon from 'src/svg/editor/sound_icon.svg';
import TextIcon from 'src/svg/editor/text_icon.svg';
import VideoIcon from 'src/svg/editor/video_icon.svg';
import { UserType } from 'types/user.type';

interface AddContentCardProps {
  addContent?(type: EditorTypes): void;
}

export const AddContentCard = ({ addContent = () => {} }: AddContentCardProps) => {
  const { user } = React.useContext(UserContext);
  const isPelico = user.type >= UserType.MEDIATOR;

  return (
    <Card style={{ display: 'inline-block' }}>
      <div style={{ display: 'inline-flex', padding: '0.2rem 1rem', alignItems: 'center' }}>
        <span className="text text--bold" style={{ margin: '0 0.5rem' }}>
          Ajouter à votre description :
        </span>
        {/* <Divider flexItem orientation="vertical" style={{ margin: "0 1rem", backgroundColor: primaryColor }} /> */}
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
