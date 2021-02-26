import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { BackButton } from 'src/components/buttons/BackButton';
import { EditButton } from 'src/components/buttons/EditButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { successColor } from 'src/styles/variables.const';

const Question3: React.FC = () => {
  const router = useRouter();
  const { activity, save } = React.useContext(ActivityContext);
  const [isLoading, setIsLoading] = React.useState(false);

  const processedContent = React.useMemo(() => activity?.processedContent?.filter((q) => q.value) ?? null, [activity]);
  const questionsCount = processedContent?.length ?? 0;
  const isEdit = activity !== null && activity.id !== 0;

  React.useEffect(() => {
    if (processedContent === null && !('activity-id' in router.query)) {
      router.push('/poser-une-question/1');
    }
  }, [router, processedContent]);

  const onPublish = async () => {
    setIsLoading(true);
    const success = await save();
    if (success) {
      router.push('/poser-une-question/success');
    }
    setIsLoading(false);
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <BackButton href="/poser-une-question/2" />
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
              <Link href="/poser-une-question/2">
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
              isGreen
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            {processedContent &&
              processedContent.map((c, index) => (
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
        </div>
      </div>
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default Question3;
