import { useRouter } from 'next/router';
import React from 'react';

import { isDefi } from 'src/activity-types/anyActivity';
import { isLanguage, LANGUAGE_THEMES } from 'src/activity-types/defi.constants';
import type { LanguageDefiData } from 'src/activity-types/defi.types';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { ContentEditor } from 'src/components/activities/content';
import { getErrorSteps } from 'src/components/activities/defiLanguageChecks';
import { ActivityContext } from 'src/contexts/activityContext';
import type { ActivityContent, ActivityContentType } from 'types/activity.type';

const DefiStep3 = () => {
  const router = useRouter();
  const { activity, updateActivity, addContent, deleteContent, save } = React.useContext(ActivityContext);

  const data = (activity?.data as LanguageDefiData) || null;
  const explanationContentIndex = Math.max(data?.explanationContentIndex ?? 0, 0);

  const errorSteps = React.useMemo(() => {
    if (data !== null) {
      return getErrorSteps(data, 2);
    }
    return [];
  }, [data]);

  const contentAdded = React.useRef(false);
  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/lancer-un-defi');
    } else if (activity && (!isDefi(activity) || (isDefi(activity) && !isLanguage(activity)))) {
      router.push('/lancer-un-defi');
    }

    if (activity && isDefi(activity) && isLanguage(activity)) {
      if ((activity.data.explanationContentIndex ?? 0) > activity.content.length) {
        updateActivity({
          data: {
            ...activity.data,
            explanationContentIndex: activity.content.length,
          },
        });
      }
      if ((activity.data.explanationContentIndex ?? 0) === activity.content.length && !contentAdded.current) {
        contentAdded.current = true;
        addContent('text');
      }
    }
  }, [activity, router, updateActivity, addContent]);

  if (data === null || activity === null || !isDefi(activity) || (isDefi(activity) && !isLanguage(activity))) {
    return <div></div>;
  }

  const updateContent = (content: ActivityContent[]): void => {
    updateActivity({ content: [...activity.content.slice(0, explanationContentIndex), ...content] });
  };
  const addIndiceContent = (type: ActivityContentType, value?: string) => {
    contentAdded.current = true;
    addContent(type, value);
  };
  const deleteIndiceContent = (index: number) => {
    contentAdded.current = true; // delete means there were content already
    deleteContent(explanationContentIndex + index);
  };

  const onNext = () => {
    save().catch(console.error);
    router.push('/lancer-un-defi/linguistique/4');
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={[
            data.languageCode || 'Langue',
            (data.hasSelectedThemeNameOther && data.themeName) || (data.themeIndex !== null && LANGUAGE_THEMES[data.themeIndex].title) || 'Thème',
            'Présentation',
            'Défi',
            'Prévisualisation',
          ]}
          urls={[
            '/lancer-un-defi/linguistique/1?edit',
            '/lancer-un-defi/linguistique/2',
            '/lancer-un-defi/linguistique/3',
            '/lancer-un-defi/linguistique/4',
            '/lancer-un-defi/linguistique/5',
          ]}
          activeStep={2}
          errorSteps={errorSteps}
        />
        <div className="width-900">
          <h1>{'Explication'}</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            {data.hasSelectedThemeNameOther
              ? 'Expliquez pourquoi votre choix, ce qu’il signifie et quand vous l’utilisez.'
              : LANGUAGE_THEMES[data?.defiIndex % LANGUAGE_THEMES.length]?.desc2}
          </p>

          <ContentEditor
            content={activity.content.slice(explanationContentIndex, activity.content.length)}
            updateContent={updateContent}
            addContent={addIndiceContent}
            deleteContent={deleteIndiceContent}
          />

          <StepsButton prev="/lancer-un-defi/linguistique/2" next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default DefiStep3;
