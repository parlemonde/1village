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
import { ActivityStatus } from 'types/activity.type';

const PresentationStep2: React.FC = () => {
  const router = useRouter();
  const { activity } = React.useContext(ActivityContext);

  const data = activity?.data || null;
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;

  React.useEffect(() => {
    if ((data === null || !('theme' in data) || data.theme === -1) && !('activity-id' in router.query)) {
      router.push('/se-presenter/thematique/1');
    }
  }, [data, router]);

  if (data === null || !('theme' in data) || data.theme === -1) {
    return <div></div>;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        {activity !== null && <BackButton href={`/se-presenter/thematique/1?edit=${activity.id}`} label={isEdit ? 'Modifier' : 'Retour'} />}
        <Steps steps={['Choix du thème', 'Présentation', 'Prévisualisation']} activeStep={1} />
        <div className="width-900">
          <h1>{PRESENTATION_THEMATIQUE[data.theme].title}</h1>
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
