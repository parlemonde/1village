import { useRouter } from 'next/router';
import React from 'react';

import { Button } from '@material-ui/core';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { BackButton } from 'src/components/buttons/BackButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { VillageContext } from 'src/contexts/villageContext';
import { useActivities } from 'src/services/useActivities';
import { ActivityType } from 'types/activity.type';

const Question1: React.FC = () => {
  const router = useRouter();
  const { village } = React.useContext(VillageContext);
  const { createNewActivity } = React.useContext(ActivityContext);
  const { activities } = useActivities({
    limit: 50,
    page: 0,
    countries: village?.countries,
    pelico: true,
    type: 4,
  });

  const questions = React.useMemo(() => {
    const q: Array<{ q: string; activityIndex: number }> = [];
    for (let i = 0, n = activities.length; i < n; i++) {
      for (const content of activities[i].processedContent) {
        q.push({
          q: content.value,
          activityIndex: i,
        });
      }
    }
    return q;
  }, [activities]);

  const onNext = () => {
    const success = createNewActivity(ActivityType.QUESTION);
    if (success) {
      router.push('/poser-une-question/2');
    }
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <BackButton href="/poser-une-question" />
        <Steps steps={['Les questions', 'Poser ses questions', 'Prévisualiser']} activeStep={0} />
        <div className="width-900">
          <h1>Les questions déjà posées</h1>
          <p className="text">
            Vous avez ici les questions qui ont été posées par les Pélicopains, si vous vous posez la même question, vous pouvez cliquer sur “Je me
            pose la même question”. Après avoir pris connaissance des questions des autres vous pourrez proposer vos propres questions.
          </p>

          {questions.map((question, index) => (
            <p key={index}>{question.q}</p>
          ))}

          <div style={{ width: '100%', textAlign: 'right', margin: '3rem 0' }}>
            <Button onClick={onNext} variant="outlined" color="primary">
              Étape suivante
            </Button>
          </div>
        </div>
      </div>
    </Base>
  );
};

export default Question1;
