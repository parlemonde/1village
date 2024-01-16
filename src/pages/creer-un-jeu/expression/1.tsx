import { useRouter } from 'next/router';
import React, { useContext } from 'react';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { BackButton } from 'src/components/buttons/BackButton';
import CreateGame from 'src/components/game/CreateGame';
import { GameContext } from 'src/contexts/gameContext';
// import { UserContext } from 'src/contexts/userContext';
// import { VillageContext } from 'src/contexts/villageContext';

const ExpressionStep1 = () => {
  const router = useRouter();
  // const { user } = useContext(UserContext);
  // const { village } = useContext(VillageContext);
  const { inputSelectedValue } = useContext(GameContext);

  const onNext = () => {
    router.push('/creer-un-jeu/expression/2');
  };
  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <BackButton href="/creer-un-jeu/expression" />
        <Steps
          steps={[inputSelectedValue || 'Langue', '1ère expression', '2ème expression', '3ème expression', 'Prévisualisation']}
          urls={[
            '/creer-un-jeu/expression/1',
            '/creer-un-jeu/expression/2',
            '/creer-un-jeu/expression/3',
            '/creer-un-jeu/expression/4',
            '/creer-un-jeu/expression/5',
          ]}
          activeStep={0}
        />
        <CreateGame stepNumber={0} />
        <div className="width-900">{<StepsButton next={onNext} />}</div>
      </div>
    </Base>
  );
};

export default ExpressionStep1;
