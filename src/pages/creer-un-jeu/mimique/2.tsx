import { useRouter } from 'next/router';
import React, { useContext } from 'react';

import { postGameDataMonneyOrExpression } from 'src/api/game/game.post';
import { Base } from 'src/components/Base';
import { PageLayout } from 'src/components/PageLayout';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import CreateGame from 'src/components/game/CreateGame';
import { ActivityContext } from 'src/contexts/activityContext';
import { GameContext } from 'src/contexts/gameContext';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { ActivityStatus, ActivityType } from 'types/activity.type';
import type { GameDataMonneyOrExpression } from 'types/game.type';
import { GameType } from 'types/game.type';

const MimiqueStep2 = () => {
  const router = useRouter();
  const { selectedPhase } = React.useContext(VillageContext);
  const { user } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);
  const { gameConfig, setActivityGames, activityGames } = useContext(GameContext);
  const { setActivityId, activityId } = useContext(ActivityContext);
  const nextUrl = activityId ? `/creer-un-jeu/mimique/3?activity-id=${activityId}` : '/creer-un-jeu/mimique/3';
  const prevUrl = activityId ? `/creer-un-jeu/mimique/1?activity-id=${activityId}` : '/creer-un-jeu/mimique/1';

  const onNext = async () => {
    const data: GameDataMonneyOrExpression = {
      userId: user?.id || 0,
      villageId: village?.id || 0,
      type: ActivityType.GAME,
      subType: GameType.MIMIC,
      game: {
        id: activityGames?.[1] ? activityGames?.[1]?.id : null,
        type: GameType.MIMIC,
        origine: gameConfig?.[1]?.[0]?.inputs?.[2]?.selectedValue,
        signification: gameConfig?.[1]?.[0]?.inputs?.[1]?.selectedValue,
        fakeSignification1: gameConfig?.[1]?.[1]?.inputs?.[0]?.selectedValue,
        fakeSignification2: gameConfig?.[1]?.[1]?.inputs?.[1]?.selectedValue,
        video: gameConfig?.[1]?.[0]?.inputs?.[0]?.selectedValue,
      },
      selectedPhase: selectedPhase,
      status: ActivityStatus.DRAFT,
      draftUrl: window.location.pathname,
      activityId: activityId,
    };
    const result = await postGameDataMonneyOrExpression(data);
    if (result) {
      setActivityId(result.activityId);
      setActivityGames(result.games);
    }
    router.push(nextUrl);
  };

  const onPrev = () => {
    router.push(prevUrl);
  };

  return (
    <Base>
      <PageLayout>
        <Steps
          steps={['1ère mimique', '2ème mimique', '3ème mimique', 'Prévisualisation']}
          urls={['/creer-un-jeu/mimique/1', '/creer-un-jeu/mimique/2', '/creer-un-jeu/mimique/3', '/creer-un-jeu/mimique/4']}
          activeStep={1}
        />
        <div>
          <CreateGame stepNumber={1} />
        </div>
        <div className="width-900">{<StepsButton prev={onPrev} next={onNext} />}</div>
      </PageLayout>
    </Base>
  );
};

export default MimiqueStep2;
