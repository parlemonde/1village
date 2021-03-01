import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { Button, ButtonBase, TextField, withStyles, Card } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { BackButton } from 'src/components/buttons/BackButton';
import { DeleteButton } from 'src/components/buttons/DeleteButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { ActivityType } from 'types/activity.type';

const StyledTextField = withStyles({
  root: {
    '& fieldset': {
      borderStyle: 'dashed',
      borderWidth: '1px!important',
    },
  },
})(TextField);

const Question2: React.FC = () => {
  const router = useRouter();
  const { activity, updateActivity, addContent, deleteContent } = React.useContext(ActivityContext);

  const activityType = activity?.type || null;
  React.useEffect(() => {
    if (activityType === null || activityType !== ActivityType.QUESTION) {
      router.push('/poser-une-question/1');
    }
  }, [activityType, router]);

  const onQuestionChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const processedContent = [...activity.processedContent];
    if (!processedContent[index]) {
      return;
    }
    processedContent[index].value = event.target.value.slice(0, 400);
    updateActivity({ processedContent });
  };

  const onAddQuestion = () => {
    const processedContent = [...activity.processedContent];
    if (processedContent.length >= 3) {
      return;
    }
    addContent('text');
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        {activity.id === 0 && <BackButton href="/poser-une-question/1" />}
        <Steps steps={['Les questions', 'Poser ses questions', 'Prévisualiser']} activeStep={1} />
        <div className="width-900">
          <h1>Vos questions</h1>
          <p className="text">Ici vous pouvez écrire un maximum de trois questions que vous vous posez sur le mode de vie des autres enfants.</p>

          {activity !== null &&
            activity.processedContent.map((c, index) => (
              <div key={c.id} style={{ marginTop: '1rem', position: 'relative' }}>
                {activity.processedContent.length >= 2 && (
                  <DeleteButton
                    confirmLabel={c.value ? 'Voulez vous vraiment supprimer cette question?' : ''}
                    onDelete={() => {
                      deleteContent(index);
                    }}
                    style={{ position: 'absolute', right: '0.25rem', top: '0.25rem', zIndex: 100 }}
                  />
                )}
                <StyledTextField
                  fullWidth
                  multiline
                  variant="outlined"
                  placeholder="Écrivez votre question ici"
                  helperText={`${(c.value || '').length}/400`}
                  value={c.value || ''}
                  onChange={onQuestionChange(index)}
                  FormHelperTextProps={{ style: { textAlign: 'right' } }}
                />
              </div>
            ))}

          {activity && activity.processedContent.length < 3 && activity.id === 0 && (
            <div className="text-center">
              <Card style={{ display: 'inline-block' }}>
                <ButtonBase onClick={onAddQuestion}>
                  <div style={{ display: 'inline-flex', padding: '0.2rem 1rem', alignItems: 'center' }}>
                    <AddIcon color="primary" />
                    <span className="text text--bold" style={{ margin: '0 0.5rem' }}>
                      Ajouter une autre question
                    </span>
                  </div>
                </ButtonBase>
              </Card>
            </div>
          )}

          <div style={{ width: '100%', textAlign: 'right', margin: '3rem 0' }}>
            <Link href="/poser-une-question/3">
              <Button component="a" href="/poser-une-question/3" variant="outlined" color="primary">
                Étape suivante
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Base>
  );
};

export default Question2;
