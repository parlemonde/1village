import { useRouter } from 'next/router';
import React from 'react';

import { isPresentation } from 'src/activity-types/anyActivity';
import { PRESENTATION_THEMATIQUE, isThematique } from 'src/activity-types/presentation.constants';
import type { ThematiqueData } from 'src/activity-types/presentation.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ThemeChoiceButton } from 'src/components/buttons/ThemeChoiceButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { ActivityStatus } from 'types/activity.type';

const PresentationStep2 = () => {
  const router = useRouter();
  const { activity, updateActivity } = React.useContext(ActivityContext);

  const data = (activity?.data as ThematiqueData) || null;
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/se-presenter');
    } else if (activity && (!isPresentation(activity) || !isThematique(activity))) {
      router.push('/se-presenter');
    }
  }, [activity, router]);

  const onClick = (index: number) => () => {
    updateActivity({ data: { theme: index } });
    router.push('/se-presenter/thematique/3');
  };

  if (data === null || !('theme' in data) || data.theme === -1) {
    return <div></div>;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps steps={(isEdit ? [] : ['Démarrer']).concat(['Choix du thème', 'Présentation', 'Prévisualisation'])} activeStep={isEdit ? 0 : 1} />
        <div className="width-900">
          <h1>Choisissez le thème de votre présentation</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            Dans cette activité, nous vous proposons de faire une présentation générale aux Pélicopains sur le thème de votre choix.
          </p>
          <div>
            {PRESENTATION_THEMATIQUE.map((t, index) => (
              <ThemeChoiceButton key={index} label={t.label} description={t.description} onClick={onClick(index)} />
            ))}
          </div>
          {!isEdit && <StepsButton prev={`/se-presenter/thematique/1?edit=${activity.id}`} />}
        </div>
      </div>
    </Base>
  );
};

export default PresentationStep2;
