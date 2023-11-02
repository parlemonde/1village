import { useRouter } from 'next/router';
import React from 'react';

import { TextField, Button } from '@mui/material';

import { isDefi } from 'src/activity-types/anyActivity';
import { isLanguage, LANGUAGE_DEFIS, LANGUAGE_THEMES } from 'src/activity-types/defi.constants';
import type { LanguageDefiData } from 'src/activity-types/defi.types';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { getErrorSteps } from 'src/components/activities/defiLanguageChecks';
import { ThemeChoiceButton } from 'src/components/buttons/ThemeChoiceButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { replaceTokens } from 'src/utils';

const DefiStep4 = () => {
  const router = useRouter();
  const { activity, updateActivity } = React.useContext(ActivityContext);
  const [otherOpen, setIsOtherOpen] = React.useState(false);

  const data = (activity?.data as LanguageDefiData) || null;

  const errorSteps = React.useMemo(() => {
    const fieldStep3 = activity?.content.slice(1, activity?.content.length).filter((d) => d.value !== '' && d.value !== '<p></p>\n'); // if value is empty in step 3

    if (data !== null) {
      const errors = getErrorSteps(data, 3); // corresponde to step 1
      if (fieldStep3?.length === 0) errors.push(2); //corresponding to step 3
      return errors;
    }
    return [];
  }, [activity?.content, data]);

  const c = data?.defi || '';
  const opened = React.useRef(false);
  React.useEffect(() => {
    if (c && !opened.current) {
      setIsOtherOpen(true);
      opened.current = true;
    }
  }, [c]);

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

  const onClick = (index: number) => () => {
    if (index === -1) {
      updateActivity({ data: { ...data, defi: data.defi?.toLowerCase(), hasSelectedDefiNameOther: true } });
    } else {
      const newData = data;
      delete newData.defi;
      updateActivity({ data: { ...newData, defiIndex: index, hasSelectedDefiNameOther: false } });
    }
    router.push('/lancer-un-defi/linguistique/5');
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
          activeStep={3}
          errorSteps={errorSteps}
        />
        <div className="width-900">
          <h1>Quel défi voulez-vous lancer aux Pelicopains ?</h1>
          <div style={{ marginTop: '1rem' }}>
            {LANGUAGE_DEFIS.map((t, index) => (
              <ThemeChoiceButton
                key={index}
                label={replaceTokens(t.title, {
                  theme: data.hasSelectedThemeNameOther
                    ? data.themeName
                    : (data.themeIndex !== null && LANGUAGE_THEMES[data.themeIndex].title.toLowerCase()) || " < thème choisi à l'étape 2 > ",
                  language: data.languageCode && data.languageCode.length > 0 ? data.languageCode : "< langue choisie à l'étape 1 > ",
                })}
                description={t.description}
                onClick={onClick(index)}
              />
            ))}
            <ThemeChoiceButton
              isOpen={otherOpen}
              onClick={() => {
                setIsOtherOpen(!otherOpen);
              }}
              additionalContent={
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', margin: '0.5rem 0' }}>
                    <span style={{ marginRight: '0.3rem' }}>Défi : </span>
                    {data !== null && (
                      <TextField
                        variant="standard"
                        value={data.defi || ''}
                        onChange={(event) => {
                          updateActivity({ data: { ...data, defi: event.target.value } });
                        }}
                        style={{ minWidth: '0', flex: 1 }}
                      />
                    )}
                  </div>
                  <div className="text-center" style={{ marginTop: '0.8rem' }}>
                    <Button color="primary" size="small" variant="outlined" onClick={onClick(-1)}>
                      Continuer
                    </Button>
                  </div>
                </div>
              }
              label="Un autre défi"
              description={`Rédigez vous même le défi pour vos Pelicopains !`}
            />
          </div>
          <StepsButton prev="/lancer-un-defi/linguistique/3" />
        </div>
      </div>
    </Base>
  );
};

export default DefiStep4;
