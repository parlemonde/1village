import { useRouter } from 'next/router';
import React from 'react';

import { Base } from 'src/components/Base';
import { PageLayout } from 'src/components/PageLayout';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import CreateGame from 'src/components/game/CreateGame';
import { GameContext } from 'src/contexts/gameContext';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { getUserDisplayName } from 'src/utils';
import { ActivityStatus, ActivityType } from 'types/activity.type';
import type { GameDataMonneyOrExpression } from 'types/game.type';
import { GameType } from 'types/game.type';

const MimiqueStep3 = () => {
  const router = useRouter();
  const { selectedPhase } = React.useContext(VillageContext);
  const { user } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);
  const { gameConfig, saveDraftGrame } = React.useContext(GameContext);
  const labelPresentation = user ? getUserDisplayName(user, false) : '';
  const onNext = () => {
    const data: GameDataMonneyOrExpression = {
      userId: user?.id || 0,
      villageId: village?.id || 0,
      type: ActivityType.GAME,
      subType: GameType.MIMIC,
      game3: {
        game: gameConfig[2],
        labelPresentation: labelPresentation,
      },
      selectedPhase: selectedPhase,
      status: ActivityStatus.DRAFT,
      draftUrl: window.location.pathname,
    };
    saveDraftGrame(data);
    router.push('/creer-un-jeu/mimique/4');
  };

  const onPrev = () => {
    router.push(`/creer-un-jeu/mimique/2`);
  };

  return (
    <Base>
      <PageLayout>
        <Steps
          steps={['1ère mimique', '2ème mimique', '3ème mimique', 'Prévisualisation']}
          urls={['/creer-un-jeu/mimique/1', '/creer-un-jeu/mimique/2', '/creer-un-jeu/mimique/3', '/creer-un-jeu/mimique/4']}
          activeStep={2}
        />
        <div>
          <CreateGame stepNumber={2} />
        </div>
        <div className="width-900">{<StepsButton prev={onPrev} next={onNext} />}</div>
      </PageLayout>
    </Base>
  );
};

export default MimiqueStep3;
