import { useRouter } from 'next/router';
import React from 'react';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import CreateGame from 'src/components/game/CreateGame';
import { useGame } from 'src/contexts/gameContext';
import { GameType } from 'types/game.type';

const MonnaieStep4 = () => {
  const router = useRouter();
  const { userSelection } = useGame();

  const onNext = () => {
    router.push('/creer-un-jeu/monnaie/5');
  };

  const onPrev = () => {
    router.push(`/creer-un-jeu/monnaie/3`);
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
      <Steps
          steps={[userSelection || 'Langue', 'Objet 1', 'Objet 2', 'Objet 3', 'Prévisualisation']}
          urls={[
            '/creer-un-jeu/monnaie/1',
            '/creer-un-jeu/monnaie/2',
            '/creer-un-jeu/monnaie/3',
            '/creer-un-jeu/monnaie/4',
            '/creer-un-jeu/monnaie/5',
          ]}
          activeStep={3}
        />
        <div>
          <CreateGame gameType={GameType.MONEY} stepNumber={3} />
        </div>
        <div className="width-900">{<StepsButton prev={onPrev} next={onNext} />}</div>
      </div>
    </Base>
  );
};

export default MonnaieStep4;
