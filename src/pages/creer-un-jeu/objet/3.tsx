import { useRouter } from 'next/router';
import React, { useContext } from 'react';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import CreateGame from 'src/components/game/CreateGame';
import { GameContext } from 'src/contexts/gameContext';

const MonnaieStep3 = () => {
  const router = useRouter();
  const { inputSelectedValue } = useContext(GameContext);

  const onNext = () => {
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
