import { useRouter } from 'next/router';
import React from 'react';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { BackButton } from 'src/components/buttons/BackButton';
import CreateGame from 'src/components/game/CreateGame';

const MimiqueStep1 = () => {
  const router = useRouter();

  const onNext = () => {
    router.push('/creer-un-jeu/mimiques/2');
  };
  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <BackButton href="/creer-un-jeu/mimiques" />
        <Steps
          steps={['1ère mimique', '2ème mimique', '3ème mimique', 'Prévisualisation']}
          urls={['/creer-un-jeu/mimiques/1', '/creer-un-jeu/mimiques/2', '/creer-un-jeu/mimiques/3', '/creer-un-jeu/mimiques/4']}
          activeStep={0}
        />
        <CreateGame stepNumber={0} />
        <div className="width-900">{<StepsButton next={onNext} />}</div>
      </div>
    </Base>
  );
};

export default MimiqueStep1;
