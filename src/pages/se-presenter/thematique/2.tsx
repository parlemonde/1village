import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { Button } from '@material-ui/core';

import { PRESENTATION_THEMATIQUE } from 'src/activities/presentation.const';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { SimpleActivityEditor } from 'src/components/activities';
import { BackButton } from 'src/components/buttons/BackButton';
import { ActivityContext } from 'src/contexts/activityContext';

const PresentationStep2: React.FC = () => {
  const router = useRouter();
  const { activity } = React.useContext(ActivityContext);

  const data = activity?.data || null;

  React.useEffect(() => {
    if (data === null || !('theme' in data) || data.theme === -1) {
      router.push('/');
    }
  }, [data, router]);

  if (data === null || !('theme' in data) || data.theme === -1) {
    return <div></div>;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        {activity.id === 0 && <BackButton href="/se-presenter/thematique/1" />}
        <Steps steps={['Choix du thème', 'Présentation', 'Prévisualisation']} activeStep={1} />
        <div style={{ margin: '0 auto 1rem auto', width: '100%', maxWidth: '900px' }}>
          <h1>{PRESENTATION_THEMATIQUE[data.theme as number].title}</h1>
          <SimpleActivityEditor />
          <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
            <Link href="/se-presenter/thematique/3">
              <Button component="a" href="/se-presenter/thematique/3" variant="outlined" color="primary">
                Étape suivante
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Base>
  );
};

export default PresentationStep2;
