import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';
import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import { isQuestion } from 'src/activity-types/anyActivity';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { EditButton } from 'src/components/buttons/EditButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { ActivityType } from 'types/activity.type';

const Question3 = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);
  const { activity, save } = React.useContext(ActivityContext);
  const [isLoading, setIsLoading] = React.useState(false);

  const content = React.useMemo(() => activity?.content?.filter((q) => q.value) ?? null, [activity]);
  const questionsCount = content?.length ?? 0;
  const isEdit = activity !== null && activity.id !== 0;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/poser-une-question/1');
    } else if (activity && !isQuestion(activity)) {
      router.push('/poser-une-question/1');
    }
  }, [activity, router]);

  const createQuestionActivity = async (question: string): Promise<boolean> => {
    const data = {
      type: ActivityType.QUESTION,
      villageId: village?.id,
      content: [
        {
          key: 'text',
          value: question,
        },
        {
          key: 'json',
          value: JSON.stringify({
            type: 'data',
            data: {},
          }),
        },
      ],
    };
    const response = await axiosLoggedRequest({
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
    if (!activity || !content) {
      return;
    }

    setIsLoading(true);
    if (activity.id === 0) {
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
        <Steps steps={['Les questions', 'Poser ses questions', 'Prévisualiser']} activeStep={2} />
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
              <Button variant="outlined" color="primary" onClick={onPublish}>
                Enregistrer les changements
              </Button>
            </div>
          ) : (
            <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
              <Button variant="outlined" color="primary" onClick={onPublish}>
                Publier
              </Button>
            </div>
          )}
          <div className="preview-block">
            <EditButton
              onClick={() => {
                router.push('/poser-une-question/2');
              }}
              status={'success'}
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
