import { useRouter } from 'next/router';
import React from 'react';
import Button from '@mui/material/Button';

import SoundIcon from 'src/svg/editor/sound_icon.svg';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { ActivityContext } from 'src/contexts/activityContext';
import { AnthemEditor } from 'src/components/activities/content/editors/AnthemEditor';

const AnthemStep2 = () => {
  const router = useRouter();
  const { activity, updateActivity, deleteContent } = React.useContext(ActivityContext);
  const { data: { introOutro }} = activity;

  const updateContent = (content: ActivityContent[]): void => {
    if (!activity) {
      return;
    }
    updateActivity({ content });
  };

  const onChangeContent = (index: number) => (newValue: string) => {
    const newContent = [...introOutro];
    newContent[index].value = newValue;
    updateContent(newContent);
  };

  if (!activity) {
    return (
      <Base>
        <div></div>
      </Base>
    );
  }


  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={['Mix Couplet', 'Intro Outro', "Couplet", "Refrain", 'Prévisualiser']}
          activeStep={1}
        />
        <div className="width-900">
          <h1>Mettre en ligne les pistes sonores du couplet</h1>
          <p> Commencez le paramétrage en mettant en ligne les différentes pistes sonores du couplet : </p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {introOutro.map((c, idx) => (
              <div>{c.label} : {introOutro[idx].display && <AnthemEditor
                  key={c.id}
                  id={c.id}
                  value={c.value}
                  onChange={onChangeContent(idx)}
                  onDelete={() => {
                    deleteContent(idx);
                  }}
                />}{!c.value &&
                  <Button
                  onClick={() => updateActivity(introOutro[idx].display = true)}
                  variant="text"
                  className="navigation__button full-width"
                  style={{
                    justifyContent: 'flex-start',
                    width: 'auto',
                    boxShadow: '0px 4px 7px rgba(0, 0, 0, 0.1)'
                  }}
                  endIcon={<SoundIcon />}
                >
                  Ajouter un son
                </Button>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <StepsButton prev="/parametrer-hymne/1" next="/parametrer-hymne/3" />
    </Base>
  );
};

export default AnthemStep2;
