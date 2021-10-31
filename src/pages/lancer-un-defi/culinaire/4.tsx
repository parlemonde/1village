import { useRouter } from 'next/router';
import React from 'react';

import { TextField, Button } from '@mui/material';

import { isDefi } from 'src/activity-types/anyActivity';
import { isCooking, COOKING_DEFIS } from 'src/activity-types/defi.constants';
import type { CookingDefiData } from 'src/activity-types/defi.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ThemeChoiceButton } from 'src/components/buttons/ThemeChoiceButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { ActivityStatus } from 'types/activity.type';

const DefiStep4 = () => {
  const router = useRouter();
  const { activity, updateActivity } = React.useContext(ActivityContext);
  const [otherOpen, setIsOtherOpen] = React.useState(false);

  const data = (activity?.data as CookingDefiData) || null;
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
    } else if (activity && (!isDefi(activity) || (isDefi(activity) && !isCooking(activity)))) {
      router.push('/lancer-un-defi');
    }
  }, [activity, router]);

  if (data === null || activity === null || !isDefi(activity) || (isDefi(activity) && !isCooking(activity))) {
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
    router.push('/lancer-un-defi/culinaire/5');
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps steps={(isEdit ? [] : ['Démarrer']).concat(['Votre plat', 'La recette', 'Le défi', 'Prévisualisation'])} activeStep={isEdit ? 2 : 3} />
        <div className="width-900">
          <h1>Quel défi voulez-vous lancer aux Pelicopains ?</h1>
          <div style={{ marginTop: '1rem' }}>
            {COOKING_DEFIS.map((t, index) => (
              <ThemeChoiceButton key={index} label={t.title} description={t.description} onClick={onClick(index)} />
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
          <StepsButton prev="/lancer-un-defi/culinaire/3" />
        </div>
      </div>
    </Base>
  );
};

export default DefiStep4;
