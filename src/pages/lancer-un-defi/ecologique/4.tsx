import { useRouter } from 'next/router';
import React from 'react';

import { TextField, Button } from '@material-ui/core';

import { isDefi } from 'src/activity-types/anyActivity';
import { isEco, ECO_DEFIS } from 'src/activity-types/defi.const';
import type { EcoDefiData } from 'src/activity-types/defi.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ThemeChoiceButton } from 'src/components/buttons/ThemeChoiceButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { ActivityStatus } from 'types/activity.type';

const DefiEcoStep4 = () => {
  const router = useRouter();
  const { activity, updateActivity } = React.useContext(ActivityContext);
  const [otherOpen, setIsOtherOpen] = React.useState(false);

  const data = (activity?.data as EcoDefiData) || null;
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
    } else if (activity && (!isDefi(activity) || (isDefi(activity) && !isEco(activity)))) {
      router.push('/lancer-un-defi');
    }
  }, [activity, router]);

  if (data === null || !isDefi(activity) || (isDefi(activity) && !isEco(activity))) {
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
    router.push('/lancer-un-defi/ecologique/5');
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={(isEdit ? [] : ['Démarrer']).concat(['Votre geste pour la planète', "Description de l'action", 'Le défi', 'Prévisualisation'])}
          activeStep={isEdit ? 2 : 3}
        />
        <div className="width-900">
          <h1>Quel défi voulez-vous lancer aux Pelicopains ?</h1>
          <div style={{ marginTop: '1rem' }}>
            {ECO_DEFIS.map((t, index) => (
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
          <StepsButton prev="/lancer-un-defi/ecologique/3" />
        </div>
      </div>
    </Base>
  );
};

export default DefiEcoStep4;
