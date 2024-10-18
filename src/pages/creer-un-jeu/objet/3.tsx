import { useRouter } from 'next/router';
import React, { useContext } from 'react';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import CreateGame from 'src/components/game/CreateGame';
import { ActivityContext } from 'src/contexts/activityContext';
import { GameContext } from 'src/contexts/gameContext';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { getUserDisplayName } from 'src/utils';
import { ActivityStatus, ActivityType } from 'types/activity.type';
import type { GameDataMonneyOrExpression, StepsTypes } from 'types/game.type';
import { GameType } from 'types/game.type';

const MonnaieStep3 = () => {
  const router = useRouter();
  const { inputSelectedValue, saveDraftGrame } = useContext(GameContext);
  const { user } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);
  const { selectedPhase } = React.useContext(VillageContext);
  const labelPresentation = user ? getUserDisplayName(user, false) : '';
  const { gameConfig } = useContext(GameContext);
  const { activity } = React.useContext(ActivityContext);
  const { query } = router;
  const activityStepGame = activity?.data.game as StepsTypes[];
  const activityId = query?.activity_id as string | null;

  const onNext = () => {
    const data: GameDataMonneyOrExpression = {
      userId: user?.id || 0,
      villageId: village?.id || 0,
      type: ActivityType.GAME,
      subType: GameType.MONEY,
      game2: {
        game: query?.activity_id && activityStepGame ? activityStepGame : gameConfig[2],
        monney: inputSelectedValue,
        labelPresentation: labelPresentation,
        radio: gameConfig?.[0]?.[1]?.inputs?.[0]?.selectedValue,
      },
      selectedPhase: selectedPhase,
      status: ActivityStatus.DRAFT,
      draftUrl: window.location.pathname,
      activityId: query?.activity_id ? activityId : null,
    };
    saveDraftGrame(data);
    router.push('/creer-un-jeu/objet/4');
  };

  const onPrev = () => {
    router.push(`/creer-un-jeu/objet/2`);
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={[inputSelectedValue || 'Monnaie', 'Objet 1', 'Objet 2', 'Objet 3', 'Prévisualisation']}
          urls={['/creer-un-jeu/objet/1', '/creer-un-jeu/objet/2', '/creer-un-jeu/objet/3', '/creer-un-jeu/objet/4', '/creer-un-jeu/objet/5']}
          activeStep={2}
        />
        <div>
          <CreateGame stepNumber={2} />
        </div>
        <div className="width-900">{<StepsButton prev={onPrev} next={onNext} />}</div>
      </div>
    </Base>
  );
};

export default MonnaieStep3;
