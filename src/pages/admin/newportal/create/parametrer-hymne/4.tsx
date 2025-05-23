import { useRouter } from 'next/router';
import React from 'react';

import { ButtonBase, Card } from '@mui/material';

import styles from '../../../../../styles/parametrer-hymne.module.css';
import { isAnthem } from 'src/activity-types/anyActivity';
import { PageLayout } from 'src/components/PageLayout';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { getErrorSteps } from 'src/components/activities/anthemChecks';
import { SyllableEditor } from 'src/components/activities/content/editors/SyllableEditor';
import { ActivityContext } from 'src/contexts/activityContext';
import SyllableBackline from 'src/svg/anthem/syllable-backline.svg';
import SyllableIcon from 'src/svg/anthem/syllable.svg';
import type { AnthemData, Syllable } from 'types/anthem.type';

const AnthemStep4 = () => {
  const router = useRouter();
  const { activity, updateActivity, save } = React.useContext(ActivityContext);
  const data = (activity?.data as AnthemData) || null;

  const errorSteps = React.useMemo(() => {
    if (data !== null) {
      return getErrorSteps(data, 3);
    }
    return [];
  }, [data]);

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/admin/newportal/create/parametrer-hymne/1');
    } else if (activity && !isAnthem(activity)) {
      router.push('/admin/newportal/create/parametrer-hymne/1');
    }
  }, [activity, router]);

  if (data === null || activity === null || !isAnthem(activity)) {
    return <div></div>;
  }

  const updateChorus = (chorusLyrics: Syllable[]) => {
    // const newActivity = { ...activity, data: { ...data, chorusLyrics }, status: 1, villageId: 0 };
    // updateActivity(newActivity);
    updateActivity({ data: { ...data, chorusLyrics }, status: 1 });
  };

  const onNext = () => {
    save().catch(console.error);
    router.push('/admin/newportal/create/parametrer-hymne/5');
  };

  if (!data) {
    return <div></div>;
  }

  return (
    <PageLayout>
      <Steps
        steps={['Mix Couplet', 'Intro Outro', 'Couplet', 'Refrain', 'Prévisualiser']}
        errorSteps={errorSteps}
        activeStep={3}
        urls={[
          '/admin/newportal/create/parametrer-hymne/1?edit',
          '/admin/newportal/create/parametrer-hymne/2',
          '/admin/newportal/create/parametrer-hymne/3',
          '/admin/newportal/create/parametrer-hymne/4',
          '/admin/newportal/create/parametrer-hymne/5',
        ]}
      />
      <div className={styles.contentContainer}>
        <h1>Paramétrer le refrain</h1>
        <p>
          Rajouter des syllabes au refrain, soit sur la même ligne, soit en passant à la ligne. Puis remplacez les &quot;La&quot; par les syllabes du
          refrain.
        </p>
        <div className="width-900">
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {data.chorusLyrics.map((el, index) => (
              <SyllableEditor
                key={`syllableEditor--chorus--${index}`}
                value={el}
                onChange={(newValue) => {
                  const newChorus = [...data.chorusLyrics];
                  newChorus[index] = newValue;
                  updateChorus(newChorus);
                }}
                onDelete={() => {
                  const newChorus = [...data.chorusLyrics];
                  const deleted = newChorus.splice(index, 1);
                  if (deleted.length > 0 && deleted[0].back && newChorus.length > index) {
                    newChorus[index] = { ...newChorus[index], back: true };
                  }
                  updateChorus(newChorus);
                }}
              />
            ))}
          </div>
          <Card className={styles.anthemLyricsControlsContainer}>
            <div className={styles.anthemLyricsControls}>
              <span className="text text--bold">Ajouter à votre couplet :</span>
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
                  data?.chorusLyrics.push({ value: 'LA', back: false });
                  updateActivity({ data: { ...data } });
                }}
              >
                <SyllableIcon height="1.25rem" />
                <span className="text text--small">Syllabe</span>
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
                  data?.chorusLyrics.push({ value: 'LA', back: true });
                  updateActivity({ data: { ...data } });
                }}
              >
                <SyllableBackline height="1.55rem" />
                <span className="text text--small">Syllabe à la ligne</span>
              </ButtonBase>
            </div>
          </Card>
          <StepsButton prev="/admin/newportal/create/parametrer-hymne/3" next={onNext} />
        </div>
      </div>
    </PageLayout>
  );
};

export default AnthemStep4;
