import { useRouter } from 'next/router';
import React from 'react';

import { Button, TextField } from '@material-ui/core';

import { isEnigme } from 'src/activity-types/anyActivity';
import { ENIGME_DATA, ENIGME_TYPES } from 'src/activity-types/enigme.const';
import { EnigmeData } from 'src/activity-types/enigme.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ThemeChoiceButton } from 'src/components/buttons/ThemeChoiceButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { ActivityStatus } from 'types/activity.type';

const EnigmeStep2: React.FC = () => {
  const router = useRouter();
  const { activity, updateActivity } = React.useContext(ActivityContext);
  const data = (activity?.data as EnigmeData) || null;
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/creer-une-enigme');
    } else if (activity && !isEnigme(activity)) {
      router.push('/creer-une-enigme');
    }
  }, [activity, router]);

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
    router.push('/creer-une-enigme/3');
  };

  if (data === null || !isEnigme(activity)) {
    return <div></div>;
  }

  const enigmeType = ENIGME_TYPES[activity.subType ?? 0] ?? ENIGME_TYPES[0];
  const enigmeData = ENIGME_DATA[activity.subType ?? 0] ?? ENIGME_DATA[0];

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={(isEdit ? [] : ['Démarrer']).concat([
            'Choix de la catégorie',
            enigmeType.step2 ?? "Description de l'objet",
            "Création de l'indice",
            'Prévisualisation',
          ])}
          activeStep={isEdit ? 0 : 1}
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
          {!isEdit && <StepsButton prev={`/creer-une-enigme/1?edit=${activity.id}`} />}
        </div>
      </div>
    </Base>
  );
};

export default EnigmeStep2;
