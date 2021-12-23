import { useRouter } from 'next/router';
import React from 'react';

import {
  isDefi,
  isEnigme,
  isFreeContent,
  isIndice,
  isMascotte,
  isPresentation,
  isQuestion,
  isReaction,
  isSymbol,
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

import { REACTIONS } from '../utils';

import { DefiActivityView } from './DefiActivityView';
import { EnigmeActivityView } from './EnigmeActivityView';
import { FreeContentView } from './FreeContentView';
import { MascotteActivityView } from './MascotteActivityView';
import type { ActivityViewProps } from './activity-view.types';

export const ActivityView = ({ activity, user }: ActivityViewProps) => {
  const router = useRouter();
  const { activity: responseActivity } = useActivity(activity?.responseActivityId ?? -1);
  const isAnswer = activity && isEnigme(activity) && 'reponse' in router.query;
  const isPelico = user !== null && user.type >= UserType.MEDIATOR;

  return (
    activity && (
      <div>
        {user !== null && (
          <div className="activity__header">
            <AvatarImg user={user} size="small" style={{ margin: '0.25rem' }} />
            <div className="activity-card__header_info">
              <h2>
                <UserDisplayName user={user} />
              </h2>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <p className="text text--small">Publié le {toDate(activity.createDate as string)} </p>
                {isPelico ? (
                  <PelicoNeutre style={{ marginLeft: '0.6rem', height: '16px', width: 'auto' }} />
                ) : (
                  <Flag country={user?.country.isoCode} size="small" style={{ marginLeft: '0.6rem' }} />
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

        {isPresentation(activity) && <ContentView content={activity.content} />}
        {isMascotte(activity) && <MascotteActivityView activity={activity} user={user} />}
        {isQuestion(activity) && <p>{activity.content[0]?.value}</p>}
        {isEnigme(activity) && <EnigmeActivityView activity={activity} user={user} isAnswer={isAnswer} />}
        {isDefi(activity) && <DefiActivityView activity={activity} user={user} />}
        {isFreeContent(activity) && <FreeContentView activity={activity} user={user} />}
        {isIndice(activity) && <ContentView content={activity.content} />}
        {isSymbol(activity) && <ContentView content={activity.content} />}
        {isReaction(activity) && <ContentView content={activity.content} />}
      </div>
    )
  );
};
