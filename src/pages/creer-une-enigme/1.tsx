import { useRouter } from 'next/router';
import React from 'react';

import { isEnigme } from 'src/activity-types/anyActivity';
import { ENIGME_TYPES } from 'src/activity-types/enigme.constants';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { ActivitySelect } from 'src/components/activities/ActivitySelect';
import { BackButton } from 'src/components/buttons/BackButton';
import { ThemeChoiceButton } from 'src/components/buttons/ThemeChoiceButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { getQueryString } from 'src/utils';
import { ActivityType } from 'types/activity.type';

const EnigmeStep1 = () => {
  const router = useRouter();
  const { activity, createNewActivity, updateActivity } = React.useContext(ActivityContext);
  const selectRef = React.useRef<HTMLDivElement>(null);

  // enigme sub-type
  const enigmeTypeIndex =
    activity !== null && 'edit' in router.query && isEnigme(activity)
      ? activity.subType ?? 0
      : parseInt(getQueryString(router.query['category']) ?? '-1', 10) ?? 0;
  const enigmeType = ENIGME_TYPES[enigmeTypeIndex] ?? ENIGME_TYPES[0];

  const onNext = (clear: boolean) => () => {
    if (clear) {
      updateActivity({ responseActivityId: null, responseType: null });
    }
    router.push('/creer-une-enigme/2');
  };
  const onChange = (id: number | null, type: ActivityType | null) => {
    if (activity !== null) {
      updateActivity({ responseActivityId: id, responseType: type });
    }
  };

  const created = React.useRef(false);
  React.useEffect(() => {
    if (!created.current) {
      const responseActivityId = 'responseActivityId' in router.query ? parseInt(getQueryString(router.query.responseActivityId), 10) ?? null : null;
      const responseActivityType =
        'responseActivityType' in router.query ? parseInt(getQueryString(router.query.responseActivityType), 10) ?? null : null;
      if (!('edit' in router.query)) {
        created.current = true;
        createNewActivity(
          ActivityType.ENIGME,
          enigmeTypeIndex,
          {
            theme: 0,
            indiceContentIndex: 1,
            timer: 0,
          },
          responseActivityId,
          responseActivityType,
        );
        if (responseActivityId !== null) {
          if (selectRef.current) {
            selectRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }
      } else if (activity && (!isEnigme(activity) || activity.subType !== enigmeTypeIndex)) {
        created.current = true;
        createNewActivity(
          ActivityType.ENIGME,
          enigmeTypeIndex,
          {
            theme: 0,
            indiceContentIndex: 1,
            timer: 0,
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
  }, [activity, createNewActivity, enigmeTypeIndex, router]);

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
        {!('edit' in router.query) && <BackButton href="/creer-une-enigme" />}
        <Steps
          steps={['Démarrer', 'Choix de la catégorie', enigmeType.step2 ?? "Description de l'objet", "Création de l'indice", 'Prévisualisation']}
          activeStep={0}
        />
        <div className="width-900">
          <h1>Commencer un nouvel échange avec vos Pélicopains :</h1>
          <div style={{ margin: '1rem 0 3rem 0' }}>
            <ThemeChoiceButton label="Créer une nouvelle énigme" description="" onClick={onNext(true)} />
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

export default EnigmeStep1;
