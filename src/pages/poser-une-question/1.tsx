import { useRouter } from 'next/router';
import React from 'react';

import { Button } from '@material-ui/core';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { ExtendedActivity } from 'src/components/activities/editing.types';
import { BackButton } from 'src/components/buttons/BackButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { useActivities } from 'src/services/useActivities';
import { useActivityRequests } from 'src/services/useActivity';
import { useVillageUsers } from 'src/services/useVillageUsers';
import { bgPage } from 'src/styles/variables.const';
import { getGravatarUrl } from 'src/utils';
import { ActivityType } from 'types/activity.type';
import { UserType } from 'types/user.type';

const Question1: React.FC = () => {
  const router = useRouter();
  const { user } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);
  const { createNewActivity } = React.useContext(ActivityContext);
  const { users } = useVillageUsers();
  const { activities } = useActivities({
    limit: 50,
    page: 0,
    countries: village?.countries,
    pelico: true,
    type: 4,
  });
  const { updatedActivityData } = useActivityRequests();
  const userMap = React.useMemo(
    () =>
      users.reduce<{ [key: number]: number }>((acc, u, index) => {
        acc[u.id] = index;
        return acc;
      }, {}),
    [users],
  );

  const questions = React.useMemo(() => {
    const q: Array<{ q: string; activityIndex: number }> = [];
    for (let i = 0, n = activities.length; i < n; i++) {
      q.push({
        q: activities[i].processedContent[0].value,
        activityIndex: i,
      });
    }
    return q;
  }, [activities]);

  const onNext = () => {
    const success = createNewActivity(ActivityType.QUESTION);
    if (success) {
      router.push('/poser-une-question/2');
    }
  };

  const onAskSame = (activity: ExtendedActivity, askSame: number[]) => async () => {
    if (!user || !user.id) {
      return;
    }

    const index = askSame.findIndex((i) => i === user.id);
    if (index !== -1) {
      askSame.splice(index, 1);
    } else {
      askSame.push(user.id);
    }
    await updatedActivityData(activity, {
      askSame: askSame.join(','),
    });
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

          {questions.length === 0 && (
            <div style={{ backgroundColor: bgPage, padding: '0.5rem 1rem', borderRadius: '10px', margin: '1rem 0' }}>
              <p style={{ margin: '0' }} className="text text--bold">
                {"Aucune question n'a été posée dans votre village monde, soyez la première classe à poser une question !"}
              </p>
            </div>
          )}

          {questions.map((question, index) => {
            const activity = activities[question.activityIndex];
            if (!activity) {
              return null;
            }
            const questionUser = users[userMap[activity.userId]];
            if (!questionUser) {
              return null;
            }
            const isSelf = questionUser?.id === user?.id;
            const isPelico = questionUser?.type ?? UserType.TEACHER >= UserType.MEDIATOR;
            const askSame = !activity.data.askSame ? [] : ((activity.data.askSame as string) || '').split(',').map((n) => parseInt(n, 10) || 0);
            return (
              <div key={index} style={{ display: 'flex', alignItems: 'flex-start', margin: '1rem 0' }}>
                {questionUser && (
                  <img
                    alt="Image de profil"
                    src={getGravatarUrl(questionUser.email)}
                    width="40px"
                    height="40px"
                    style={{ borderRadius: '20px', margin: '0.25rem' }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0, backgroundColor: bgPage, padding: '0.5rem 1rem', borderRadius: '10px' }}>
                  <p style={{ margin: '0' }} className="text">
                    <strong>
                      {isPelico
                        ? 'Pelico'
                        : isSelf
                        ? 'Votre classe'
                        : `La classe${user.level ? ' de ' + user.level : ''} à ${user.city ?? user.countryCode}`}
                    </strong>
                    <br />
                    <span>{question.q}</span>
                  </p>
                  {!isSelf && (
                    <div style={{ width: '100%', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <Button style={{ backgroundColor: 'white' }} onClick={onAskSame(activity, askSame)}>
                          <span className="text text--bold text--primary">Je me pose la même question</span>
                        </Button>
                        {askSame.length > 0 && (
                          <span className="text text--primary" style={{ marginLeft: '0.25rem' }}>
                            + {askSame.length}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

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
