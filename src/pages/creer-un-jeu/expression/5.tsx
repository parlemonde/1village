import { useRouter } from 'next/router';
import React, { useContext } from 'react';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import CreateGame from 'src/components/game/CreateGame';
import { GameContext } from 'src/contexts/gameContext';

const ExpressionStep5 = () => {
  const router = useRouter();
  const { inputSelectedValue } = useContext(GameContext);

  const onNext = () => {
    router.push('/creer-un-jeu/expression/success');
  };

  const onPrev = () => {
    router.push(`/creer-un-jeu/expression/4`);
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
          activeStep={4}
        />
        <div>
          <CreateGame stepNumber={4} />
        </div>
        <div className="width-900">{<StepsButton prev={onPrev} next={onNext} />}</div>
      </div>
    </Base>
  );
};

export default ExpressionStep5;
