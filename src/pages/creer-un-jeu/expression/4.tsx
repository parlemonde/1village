import { useRouter } from 'next/router';
import React, { useContext } from 'react';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import CreateGame from 'src/components/game/CreateGame';
import { GameContext } from 'src/contexts/gameContext';
import { UserContext } from 'src/contexts/userContext';
import { ActivityType , ActivityStatus} from 'types/activity.type';
import { VillageContext } from 'src/contexts/villageContext';
import type { GameDataMonneyOrExpression } from 'types/game.type';
import { GameType } from 'types/game.type';
import { getUserDisplayName } from 'src/utils';
const ExpressionStep4 = () => {
  const router = useRouter();
  const { inputSelectedValue , saveDraftGrame} = useContext(GameContext);
  const { user } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);
  const { gameConfig } = useContext(GameContext);
  const { selectedPhase } = React.useContext(VillageContext);
  const labelPresentation = user ? getUserDisplayName(user, false) : '';
  const onNext = () => {
    const data: GameDataMonneyOrExpression = {
      userId: user?.id || 0,
      villageId: village?.id || 0,
      type: ActivityType.GAME,   
      subType: GameType.EXPRESSION,
      game3: {
        game: gameConfig[3],
        language: inputSelectedValue,
        labelPresentation: labelPresentation,
        radio: gameConfig?.[0]?.[1]?.inputs?.[0]?.selectedValue,
      },
      selectedPhase: selectedPhase,
      status: ActivityStatus.DRAFT,
    };
    saveDraftGrame(data);
    router.push('/creer-un-jeu/expression/5');
  };

  const onPrev = () => {
    router.push(`/creer-un-jeu/expression/3`);
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={[inputSelectedValue || 'Langue', '1ère expression', '2ème expression', '3ème expression', 'Prévisualisation']}
          urls={[
            '/creer-un-jeu/expression/1',
            '/creer-un-jeu/expression/2',
            '/creer-un-jeu/expression/3',
            '/creer-un-jeu/expression/4',
            '/creer-un-jeu/expression/5',
          ]}
          activeStep={3}
        />
        <div>
          <CreateGame stepNumber={3} />
        </div>
        <div className="width-900">{<StepsButton prev={onPrev} next={onNext} />}</div>
      </div>
    </Base>
  );
};

export default ExpressionStep4;
