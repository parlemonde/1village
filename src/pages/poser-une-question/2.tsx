import { useRouter } from 'next/router';
import React from 'react';

import AddIcon from '@mui/icons-material/Add';
import { ButtonBase, TextField, Card } from '@mui/material';

import { isQuestion } from 'src/activity-types/anyActivity';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { DeleteButton } from 'src/components/buttons/DeleteButton';
import { ActivityContext } from 'src/contexts/activityContext';

const Question2 = () => {
  const router = useRouter();
  const { activity, updateActivity, addContent, deleteContent } = React.useContext(ActivityContext);

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/poser-une-question/1');
    } else if (activity && !isQuestion(activity)) {
      router.push('/poser-une-question/1');
    }
  }, [activity, router]);

  const onQuestionChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!activity) {
      return;
    }
    const content = [...activity.content];
    if (!content[index]) {
      return;
    }
    content[index].value = event.target.value.slice(0, 400);
    updateActivity({ content });
  };

  const onAddQuestion = () => {
    if (!activity) {
      return;
    }
    const content = [...activity.content];
    if (content.length >= 3) {
      return;
    }
    addContent('text');
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
        <Steps steps={['Les questions', 'Poser ses questions', 'Prévisualiser']} activeStep={1} />
        <div className="width-900">
          <h1>Vos questions</h1>
          <p className="text">Ici vous pouvez écrire un maximum de trois questions que vous vous posez sur le mode de vie des autres enfants.</p>

          {activity !== null &&
            activity.content.map((c, index) => (
              <div key={c.id} style={{ marginTop: '1rem', position: 'relative' }}>
                {activity.content.length >= 2 && (
                  <DeleteButton
                    confirmLabel={c.value ? 'Voulez vous vraiment supprimer cette question?' : ''}
                    onDelete={() => {
                      deleteContent(index);
                    }}
                    style={{ position: 'absolute', right: '0.25rem', top: '0.25rem', zIndex: 100 }}
                  />
                )}
                <TextField
                  fullWidth
                  multiline
                  variant="outlined"
                  placeholder="Écrivez votre question ici"
                  helperText={`${(c.value || '').length}/400`}
                  value={c.value || ''}
                  onChange={onQuestionChange(index)}
                  FormHelperTextProps={{ style: { textAlign: 'right' } }}
                  sx={{
                    '& fieldset': {
                      borderStyle: 'dashed',
                      borderWidth: '1px!important',
                    },
                  }}
                />
              </div>
            ))}

          {activity && activity.content.length < 3 && activity.id === 0 && (
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

          <StepsButton prev={activity.id === 0 ? '/poser-une-question/1?edit=true' : undefined} next="/poser-une-question/3" />
        </div>
      </div>
    </Base>
  );
};

export default Question2;
