import { TextField, Button } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';

import { isDefi } from 'src/activity-types/anyActivity';
import { isLanguage, LANGUAGE_THEMES } from 'src/activity-types/defi.constants';
import type { LanguageDefiData } from 'src/activity-types/defi.types';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { getErrorSteps } from 'src/components/activities/defiLanguageChecks';
import { ThemeChoiceButton } from 'src/components/buttons/ThemeChoiceButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { replaceTokens } from 'src/utils';

const DefiStep2 = () => {
  const router = useRouter();
  const { activity, updateActivity } = React.useContext(ActivityContext);
  const [isChoiceOtherOpen, setIsChoiceOtherOpen] = React.useState(false);
  const data = (activity?.data as LanguageDefiData) || null;

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

  const onClick = (index: number) => () => {
    if (index === -1) {
      updateActivity({ data: { ...data, themeIndex: null, hasSelectedThemeNameOther: true } });
    } else {
      const newData = data;
      delete newData.defi;
      updateActivity({ data: { ...newData, themeIndex: index, hasSelectedThemeNameOther: false } });
    }
    router.push('/lancer-un-defi/linguistique/3');
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={[data.languageCode || data.themeName || 'Langue', 'Thème', 'Présentation', 'Défi', 'Prévisualisation']}
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
          <h1>Choisissez le thème de votre défi linguistique</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            Vous pourrez ensuite le présenter en détail.
          </p>
          <div>
            {LANGUAGE_THEMES.map((l, index) => (
              <ThemeChoiceButton
                key={index}
                label={l.title}
                description={replaceTokens(l.desc1, {
                  language: data.languageCode && data.languageCode.length > 0 ? data.languageCode : "<langue choisie à l'étape 1>",
                })}
                onClick={onClick(index)}
              />
            ))}
            <ThemeChoiceButton
              isOpen={isChoiceOtherOpen}
              onClick={() => {
                setIsChoiceOtherOpen(!isChoiceOtherOpen);
              }}
              additionalContent={
                <div className="text-center">
                  <h3>Donnez un nom à votre thème :</h3>
                  <div style={{ display: 'inline-flex', alignItems: 'center', margin: '0.5rem 0' }}>
                    <span style={{ marginRight: '0.3rem' }}></span>
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
                    Le thème est un <strong>défi supplémentaire</strong> pour les autres classes.
                  </p>
                  <br />
                  <Button color="primary" size="small" variant="outlined" onClick={onClick(-1)}>
                    Continuer
                  </Button>
                </div>
              }
              label="Autre"
              description={`Choisissez vous-même le thème.`}
            />
          </div>
        </div>
      </div>
    </Base>
  );
};

export default DefiStep2;
