import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';

import { FormControl, Select, MenuItem } from '@mui/material';

import { isDefi } from 'src/activity-types/anyActivity';
import { isLanguage, LANGUAGE_OBJECTS } from 'src/activity-types/defi.constants';
import type { LanguageDefiData } from 'src/activity-types/defi.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ContentEditor } from 'src/components/activities/content';
import { ActivityContext } from 'src/contexts/activityContext';
import { replaceTokens } from 'src/utils';
import type { ActivityContent, ActivityContentType } from 'types/activity.type';
import { ActivityStatus } from 'types/activity.type';

const DefiStep3 = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { activity, updateActivity, addContent, deleteContent, save } = React.useContext(ActivityContext);

  const data = (activity?.data as LanguageDefiData) || null;
  const explanationContentIndex = Math.max(data?.explanationContentIndex ?? 0, 0);
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/lancer-un-defi');
    } else if (activity && (!isDefi(activity) || (isDefi(activity) && !isLanguage(activity)))) {
      router.push('/lancer-un-defi');
    }
  }, [activity, router]);

  if (data === null || !isDefi(activity) || (isDefi(activity) && !isLanguage(activity))) {
    return <div></div>;
  }

  const updateContent = (content: ActivityContent[]): void => {
    updateActivity({ content: [...content, ...activity.content.slice(explanationContentIndex, activity.content.length)] });
  };
  const addDescriptionContent = (type: ActivityContentType, value?: string) => {
    addContent(type, value, explanationContentIndex);
    updateActivity({ data: { ...data, explanationContentIndex: explanationContentIndex + 1 } });
  };
  const deleteDescriptionContent = (index: number) => {
    deleteContent(index);
    updateActivity({ data: { ...data, explanationContentIndex: explanationContentIndex - 1 } });
  };

  const onObjectChange = (event: React.ChangeEvent<{ value: number }>) => {
    updateActivity({ data: { ...data, objectIndex: event.target.value } });
  };

  const onNext = () => {
    if (data.objectIndex === -1) {
      return;
    }
    if (explanationContentIndex === 0) {
      enqueueSnackbar('Il faut au moins un bloc de texte, image, son ou vidéo avant de continuer.', {
        variant: 'error',
      });
      return;
    }
    router.push('/lancer-un-defi/linguistique/4');
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={(isEdit ? [] : ['Démarrer']).concat(['Choix de la langue', "Choix de l'objet", 'Explication', 'Le défi', 'Prévisualisation'])}
          activeStep={isEdit ? 1 : 2}
        />
        <div className="width-900">
          <h1>{"Choix de l'objet"}</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            Choisissez ce que vous souhaitez présenter :
          </p>
          <FormControl variant="outlined" style={{ width: '100%' }}>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={data.objectIndex === -1 ? '' : data.objectIndex}
              onChange={onObjectChange}
            >
              {LANGUAGE_OBJECTS.map((l, index) => (
                <MenuItem key={index} value={index}>
                  {l.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {data.objectIndex !== -1 && (
            <>
              <p className="text" style={{ fontSize: '1.1rem' }}>
                {replaceTokens(LANGUAGE_OBJECTS[data.objectIndex % LANGUAGE_OBJECTS.length].desc1, {
                  language: data.language,
                })}{' '}
                Vous pouvez rajouter une vidéo ou un son pour qu’on entende la prononciation.
              </p>
              <ContentEditor
                content={activity.content.slice(0, explanationContentIndex)}
                updateContent={updateContent}
                addContent={addDescriptionContent}
                deleteContent={deleteDescriptionContent}
                save={save}
              />
            </>
          )}
          <StepsButton prev="/lancer-un-defi/linguistique/2" next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default DefiStep3;
