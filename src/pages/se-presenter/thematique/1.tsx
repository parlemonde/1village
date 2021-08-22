import { useRouter } from 'next/router';
import React from 'react';

import { PRESENTATION } from 'src/activity-types/presentation.const';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { ActivitySelect } from 'src/components/activities/ActivitySelect';
import { BackButton } from 'src/components/buttons/BackButton';
import { ThemeChoiceButton } from 'src/components/buttons/ThemeChoiceButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { getQueryString } from 'src/utils';
import { ActivityType } from 'types/activity.type';

const PresentationStep1 = () => {
  const router = useRouter();
  const { activity, createNewActivity, updateActivity } = React.useContext(ActivityContext);
  const selectRef = React.useRef<HTMLDivElement>(null);

  const onNext = (clear: boolean) => () => {
    if (clear) {
      updateActivity({ responseActivityId: null, responseType: null });
    }
    router.push('/se-presenter/thematique/2');
  };
  const onChange = (id: number | null, type: ActivityType | null) => {
    if (activity !== null) {
      updateActivity({ responseActivityId: id, responseType: type });
    }
  };

  const created = React.useRef(false);
  React.useEffect(() => {
    if (!created.current) {
      created.current = true;
      if (!('edit' in router.query)) {
        const responseActivityId =
          'responseActivityId' in router.query ? parseInt(getQueryString(router.query.responseActivityId), 10) ?? null : null;
        const responseActivityType =
          'responseActivityType' in router.query ? parseInt(getQueryString(router.query.responseActivityType), 10) ?? null : null;
        createNewActivity(
          ActivityType.PRESENTATION,
          PRESENTATION.THEMATIQUE,
          {
            theme: 0,
          },
          responseActivityId,
          responseActivityType,
        );
        if (responseActivityId !== null) {
          if (selectRef.current) {
            selectRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    }
  }, [createNewActivity, router]);

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
            <ThemeChoiceButton label="Créer une nouvelle présentation" description="" onClick={onNext(true)} />
          </div>
          <h1>Réagir à une activité déjà publiée par vos Pélicopains :</h1>
          <div ref={selectRef}>
            <ActivitySelect value={activity.responseActivityId} onChange={onChange} onSelect={onNext(false)} style={{ margin: '1rem 0 0 0' }} />
          </div>
        </div>
      </div>
    </Base>
  );
};

export default PresentationStep1;
