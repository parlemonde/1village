import { useRouter } from 'next/router';
import React from 'react';

import { isPresentation, isQuestion, isEnigme } from 'src/activity-types/anyActivity';
import { isThematique, isMascotte } from 'src/activity-types/presentation.const';
import { AvatarImg } from 'src/components/Avatar';
import { Flag } from 'src/components/Flag';
import { ContentView } from 'src/components/activities/content/ContentView';
import PelicoNeutre from 'src/svg/pelico/pelico_neutre.svg';
import { getUserDisplayName, toDate } from 'src/utils';
import { UserType } from 'types/user.type';

import { EnigmeActivityView } from './EnigmeActivityView';
import { MascotteActivityView } from './MascotteActivityView';
import { ActivityViewProps } from './activity-view.types';

export const ActivityView: React.FC<ActivityViewProps> = ({ activity, user, isSelf = false }: ActivityViewProps) => {
  const router = useRouter();
  const isAnswer = activity && isEnigme(activity) && 'reponse' in router.query;
  const isPelico = user !== null && user.type >= UserType.MEDIATOR;

  return (
    <div>
      {user !== null && (
        <div className="activity__header">
          <AvatarImg user={user} size="small" style={{ margin: '0.25rem' }} />
          <div className="activity-card__header_info">
            <h2>{getUserDisplayName(user, isSelf)}</h2>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <p className="text text--small">Publié le {toDate(activity.createDate as string)} </p>
              {isPelico ? (
                <PelicoNeutre style={{ marginLeft: '0.6rem', height: '16px', width: 'auto' }} />
              ) : (
                <Flag country={user.countryCode} size="small" style={{ marginLeft: '0.6rem' }} />
              )}
            </div>
          </div>
        </div>
      )}
      {isPresentation(activity) && isThematique(activity) && <ContentView content={activity.processedContent} />}
      {isPresentation(activity) && isMascotte(activity) && <MascotteActivityView activity={activity} user={user} />}
      {isQuestion(activity) && <p>{activity.processedContent[0]?.value}</p>}
      {isEnigme(activity) && <EnigmeActivityView activity={activity} user={user} isAnswer={isAnswer} />}
    </div>
  );
};
