import { Tooltip } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useQueryClient } from 'react-query';

import { isQuestion } from 'src/activity-types/anyActivity';
import type { QuestionActivity } from 'src/activity-types/question.types';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { getActivityPhase } from 'src/components/activities/utils';
import { EditButton } from 'src/components/buttons/EditButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { axiosRequest } from 'src/utils/axiosRequest';
import { ActivityType, ActivityStatus } from 'types/activity.type';
import { UserType } from 'types/user.type';

const Question3 = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = React.useContext(UserContext);
  const { village, selectedPhase } = React.useContext(VillageContext);
  const { activity, save } = React.useContext(ActivityContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const content = React.useMemo(() => activity?.content?.filter((q) => q.value) ?? null, [activity]);
  const questionsCount = content?.length ?? 0;
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;
  const isObservator = user?.type === UserType.OBSERVATOR;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/poser-une-question/1');
    } else if (activity && !isQuestion(activity)) {
      router.push('/poser-une-question/1');
    }
  }, [activity, router]);

  const errorSteps = React.useMemo(() => {
    const fieldStep2 = activity?.content.filter((d) => d.value !== ''); // if value is empty in step 2
    if (fieldStep2?.length === 0) {
      return [1]; //corresponding to step 2
    }
    return [];
  }, [activity?.content]);

  const isValid = errorSteps.length === 0;

  const createQuestionActivity = async (question: string): Promise<boolean> => {
    if (!village) {
      return false;
    }
    const data: Partial<QuestionActivity> = {
      type: ActivityType.QUESTION,
      villageId: village.id,
      phase: getActivityPhase(ActivityType.QUESTION, village.activePhase, selectedPhase),
      data: {},
      content: [
        {
          id: 0,
          type: 'text',
          value: question,
        },
      ],
    };
    const response = await axiosRequest({
      method: 'POST',
      url: '/activities',
      data,
    });
    if (response.error) {
      return false;
    } else {
      return true;
    }
  };

  const onPublish = async () => {
    if (!isValid || !activity || !content) {
      return;
    }
    setIsLoading(true);
    //This condition below may be useless because there is always a draft created with an id !
    if (activity.id !== 0) {
      await Promise.all(content.map((question) => createQuestionActivity(question.value)));
      queryClient.invalidateQueries('activities');
    } else {
      await save(true);
    }
    router.push('/poser-une-question/success');
    setIsLoading(false);
  };

  if (!activity) {
    return (
      <Base>
        <div></div>
      </Base>
    );
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={['Les questions', 'Poser ses questions', 'Prévisualiser']}
          urls={['/poser-une-question/1?edit', '/poser-une-question/2', '/poser-une-question/3']}
          activeStep={2}
          errorSteps={errorSteps}
        />
        <div className="width-900">
          <h1>Prévisualisez vos questions, et envoyez-les</h1>
          <p className="text">
            Voici une pré-visualisation de {questionsCount > 1 ? ' vos questions.' : ' votre question.'}
            {isEdit
              ? questionsCount > 1
                ? " Vous pouvez les modifier à l'étape précédente, et enregistrer vos changements ici."
                : " Vous pouvez la modifier à l'étape précédente, et enregistrer vos changements ici."
              : questionsCount > 1
              ? ' Vous pouvez les modifier, et quand vous êtes prêts : publiez-les dans votre village-monde !'
              : ' Vous pouvez la modifier, et quand vous êtes prêts : publiez-la dans votre village-monde !'}
          </p>

          {isEdit ? (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
              <Link href="/poser-une-question/2" passHref>
                <Button component="a" color="secondary" variant="contained" href="/se-presenter/thematique/2">
                  {"Modifier à l'étape précédente"}
                </Button>
              </Link>
              <Button variant="outlined" color="primary" onClick={onPublish} disabled={isObservator}>
                Enregistrer les changements
              </Button>
            </div>
          ) : (
            <>
              {!isValid && (
                <p>
                  <b>Avant de publier votre question, il faut corriger les étapes incomplètes, marquées en orange.</b>
                </p>
              )}
              <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
                {isObservator ? (
                  <Tooltip title="Action non autorisée" arrow>
                    <span>
                      <Button variant="outlined" color="primary" disabled>
                        Publier
                      </Button>
                    </span>
                  </Tooltip>
                ) : (
                  <Button variant="outlined" color="primary" onClick={onPublish} disabled={!isValid}>
                    Publier
                  </Button>
                )}
              </div>
            </>
          )}

          <div className={classNames('preview-block', { 'preview-block--warning': !isValid })}>
            <EditButton
              onClick={() => {
                router.push('/poser-une-question/2');
              }}
              status={!isValid ? 'warning' : 'success'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            {content &&
              content.map((c, index) => (
                <p key={c.id} style={{ margin: questionsCount > 1 ? '0 0 1rem 0' : 0 }}>
                  {questionsCount > 1 && (
                    <>
                      <span>
                        <strong>Question {index + 1}</strong>
                      </span>

                      <br />
                    </>
                  )}
                  <span>{c.value}</span>
                </p>
              ))}
          </div>

          <StepsButton prev="/poser-une-question/2" />
        </div>
      </div>
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default Question3;
