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
import Syllable from 'src/svg/anthem/syllable.svg';
import type { AnthemData } from 'types/anthem.type';

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
      router.push('/admin/newportal/create/parametrer-hymne/1');
    } else if (activity && !isAnthem(activity)) {
      router.push('/admin/newportal/create/parametrer-hymne/1');
    }
  }, [activity, router]);

  if (data === null || activity === null || !isAnthem(activity)) {
    return <div></div>;
  }

  const onNext = () => {
    save().catch(console.error);
    router.push('/admin/newportal/create/parametrer-hymne/4');
  };

  return (
    <PageLayout>
      <Steps
        steps={['Mix Couplet', 'Intro Outro', 'Couplet', 'Refrain', 'Prévisualiser']}
        errorSteps={errorSteps}
        activeStep={2}
        urls={[
          '/admin/newportal/create/parametrer-hymne/1?edit',
          '/admin/newportal/create/parametrer-hymne/2',
          '/admin/newportal/create/parametrer-hymne/3',
          '/admin/newportal/create/parametrer-hymne/4',
          '/admin/newportal/create/parametrer-hymne/5',
        ]}
      />
      <div className={styles.contentContainer}>
        <h1>Paramétrer le couplet</h1>
        <p>Rajouter des syllabes au couplet, soit sur la même ligne, soit en passant à la ligne.</p>
        <div className={styles.contentContainer}>
          <div className={styles.anthemLyricsContainer}>
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
          <Card className={styles.anthemLyricsControlsContainer}>
            <div className={styles.anthemLyricsControls}>
              <span className="text text--bold">Ajouter à votre couplet :</span>
              <ButtonBase
                sx={{
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
                <span className="text text--small">Syllabe</span>
              </ButtonBase>
              <ButtonBase
                sx={{
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
                <span className="text text--small">Syllabe à la ligne</span>
              </ButtonBase>
            </div>
          </Card>
          <StepsButton prev="/admin/newportal/create/parametrer-hymne/2" next={onNext} />
        </div>
      </div>
    </PageLayout>
  );
};

export default AnthemStep3;
