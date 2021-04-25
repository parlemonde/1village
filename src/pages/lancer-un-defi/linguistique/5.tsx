import { useRouter } from 'next/router';
import React from 'react';

import { TextField, Button } from '@material-ui/core';

import { isDefi } from 'src/activity-types/anyActivity';
import { isLanguage, LANGUAGE_DEFIS, LANGUAGE_OBJECTS } from 'src/activity-types/defi.const';
import { LanguageDefiData } from 'src/activity-types/defi.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ThemeChoiceButton } from 'src/components/buttons/ThemeChoiceButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { useLanguages } from 'src/services/useLanguages';
import { replaceTokens } from 'src/utils';
import { ActivityStatus } from 'types/activity.type';

const DefiStep6: React.FC = () => {
  const router = useRouter();
  const { activity, updateActivity } = React.useContext(ActivityContext);
  const [otherOpen, setIsOtherOpen] = React.useState(false);
  const { languages } = useLanguages();

  const data = (activity?.data as LanguageDefiData) || null;
  const selectedLanguage = languages.find((l) => l.alpha2.toLowerCase() === data.languageCode.slice(0, 2))?.french ?? '';
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;

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

  if (data === null || !isDefi(activity) || (isDefi(activity) && !isLanguage(activity))) {
    return <div></div>;
  }

  const onClick = (index: number) => () => {
    if (index === -1) {
      if (!data.defi) {
        return;
      }
      updateActivity({ data: { ...data, defiIndex: index, defi: data.defi.toLowerCase() } });
    } else {
      const newData = data;
      delete newData.defi;
      updateActivity({ data: { ...newData, defiIndex: index } });
    }
    router.push('/lancer-un-defi/linguistique/6');
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={(isEdit ? [] : ['Démarrer']).concat(['Choix de la langue', "Choix de l'objet", 'Explication', 'Le défi', 'Prévisualisation'])}
          activeStep={isEdit ? 3 : 4}
        />
        <div className="width-900">
          <h1>Quel défi voulez-vous lancer aux Pelicopains ?</h1>
          <div style={{ marginTop: '1rem' }}>
            {LANGUAGE_DEFIS.map((t, index) => (
              <ThemeChoiceButton
                key={index}
                label={
                  data.objectIndex === 4 && index === 0
                    ? 'Trouvez la même chose dans une autre langue'
                    : replaceTokens(t.title, {
                        object:
                          index === 0
                            ? LANGUAGE_OBJECTS[data.objectIndex % LANGUAGE_OBJECTS.length].title.toLowerCase()
                            : LANGUAGE_OBJECTS[data.objectIndex % LANGUAGE_OBJECTS.length].title2,
                        language: selectedLanguage,
                      })
                }
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
              description={`Réfigez vous même le défi pour vos Pelicopains !`}
            />
          </div>
          <StepsButton prev="/lancer-un-defi/linguistique/4" />
        </div>
      </div>
    </Base>
  );
};

export default DefiStep6;
