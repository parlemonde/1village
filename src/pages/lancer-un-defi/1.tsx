import { useRouter } from 'next/router';
import React from 'react';

import { TextField } from '@mui/material';

import { isDefi } from 'src/activity-types/anyActivity';
import { DEFI, isFree } from 'src/activity-types/defi.constants';
import type { FreeDefiData } from 'src/activity-types/defi.types';
import { Base } from 'src/components/Base';
import { PageLayout } from 'src/components/PageLayout';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { BackButton } from 'src/components/buttons/BackButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { VillageContext } from 'src/contexts/villageContext';
import { ActivityStatus, ActivityType } from 'types/activity.type';

const FreeDefiStep1 = () => {
  const router = useRouter();
  const { activity, createNewActivity, updateActivity, save } = React.useContext(ActivityContext);
  const { selectedPhase } = React.useContext(VillageContext);
  const [showErrors, setShowErrors] = React.useState(false);

  const data = (activity?.data as FreeDefiData) || null;
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;

  const onNext = () => {
    save().catch(console.error);
    window.sessionStorage.setItem(`defi-free-step-1-next`, 'true');
    router.push('/lancer-un-defi/2');
  };

  const created = React.useRef(false);
  React.useEffect(() => {
    if (!created.current) {
      if (!('edit' in router.query)) {
        created.current = true;
        createNewActivity(ActivityType.DEFI, selectedPhase, DEFI.FREE, {
          themeName: '',
          defiIndex: null,
        });
      } else if (activity && (!isDefi(activity) || (isDefi(activity) && !isFree(activity)))) {
        created.current = true;
        createNewActivity(ActivityType.DEFI, selectedPhase, DEFI.FREE, {
          themeName: '',
          defiIndex: null,
        });
      }
    }
  }, [activity, createNewActivity, router, selectedPhase]);

  React.useEffect(() => {
    // if user navigated to the next step already, let's show the errors if there are any.
    if (window.sessionStorage.getItem(`defi-free-step-1-next`) === 'true') {
      setShowErrors(true);
      window.sessionStorage.setItem(`defi-free-step-1-next`, 'false');
    }
  }, []);

  const theme = React.useMemo(() => {
    if (!data || (data && !data.themeName)) return 'Thème';
    return data.themeName;
  }, [data]);

  if (data === null || activity === null || !isDefi(activity) || (isDefi(activity) && !isFree(activity))) {
    return <div></div>;
  }

  return (
    <Base>
      <PageLayout>
        {!isEdit && <BackButton href="/lancer-un-defi" />}
        <Steps
          steps={[theme, 'Action', 'Le défi', 'Prévisualisation']}
          urls={['/lancer-un-defi/1?edit', '/lancer-un-defi/2', '/lancer-un-defi/3', '/lancer-un-defi/4']}
          activeStep={0}
        />
        <div className="width-900">
          <h1>Choisissez le thème de votre défi</h1>
          <TextField
            value={data.themeName}
            onChange={(event) => {
              updateActivity({ data: { themeName: event.target.value.slice(0, 80) } });
            }}
            label="Thème"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            error={showErrors && !data.themeName}
            FormHelperTextProps={{ style: { textAlign: showErrors && !data.themeName ? 'left' : 'right' } }}
            helperText={showErrors && !data.themeName ? 'Ce champ est obligatoire' : `${data.themeName?.length || 0}/80`}
            sx={{ width: '100%', margin: '1rem 0 1rem 0' }}
          />
          {<StepsButton next={onNext} />}
        </div>
      </PageLayout>
    </Base>
  );
};

export default FreeDefiStep1;
