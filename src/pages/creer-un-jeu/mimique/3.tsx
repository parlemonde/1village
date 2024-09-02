import { useRouter } from 'next/router';
import React from 'react';

import { Base } from 'src/components/Base';
import { PageLayout } from 'src/components/PageLayout';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import CreateGame from 'src/components/game/CreateGame';

const MimiqueStep3 = () => {
  const router = useRouter();

  const onNext = () => {
    router.push('/creer-un-jeu/mimique/4');
  };

  const onPrev = () => {
    router.push(`/creer-un-jeu/mimique/2`);
  };

  return (
    <Base>
      <PageLayout>
        <Steps
          steps={['1ère mimique', '2ème mimique', '3ème mimique', 'Prévisualisation']}
          urls={['/creer-un-jeu/mimique/1', '/creer-un-jeu/mimique/2', '/creer-un-jeu/mimique/3', '/creer-un-jeu/mimique/4']}
          activeStep={2}
          errorSteps={errorSteps}
        />

        <MimicSelector
          mimicNumber="3ème"
          MimicData={data.game3}
          onDataChange={dataChange}
          onNext={onNext}
          onPrev={onPrev}
          onVideoChange={videoChange}
        />
      </div>
    </Base>
  );
};

export default MimiqueStep3;
