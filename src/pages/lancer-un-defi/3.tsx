import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';

import { TextField, Button } from '@mui/material';

import { isDefi } from 'src/activity-types/anyActivity';
import { FREE_DEFIS, isFree } from 'src/activity-types/defi.constants';
import type { FreeDefiData } from 'src/activity-types/defi.types';
import { Base } from 'src/components/Base';
import { PageLayout } from 'src/components/PageLayout';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { getErrorSteps } from 'src/components/activities/defiChecksFree';
import { ThemeChoiceButton } from 'src/components/buttons/ThemeChoiceButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { replaceTokens } from 'src/utils';

const FreeDefiStep3 = () => {
  const router = useRouter();
  const { activity, updateActivity } = useContext(ActivityContext);
  const [otherOpen, setIsOtherOpen] = useState(false);

  const data = (activity?.data as FreeDefiData) || null;
  const errorSteps = useMemo(() => {
    const fieldStep2 = activity?.content.filter((d) => d.value !== ''); // if value is empty in step 2
    if (data !== null && fieldStep2?.length === 0) {
      const errors = getErrorSteps(data, 1);
      errors.push(1); //corresponding to step 2
      return errors;
    }
    if (data !== null) return getErrorSteps(data, 1);
    return [];
  }, [activity?.content, data]);

  const c = data?.defi || '';
  const opened = useRef(false);
  useEffect(() => {
    if (c && !opened.current) {
      setIsOtherOpen(true);
      opened.current = true;
    }
  }, [c]);

  useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/lancer-un-defi');
    } else if (activity && (!isDefi(activity) || (isDefi(activity) && !isFree(activity)))) {
      router.push('/lancer-un-defi');
    }
  }, [activity, router]);

  if (data === null || activity === null || !isDefi(activity) || (isDefi(activity) && !isFree(activity))) {
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
    router.push('/lancer-un-defi/4');
  };

  return (
    <Base>
      <PageLayout>
        <Steps
          steps={[data.themeName || 'Thème', 'Action', 'Le défi', 'Prévisualisation']}
          urls={['/lancer-un-defi/1?edit', '/lancer-un-defi/2', '/lancer-un-defi/3', '/lancer-un-defi/4']}
          activeStep={2}
          errorSteps={errorSteps}
        />
        <div className="width-900">
          <h1>Quel d&eacute;fi souhaitez-vous lancer &agrave; vos P&eacute;licopains ?</h1>
          <div style={{ marginTop: '1rem' }}>
            {FREE_DEFIS.map((t, index) => (
              <ThemeChoiceButton
                key={index}
                label={t.title}
                description={replaceTokens(t.description, {
                  theme: data.themeName && data.themeName.length > 0 ? data.themeName : "<thème choisi à l'étape 1>",
                })}
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
                    <TextField
                      variant="standard"
                      value={data.defi || ''}
                      onChange={(event) => {
                        updateActivity({ data: { ...data, defi: event.target.value } });
                      }}
                      style={{ minWidth: '0', flex: 1 }}
                    />
                  </div>
                  <div className="text-center" style={{ marginTop: '0.8rem' }}>
                    <Button color="primary" size="small" variant="outlined" onClick={onClick(-1)}>
                      Continuer
                    </Button>
                  </div>
                </div>
              }
              label="Un autre défi"
              description={`Rédigez vous même le défi pour vos pélicopains !`}
            />
          </div>
          <StepsButton prev="/lancer-un-defi/2" />
        </div>
      </PageLayout>
    </Base>
  );
};

export default FreeDefiStep3;
