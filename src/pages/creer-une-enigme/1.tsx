import { useRouter } from 'next/router';
import React from 'react';

import { isEnigme } from 'src/activities/anyActivity';
import { ENIGME_DATA, ENIGME_TYPES } from 'src/activities/enigme.const';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { BackButton } from 'src/components/buttons/BackButton';
import { ThemeChoiceButton } from 'src/components/buttons/ThemeChoiceButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { getQueryString } from 'src/utils';
import { ActivityType } from 'types/activity.type';

const EnigmeStep1: React.FC = () => {
  const router = useRouter();
  const { activity, createNewActivity, updateActivity } = React.useContext(ActivityContext);
  const enigmeTypeIndex =
    activity !== null && 'edit' in router.query && isEnigme(activity)
      ? activity.subType ?? 0
      : parseInt(getQueryString(router.query['category']) ?? '-1', 10) ?? 0;
  const enigmeType = ENIGME_TYPES[enigmeTypeIndex] ?? ENIGME_TYPES[0];
  const enigmeData = ENIGME_DATA[enigmeTypeIndex] ?? ENIGME_DATA[0];

  const onClick = (index: number) => () => {
    updateActivity({ data: { ...activity.data, theme: index } });
    router.push('/creer-une-enigme/2');
  };

  const created = React.useRef(false);
  React.useEffect(() => {
    if (!created.current) {
      if (!('edit' in router.query)) {
        created.current = true;
        createNewActivity(ActivityType.ENIGME, enigmeTypeIndex, {
          theme: 0,
          indiceContentIndex: 1,
        });
      } else if (activity && (!isEnigme(activity) || activity.subType !== enigmeTypeIndex)) {
        created.current = true;
        createNewActivity(ActivityType.ENIGME, enigmeTypeIndex, {
          theme: 0,
          indiceContentIndex: 1,
        });
      }
    }
  }, [activity, createNewActivity, enigmeTypeIndex, router]);

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        {!('edit' in router.query) && <BackButton href="/creer-une-enigme" />}
        <Steps
          steps={['Choix de la catégorie', enigmeType.step2 ?? "Description de l'objet", "Création de l'indice", 'Prévisualisation']}
          activeStep={0}
        />
        <div className="width-900">
          <h1>{enigmeType.titleStep1}</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            {enigmeType.description}
          </p>
          <div>
            {enigmeData.map((t, index) => (
              <ThemeChoiceButton key={index} label={t.label} description={t.description} onClick={onClick(index)} />
            ))}
          </div>
        </div>
      </div>
    </Base>
  );
};

export default EnigmeStep1;
