import { useRouter } from 'next/router';
import React from 'react';
import type { SyntheticEvent } from 'react';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { BackButton } from 'src/components/buttons/BackButton';
import CreateGame from 'src/components/game/CreateGame';
import { GAME_FIELDS_CONFIG } from 'src/config/games/game';
import { useGame } from 'src/contexts/gameContext';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { GameType } from 'types/game.type';

const ExpressionStep1 = () => {
  const router = useRouter();
  const { userSelection } = useGame();
  const originalDescriptionTemplate = 'Dans votre classe, la langue parlée est : ';

  function updateDescriptionWithSelection(userSelection: string) {
    if (!userSelection) {
      return originalDescriptionTemplate;
    }

    return `${originalDescriptionTemplate}${userSelection}`;
  }

  GAME_FIELDS_CONFIG[GameType.EXPRESSION].steps[0][1].description = updateDescriptionWithSelection(userSelection);

  const onNext = () => {
    router.push('/creer-un-jeu/expression/2');
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <BackButton href="/creer-un-jeu/expression" />
        <Steps
          steps={[userSelection || 'Langue', 'Expression 1', 'Expression 2', 'Expression 3', 'Prévisualisation']}
          urls={[
            '/creer-un-jeu/expression/1',
            '/creer-un-jeu/expression/2',
            '/creer-un-jeu/expression/3',
            '/creer-un-jeu/expression/4',
            '/creer-un-jeu/expression/5',
          ]}
          activeStep={0}
        />
        <CreateGame gameType={GameType.EXPRESSION} stepNumber={0} />
        {userSelection.length > 0 ? <p>Vous avez choisi de jouer avec la langue : {userSelection}</p> : null}
        <div className="width-900">{<StepsButton next={onNext} />}</div>
      </div>
    </Base>
  );
};

export default ExpressionStep1;
