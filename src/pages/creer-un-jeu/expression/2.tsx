import { useRouter } from 'next/router';
import React from 'react';
import type { SyntheticEvent } from 'react';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import CreateGame from 'src/components/game/CreateGame';
import { useGame } from 'src/contexts/gameContext';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { GameType } from 'types/game.type';

const ExpressionStep2 = () => {
  const router = useRouter();
  const { userSelection } = useGame();

  const onNext = () => {
    router.push('/creer-un-jeu/expression/3');
  };

  const onPrev = () => {
    router.push(`/creer-un-jeu/expression/1`);
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={[userSelection || 'Langue', 'Expression 1', 'Expression 2', 'Expression 3', 'Prévisualisation']}
          urls={[
            '/creer-un-jeu/expression/1',
            '/creer-un-jeu/expression/2',
            '/creer-un-jeu/expression/3',
            '/creer-un-jeu/expression/4',
            '/creer-un-jeu/expression/5',
          ]}
          activeStep={1}
        />
        <div>
          <CreateGame gameType={GameType.EXPRESSION} stepNumber={1} />
        </div>
        <div className="width-900">{<StepsButton prev={onPrev} next={onNext} />}</div>
      </div>
    </Base>
  );
};

export default ExpressionStep2;
