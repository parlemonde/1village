import { useRouter } from 'next/router';
import React from 'react';

import { isPresentation } from 'src/activities/anyActivity';
import { isThematique, PRESENTATION_THEMATIQUE } from 'src/activities/presentation.const';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
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
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/se-presenter');
    } else if (activity && (!isPresentation(activity) || !isThematique(activity))) {
      router.push('/se-presenter');
    }
  }, [activity, router]);

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
          <StepsButton prev={`/se-presenter/thematique/1?edit=${activity.id}`} next="/se-presenter/thematique/3" />
        </div>
      </div>
    </Base>
  );
};

export default PresentationStep2;
