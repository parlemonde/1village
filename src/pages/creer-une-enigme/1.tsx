import { useRouter } from 'next/router';
import React from 'react';

import { Button, TextField } from '@mui/material';

import { isEnigme } from 'src/activity-types/anyActivity';
import { ENIGME_TYPES, getCategoryName } from 'src/activity-types/enigme.constants';
import type { EnigmeData } from 'src/activity-types/enigme.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { BackButton } from 'src/components/buttons/BackButton';
import { ThemeChoiceButton } from 'src/components/buttons/ThemeChoiceButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { getQueryString } from 'src/utils';
import { ActivityStatus, ActivityType } from 'types/activity.type';

const EnigmeStep1 = () => {
  const router = useRouter();
  const { activity, createNewActivity, updateActivity } = React.useContext(ActivityContext);
  const [otherOpen, setIsOtherOpen] = React.useState(false);
  const data = (activity?.data as EnigmeData) || null;
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;

  // enigme sub-type
  const enigmeTypeIndex =
    activity !== null && 'edit' in router.query && isEnigme(activity)
      ? activity.subType ?? 0
      : parseInt(getQueryString(router.query['category']) ?? '-1', 10) ?? 0;

  const c = data?.themeName || '';
  const opened = React.useRef(false);
  React.useEffect(() => {
    if (c && !opened.current) {
      setIsOtherOpen(true);
      opened.current = true;
    }
  }, [c]);

  const created = React.useRef(false);
  React.useEffect(() => {
    if (!created.current) {
      if (!('edit' in router.query)) {
        created.current = true;
        createNewActivity(
          ActivityType.ENIGME,
          enigmeTypeIndex,
          {
            theme: null,
            themeName: '',
            indiceContentIndex: 1,
          },
          null,
          null,
          [
            { type: 'text', id: 0, value: '' }, //empty content for step2
            { type: 'text', id: 1, value: '' }, //empty content for step3
          ],
        );
      } else if (activity && (!isEnigme(activity) || activity.subType !== enigmeTypeIndex)) {
        created.current = true;
        createNewActivity(
          ActivityType.ENIGME,
          enigmeTypeIndex,
          {
            theme: null,
            themeName: '',
            indiceContentIndex: 1,
          },
          null,
          null,
          [
            { type: 'text', id: 0, value: '' }, //empty content for step2
            { type: 'text', id: 1, value: '' }, //empty content for step3
          ],
        );
      }
    }
  }, [activity, createNewActivity, enigmeTypeIndex, router]);

  const onNext = () => {
    router.push('/creer-une-enigme/2');
  };

  if (data === null || activity === null || !isEnigme(activity)) {
    return <div></div>;
  }

  const updateData = (newData: Partial<EnigmeData>) => {
    updateActivity({ data: { ...data, ...newData } });
  };

  const onClick = (index: number) => () => {
    if (index === -1) {
      if (!data.themeName) {
        return;
      }
      updateData({ theme: index, themeName: data.themeName.toLowerCase() });
    } else {
      updateData({ theme: index, themeName: undefined });
    }
    router.push('/creer-une-enigme/2');
  };

  const enigmeType = ENIGME_TYPES[activity.subType ?? 0] ?? ENIGME_TYPES[0];
  const { subCategories } = ENIGME_TYPES[activity.subType ?? 0] ?? ENIGME_TYPES[0];

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        {!isEdit && <BackButton href="/creer-une-enigme" />}
        <Steps
          steps={[getCategoryName(activity.subType, data).title || 'Thème', 'Énigme', 'Réponse', 'Prévisualisation']}
          urls={['/creer-une-enigme/1?edit', '/creer-une-enigme/2', '/creer-une-enigme/3', '/creer-une-enigme/4']}
          activeStep={0}
        />
        <div className="width-900">
          {activity.subType === -1 ? (
            <>
              <h1>Créer une énigme sur un autre thème</h1>
              <p className="text">
                Indiquez le thème de l&apos;énigme que vous souhaitez créer. N&apos;indiquez pas la réponse à votre énigme ici, car ce thème sera
                utilisé comme indice supplémentaire par les Pélicopains.
              </p>
              <TextField
                value={data.themeName || ''}
                onChange={(event) => {
                  updateData({ themeName: event.target.value.slice(0, 400) });
                }}
                label="Énigme à créer"
                variant="outlined"
                placeholder="ex: Un animal"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ width: '100%', margin: '1rem 0 1rem 0' }}
              />
              <StepsButton next={onNext} />
            </>
          ) : (
            <>
              <h1>{enigmeType.titleStep1}</h1>
              <p className="text" style={{ fontSize: '1.1rem' }}>
                {enigmeType.description}
              </p>
              <div>
                {subCategories.map((subCat, index) => (
                  <ThemeChoiceButton key={index} label={subCat.label} description={subCat.description} onClick={onClick(index)} />
                ))}
                <ThemeChoiceButton
                  isOpen={otherOpen}
                  onClick={() => {
                    setIsOtherOpen(!otherOpen);
                  }}
                  additionalContent={
                    <div className="text-center">
                      <h3>Donnez un nom à la catégorie :</h3>
                      <div style={{ display: 'inline-flex', alignItems: 'center', margin: '0.5rem 0' }}>
                        <span style={{ marginRight: '0.3rem' }}>{`${enigmeType.title2} est`}</span>
                        {data !== null && (
                          <TextField
                            variant="standard"
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
            </>
          )}
        </div>
      </div>
    </Base>
  );
};

export default EnigmeStep1;
