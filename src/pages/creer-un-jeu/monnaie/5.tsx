import { useRouter } from 'next/router';
import React from 'react';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import CreateGame from 'src/components/game/CreateGame';
import { useGame } from 'src/contexts/gameContext';
import { GameType } from 'types/game.type';

const MonnaieStep5 = () => {
  const router = useRouter();
  const { userSelection } = useGame();

  const onNext = () => {
    router.push('/creer-un-jeu/monnaie/success');
  };

  const onPrev = () => {
    router.push(`/creer-un-jeu/monnaie/4`);
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={[userSelection || 'Monnaie', 'Objet 1', 'Objet 2', 'Objet 3', 'Prévisualisation']}
          urls={[
            '/creer-un-jeu/monnaie/1',
            '/creer-un-jeu/monnaie/2',
            '/creer-un-jeu/monnaie/3',
            '/creer-un-jeu/monnaie/4',
            '/creer-un-jeu/monnaie/5',
          ]}
          activeStep={4}
        />
        <div>
          <CreateGame gameType={GameType.MONEY} stepNumber={4} />
        </div>
        <div className="width-900">{<StepsButton prev={onPrev} next={onNext} />}</div>
      </div>
    </Base>
  );
};

export default MonnaieStep5;
