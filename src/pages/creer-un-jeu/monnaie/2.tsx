import { useRouter } from 'next/router';
import React, { useContext } from 'react';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import CreateGame from 'src/components/game/CreateGame';
import { GameContext } from 'src/contexts/gameContext';

const MonnaieStep2 = () => {
  const router = useRouter();
  const { inputSelectedValue } = useContext(GameContext);

  const onNext = () => {
    router.push('/creer-un-jeu/monnaie/3');
  };

  const onPrev = () => {
    router.push(`/creer-un-jeu/monnaie/1`);
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={[inputSelectedValue || 'Monnaie', 'Objet 1', 'Objet 2', 'Objet 3', 'Prévisualisation']}
          urls={[
            '/creer-un-jeu/monnaie/1',
            '/creer-un-jeu/monnaie/2',
            '/creer-un-jeu/monnaie/3',
            '/creer-un-jeu/monnaie/4',
            '/creer-un-jeu/monnaie/5',
          ]}
          activeStep={1}
        />
        <div>
          <CreateGame stepNumber={1} />
        </div>
        <div className="width-900">{<StepsButton prev={onPrev} next={onNext} />}</div>
      </div>
    </Base>
  );
};

export default MonnaieStep2;
