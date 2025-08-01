import { useRouter } from 'next/router';
import React from 'react';

import { REACTIONS } from '../utils';
import { DefiActivityView } from './DefiActivityView';
import { EnigmeActivityView } from './EnigmeActivityView';
import { FreeContentView } from './FreeContentView';
import { MascotteActivityView } from './MascotteActivityView';
import { StoryActivityView } from './StoryActivityView';
import { VerseActivityView } from './VerseActivityView';
import type { ActivityViewProps } from './activity-view.types';
import {
  isDefi,
  isEnigme,
  isFreeContent,
  isIndice,
  isMascotte,
  isPresentation,
  isQuestion,
  isReaction,
  isReportage,
  isStory,
  isSymbol,
  isClassAnthem,
} from 'src/activity-types/anyActivity';
import { AvatarImg } from 'src/components/Avatar';
import { Flag } from 'src/components/Flag';
import { UserDisplayName } from 'src/components/UserDisplayName';
import { Activities } from 'src/components/activities/List';
import { ContentView } from 'src/components/activities/content/ContentView';
import { useActivity } from 'src/services/useActivity';
import PelicoNeutre from 'src/svg/pelico/pelico_neutre.svg';
import { toDate } from 'src/utils';
import { UserType } from 'types/user.type';

export const ActivityView = ({ activity, user }: ActivityViewProps) => {
  const router = useRouter();
  const { activity: responseActivity } = useActivity(activity?.responseActivityId ?? -1);
  const isAnswer = activity && isEnigme(activity) && 'reponse' in router.query;
  const isPelico = user !== null && user.type <= UserType.MEDIATOR;

  return (
    activity && (
      <div>
        {user !== null && (
          <div className="activity__header">
            <AvatarImg user={user} size="small" style={{ margin: '0.25rem' }} displayAsUser={activity.displayAsUser} />
            <div className="activity-card__header_info">
              <h2>
                <UserDisplayName user={user} activity={activity} displayAsUser={activity.displayAsUser} />
              </h2>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <p className="text text--small">Publié le {toDate(activity.publishDate as string)} </p>
                {isPelico ? (
                  <PelicoNeutre style={{ marginLeft: '0.6rem', height: '16px', width: 'auto' }} />
                ) : (
                  <Flag country={user?.country?.isoCode} size="small" style={{ marginLeft: '0.6rem' }} />
                )}
              </div>
            </div>
          </div>
        )}
        {responseActivity !== null && (
          <div style={{ margin: '1rem 0 2rem 0' }}>
            <h3>
              Nous avons créé {REACTIONS[activity.type]} en réponse à {REACTIONS[responseActivity.type]} :
            </h3>
            <Activities activities={[responseActivity]} />
          </div>
        )}

        {isPresentation(activity) && <ContentView content={activity.content} activityId={activity.id} />}
        {isMascotte(activity) && <MascotteActivityView activity={activity} user={user} />}
        {isQuestion(activity) && <p>{activity.content[0]?.value}</p>}
        {isEnigme(activity) && <EnigmeActivityView activity={activity} user={user} isAnswer={isAnswer} />}
        {isDefi(activity) && <DefiActivityView activity={activity} user={user} />}
        {isFreeContent(activity) && <FreeContentView activity={activity} user={user} />}
        {isIndice(activity) && <ContentView content={activity.content} activityId={activity.id} />}
        {isSymbol(activity) && <ContentView content={activity.content} activityId={activity.id} />}
        {isReportage(activity) && <ContentView content={activity.content} activityId={activity.id} />}
        {isReaction(activity) && <ContentView content={activity.content} activityId={activity.id} />}
        {isStory(activity) && <StoryActivityView activity={activity} user={user} />}
        {isClassAnthem(activity) && <VerseActivityView activity={activity} user={user} />}
      </div>
    )
  );
};
