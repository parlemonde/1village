import { useRouter } from 'next/router';
import React from 'react';

import { Button } from '@material-ui/core';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { BackButton } from 'src/components/buttons/BackButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { ActivityType } from 'types/activity.type';

const Question1: React.FC = () => {
  const router = useRouter();
  const { createNewActivity } = React.useContext(ActivityContext);

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
