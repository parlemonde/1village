import { useRouter } from 'next/router';
import React, { useContext } from 'react';

import { postGameDataMonneyOrExpression } from 'src/api/game/game.post';
import { Base } from 'src/components/Base';
import { PageLayout } from 'src/components/PageLayout';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { BackButton } from 'src/components/buttons/BackButton';
import CreateGame from 'src/components/game/CreateGame';
import { ActivityContext } from 'src/contexts/activityContext';
import { GameContext } from 'src/contexts/gameContext';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
//import { getUserDisplayName } from 'src/utils';
import { ActivityStatus, ActivityType } from 'types/activity.type';
import type { GameDataMonneyOrExpression } from 'types/game.type';
import { GameType } from 'types/game.type';

const MimiqueStep1 = () => {
  const router = useRouter();
  const { selectedPhase } = React.useContext(VillageContext);
  const { user } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);
  const { gameConfig, setActivityGames, activityGames } = useContext(GameContext);
  const { setActivityId } = useContext(ActivityContext);

  const onNext = async () => {
    const data: GameDataMonneyOrExpression = {
      userId: user?.id || 0,
      villageId: village?.id || 0,
      type: ActivityType.GAME,
      subType: GameType.MIMIC,
      game: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        gameId: activityGames[0] ? activityGames[0]?.id : null,
        type: GameType.MIMIC,
        origine: gameConfig?.[0]?.[0]?.inputs?.[2]?.selectedValue,
        signification: gameConfig?.[0]?.[0]?.inputs?.[1]?.selectedValue,
        fakeSignification1: gameConfig?.[0]?.[1]?.inputs?.[0]?.selectedValue,
        fakeSignification2: gameConfig?.[0]?.[1]?.inputs?.[1]?.selectedValue,
        video: gameConfig?.[0]?.[0]?.inputs?.[0]?.selectedValue,
      },
      selectedPhase: selectedPhase,
      status: ActivityStatus.DRAFT,
      draftUrl: window.location.pathname,
      activityId: null,
    };

    const result = await postGameDataMonneyOrExpression(data);
    if (result) {
      setActivityId(result.activityId);
      setActivityGames(result.games);
    }
    router.push('/creer-un-jeu/mimique/2');
  };
  return (
    <Base>
      <PageLayout>
        <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
          <BackButton href="/creer-un-jeu/mimique" />
          <Steps
            steps={['1ère mimique', '2ème mimique', '3ème mimique', 'Prévisualisation']}
            urls={['/creer-un-jeu/mimique/1', '/creer-un-jeu/mimique/2', '/creer-un-jeu/mimique/3', '/creer-un-jeu/mimique/4']}
            activeStep={0}
          />
          <CreateGame stepNumber={0} />
          <div className="width-900">{<StepsButton next={onNext} />}</div>
        </div>
      </PageLayout>
    </Base>
  );
};

export default MimiqueStep1;
