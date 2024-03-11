import { useRouter } from 'next/router';
import React from 'react';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import CreateGame from 'src/components/game/CreateGame';

const MimiqueStep2 = () => {
  const router = useRouter();

  const onNext = () => {
    router.push('/creer-un-jeu/mimiques/3');
  };

  const onPrev = () => {
    router.push(`/creer-un-jeu/mimiques/1`);
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={['1ère mimique', '2ème mimique', '3ème mimique', 'Prévisualisation']}
          urls={['/creer-un-jeu/mimiques/1', '/creer-un-jeu/mimiques/2', '/creer-un-jeu/mimiques/3', '/creer-un-jeu/mimiques/4']}
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

export default MimiqueStep2;
