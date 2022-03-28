import { useRouter } from 'next/router';
import React from 'react';

import { isAnthem } from 'src/activity-types/anyActivity';
import type { EnigmeData } from 'src/activity-types/enigme.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ActivityContext } from 'src/contexts/activityContext';
import { ButtonBase, Card } from '@mui/material';

import ImageIcon from 'src/svg/editor/image_icon.svg';
import TextIcon from 'src/svg/editor/text_icon.svg';
import { SyllableEditor } from 'src/components/activities/content/editors/SyllableEditor';

const EnigmeStep3 = () => {
  const router = useRouter();
  const { activity, updateActivity, addContent, deleteContent, save } = React.useContext(ActivityContext);
  const { data: { chorus }} = activity;
  const data = (activity?.data as EnigmeData) || null;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/parametrer-hymne/1');
    } else if (activity && !isAnthem(activity)) {
      router.push('/parametrer-hymne/1');
    }
  }, [activity, router]);

  if (data === null || activity === null || !isAnthem(activity)) {
    return <div></div>;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={['Mix Couplet', 'Intro Outro', "Couplet", "Refrain", 'Prévisualiser']}
          activeStep={3}
        />
        <div className="width-900">
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {chorus.map((el, index) => (<SyllableEditor backline={el.back} index={index} update={updateActivity} content={chorus} editable value={el.value}/>))}
          </div>
          <Card style={{ display: 'inline-block' }}>
            <div style={{ display: 'inline-flex', padding: '0.2rem 1rem', alignItems: 'center' }}>
              <span className="text text--bold" style={{ margin: '0 0.5rem' }}>
                Ajouter à votre couplet :
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
                  updateActivity(chorus.push({ value: 'LA', back: false }));

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
                  updateActivity(chorus.push({ value: 'LA', back: true }));
                }}
              >
                <ImageIcon height="1.25rem" />
                <span className="text text--small" style={{ marginTop: '0.1rem' }}>
                  Syllabe à la ligne
                </span>
              </ButtonBase>
            </div>
          </Card>
          <StepsButton prev="/parametrer-hymne/3" next="/parametrer-hymne/5" />
        </div>
      </div>
    </Base>
  );
};

export default EnigmeStep3;
