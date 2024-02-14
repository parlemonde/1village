import { useRouter } from 'next/router';
import React from 'react';

import { ButtonBase, Card } from '@mui/material';

import type { AnthemData } from 'src/activity-types/anthem.types';
import { isAnthem } from 'src/activity-types/anyActivity';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { getErrorSteps } from 'src/components/activities/anthemChecks';
import { SyllableEditor } from 'src/components/activities/content/editors/SyllableEditor';
import { ActivityContext } from 'src/contexts/activityContext';
import SyllableBackline from 'src/svg/anthem/syllable-backline.svg';
import Syllable from 'src/svg/anthem/syllable.svg';

const AnthemStep3 = () => {
  const router = useRouter();
  const { activity, updateActivity, save } = React.useContext(ActivityContext);
  const data = (activity?.data as AnthemData) || null;

  const errorSteps = React.useMemo(() => {
    if (data !== null) {
      return getErrorSteps(data, 2);
    }
    return [];
  }, [data]);

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

  const onNext = () => {
    save().catch(console.error);
    router.push('/parametrer-hymne/4');
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={['Mix Couplet', 'Intro Outro', 'Couplet', 'Refrain', 'Prévisualiser']}
          errorSteps={errorSteps}
          activeStep={2}
          urls={['/parametrer-hymne/1', '/parametrer-hymne/2', '/parametrer-hymne/3', '/parametrer-hymne/4', '/parametrer-hymne/5']}
        />
        <h1>Paramétrer le couplet</h1>
        <p>Rajouter des syllabes au couplet, soit sur la même ligne, soit en passant à la ligne.</p>
        <div className="width-900">
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {data.verseLyrics.map((el, index) => (
              <SyllableEditor
                key={`syllableEditor--${index}`}
                value={el}
                onDelete={() => {
                  const verseLyrics = [...data.verseLyrics];
                  const deleted = verseLyrics.splice(index, 1);
                  if (deleted.length > 0 && deleted[0].back && verseLyrics.length > index) {
                    verseLyrics[index] = { ...verseLyrics[index], back: true };
                  }
                  updateActivity({ data: { ...data, verseLyrics } });
                }}
              />
            ))}
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
                  const verseLyrics = [...data.verseLyrics];
                  verseLyrics.push({ value: 'LA', back: false });
                  updateActivity({ data: { ...data, verseLyrics } });
                }}
              >
                <Syllable height="1.25rem" />
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
                  const verseLyrics = [...data.verseLyrics];
                  verseLyrics.push({ value: 'LA', back: true });
                  updateActivity({ data: { ...data, verseLyrics } });
                }}
              >
                <SyllableBackline height="1.55rem" />
                <span className="text text--small" style={{ marginTop: '0.1rem' }}>
                  Syllabe à la ligne
                </span>
              </ButtonBase>
            </div>
          </Card>
          <StepsButton prev="/parametrer-hymne/2" next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default AnthemStep3;
