import React from 'react';

import AppsIcon from '@mui/icons-material/Apps';
import { ButtonBase, Card } from '@mui/material';

import { UserContext } from 'src/contexts/userContext';
import ImageIcon from 'src/svg/editor/image_icon.svg';
import SoundIcon from 'src/svg/editor/sound_icon.svg';
import TextIcon from 'src/svg/editor/text_icon.svg';
import VideoIcon from 'src/svg/editor/video_icon.svg';
import { SyllableEditor } from 'src/components/activities/content/editors/SyllableEditor';
import type { ActivityContentType } from 'types/activity.type';
import { UserType } from 'types/user.type';

interface AddContentCardProps {
  addContent?(type: ActivityContentType): void;
}

export const LyricsEditor = ({ addContent = () => {} }: AddContentCardProps) => {
  const { user } = React.useContext(UserContext);
  const isPelico = user !== null && user.type >= UserType.MEDIATOR;


  return (
    <Card style={{ display: 'inline-block' }}>
      <div style={{ display: 'inline-flex', padding: '0.2rem 1rem', alignItems: 'center' }}>
        <span className="text text--bold" style={{ margin: '0 0.5rem' }}>
          Ajouter à votre refrain :
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
            addContent(content => [...content, <SyllableEditor addContent={addContent}/>])

          }}
        >
          <TextIcon height="1.25rem" />
          <span className="text text--small" style={{ marginTop: '0.1rem' }}>
            Syllabe
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
            addContent(content => [...content, 'LA back'])
          }}
        >
          <ImageIcon height="1.25rem" />
          <span className="text text--small" style={{ marginTop: '0.1rem' }}>
            Syllabe à la ligne
          </span>
        </ButtonBase>
      </div>
    </Card>
  );
};
