import { useRouter } from 'next/router';
import React from 'react';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { BackButton } from 'src/components/buttons/BackButton';
import { ThemeChoiceButton } from 'src/components/buttons/ThemeChoiceButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { VillageContext } from 'src/contexts/villageContext';
import { ActivityType } from 'types/activity.type';

const PresentationStep1 = () => {
  const router = useRouter();
  const { activity, createNewActivity } = React.useContext(ActivityContext);
  const { selectedPhase } = React.useContext(VillageContext);

  const onNext = () => () => {
    router.push('/se-presenter/thematique/2');
  };

  const created = React.useRef(false);
  React.useEffect(() => {
    if (!created.current) {
      created.current = true;
      if (!('edit' in router.query)) {
        createNewActivity(ActivityType.PRESENTATION, selectedPhase, undefined, {
          theme: 0,
        });
      }
    }
  }, [createNewActivity, router, selectedPhase]);

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
        {!('edit' in router.query) && <BackButton href="/se-presenter" />}
        <Steps steps={['Démarrer', 'Choix du thème', 'Présentation', 'Prévisualisation']} activeStep={0} />
        <div className="width-900">
          <h1>Commencer un nouvel échange avec vos Pélicopains :</h1>
          <div style={{ margin: '1rem 0 3rem 0' }}>
            <ThemeChoiceButton label="Créer une nouvelle présentation" description="" onClick={onNext()} />
          </div>
        </div>
      </div>
    </Base>
  );
};

export default PresentationStep1;
