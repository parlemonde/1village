import { useRouter } from 'next/router';
import React from 'react';

import { FormControl, Select, MenuItem } from '@mui/material';

import { isDefi } from 'src/activity-types/anyActivity';
import { isLanguage, LANGUAGE_OBJECTS } from 'src/activity-types/defi.constants';
import type { LanguageDefiData } from 'src/activity-types/defi.types';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { ContentEditor } from 'src/components/activities/content';
import { getErrorSteps } from 'src/components/activities/defiLanguageChecks';
import { ThemeChoiceButton } from 'src/components/buttons/ThemeChoiceButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { warningColor } from 'src/styles/variables.const';
import { replaceTokens } from 'src/utils';
import type { ActivityContent, ActivityContentType } from 'types/activity.type';

const DefiStep2 = () => {
  const router = useRouter();
  const { activity, updateActivity, addContent, deleteContent } = React.useContext(ActivityContext);

  const data = (activity?.data as LanguageDefiData) || null;
  const explanationContentIndex = Math.max(data?.explanationContentIndex ?? 0, 0);

  const errorSteps = React.useMemo(() => {
    if (data !== null) {
      return getErrorSteps(data, 1);
    }
    return [];
  }, [data]);

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/lancer-un-defi');
    } else if (activity && (!isDefi(activity) || (isDefi(activity) && !isLanguage(activity)))) {
      router.push('/lancer-un-defi');
    }
  }, [activity, router]);

  if (data === null || activity === null || !isDefi(activity) || (isDefi(activity) && !isLanguage(activity))) {
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

  const onObjectChange = (event: React.ChangeEvent<HTMLInputElement | number>) => {
    updateActivity({ data: { ...data, objectIndex: Number((event.target as HTMLInputElement).value) } });
  };

  const onNext = () => {
    router.push('/lancer-un-defi/linguistique/3');
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={['Langue', 'Thème', 'Présentation', 'Défi', 'Prévisualisation']}
          urls={[
            '/lancer-un-defi/linguistique/1?edit',
            '/lancer-un-defi/linguistique/2',
            '/lancer-un-defi/linguistique/3',
            '/lancer-un-defi/linguistique/4',
            '/lancer-un-defi/linguistique/5',
          ]}
          activeStep={1}
          errorSteps={errorSteps}
        />
        <div className="width-900">
          <h1>{'Choisissez le thème de votre défi linguistique'}</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            Vous pourrez ensuite le présenter en détail.
          </p>
          <FormControl variant="outlined" style={{ width: '100%' }}>
            <div
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={data.objectIndex === -1 ? '' : data.objectIndex}
              onChange={onObjectChange}
            >
              {LANGUAGE_OBJECTS.map((l, index) => (
                <ThemeChoiceButton key={index} value={index}>
                  {l.title}
                </ThemeChoiceButton>
              ))}
            </div>
          </FormControl>
          {data.objectIndex !== -1 && (
            <>
              <p className="text" style={{ fontSize: '1.1rem' }}>
                {/* if there is no language selected in the previous step: */}
                {data.language === '' ? (
                  <span style={{ color: warningColor, fontWeight: 'bold' }}>Veuillez choisir une langue à l&apos;étape 1.</span>
                ) : (
                  replaceTokens(LANGUAGE_OBJECTS[data.objectIndex % LANGUAGE_OBJECTS.length].desc1, {
                    language: data.language,
                  })
                )}
                Vous pouvez rajouter une vidéo ou un son pour qu’on entende la prononciation.
              </p>
              <ContentEditor
                content={activity.content.slice(0, explanationContentIndex)}
                updateContent={updateContent}
                addContent={addDescriptionContent}
                deleteContent={deleteDescriptionContent}
              />
            </>
          )}
          <StepsButton prev={`/lancer-un-defi/linguistique/1?edit=${activity?.id}`} next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default DefiStep2;
