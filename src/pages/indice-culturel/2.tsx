import { useRouter } from 'next/router';
import React from 'react';

import { Box } from '@mui/material';

import { isIndice } from 'src/activity-types/anyActivity';
import { getIndice } from 'src/activity-types/indice.constants';
import type { IndiceData } from 'src/activity-types/indice.types';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { ContentEditor } from 'src/components/activities/content';
import { ActivityContext } from 'src/contexts/activityContext';
import type { ActivityContent } from 'types/activity.type';
import { ActivityStatus } from 'types/activity.type';

const IndiceStep2 = () => {
  const router = useRouter();
  const { activity, updateActivity, addContent, deleteContent, save } = React.useContext(ActivityContext);

  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;
  const data = (activity?.data as IndiceData) || null;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/indice-culturel');
    } else if (activity && !isIndice(activity)) {
      router.push('/indice-culturel');
    }
  }, [activity, router]);

  const updateContent = (content: ActivityContent[]): void => {
    if (!activity) {
      return;
    }
    updateActivity({ content });
  };

  const onNext = () => {
    save().catch(console.error);
    router.push('/indice-culturel/3');
  };

  if (activity === null || data === null) {
    return <div></div>;
  }

  return (
    <Base>
      <Box
        sx={{
          width: '100%',
          padding: {
            xs: '0',
            md: '0.5rem 1rem 1rem 1rem',
          },
        }}
      >
        <Steps
          steps={[getIndice(activity.subType, data).step1, "Créer l'indice", 'Prévisualiser']}
          urls={['/indice-culturel/1?edit', '/indice-culturel/2', '/indice-culturel/3']}
          activeStep={isEdit ? 0 : 1}
        />
        <div className="width-900">
          <h1>Créez votre indice</h1>
          <ContentEditor content={activity.content} updateContent={updateContent} addContent={addContent} deleteContent={deleteContent} />
          <StepsButton prev="/indice-culturel/1?edit" next={onNext} />
        </div>
      </Box>
    </Base>
  );
};

export default IndiceStep2;
