import { useRouter } from 'next/router';
import React from 'react';

import { Button, TextField } from '@material-ui/core';

import { isEnigme } from 'src/activity-types/anyActivity';
import { ENIGME_DATA, ENIGME_TYPES } from 'src/activity-types/enigme.const';
import { EnigmeData } from 'src/activity-types/enigme.types';
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

  const data = (activity?.data as EnigmeData) || null;

  const onClick = (index: number) => () => {
    if (index === -1) {
      if (!data.themeName) {
        return;
      }
      updateActivity({ data: { ...data, theme: index, themeName: data.themeName.toLowerCase() } });
    } else {
      const newData = data;
      delete newData.themeName;
      updateActivity({ data: { ...newData, theme: index } });
    }
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
          timer: 0,
        });
      } else if (activity && (!isEnigme(activity) || activity.subType !== enigmeTypeIndex)) {
        created.current = true;
        createNewActivity(ActivityType.ENIGME, enigmeTypeIndex, {
          theme: 0,
          indiceContentIndex: 1,
          timer: 0,
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
            <ThemeChoiceButton
              additionalContent={
                <div className="text-center">
                  <h3>Donnez un nom à la catégorie :</h3>
                  <div style={{ display: 'inline-flex', alignItems: 'center', margin: '0.5rem 0' }}>
                    <span style={{ marginRight: '0.3rem' }}>{`${enigmeType.title2} est`}</span>
                    {data !== null && (
                      <TextField
                        value={data.themeName || ''}
                        onChange={(event) => {
                          updateActivity({ data: { ...data, themeName: event.target.value } });
                        }}
                      />
                    )}
                  </div>
                  <br />
                  <p
                    className="text text--small"
                    style={{
                      display: 'inline-block',
                      textAlign: 'justify',
                      padding: '4px',
                      border: '1px dashed',
                      borderRadius: '4px',
                      maxWidth: '480px',
                    }}
                  >
                    Ne donnez pas le nom de votre {enigmeType.title.toLowerCase()}. La catégorie de {"l'énigme"} est un{' '}
                    <strong>indice supplémentaire</strong> pour les autres classes.
                  </p>
                  <br />
                  <Button color="primary" size="small" variant="outlined" onClick={onClick(-1)}>
                    Continuer
                  </Button>
                </div>
              }
              label="Autre"
              description={`Présentez ${enigmeType.title3} d’une autre catégorie.`}
            />
          </div>
        </div>
      </div>
    </Base>
  );
};

export default EnigmeStep1;
