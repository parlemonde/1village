import React from 'react';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { BackButton } from 'src/components/buttons/BackButton';
import StorySelector from 'src/components/selectors/StorySelector';

const StoryStep1 = () => {
  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <BackButton href="/creer-une-histoire" />
        <Steps
          steps={['Objet', 'Lieu', 'ODD', 'Histoire', 'Prévisualitation']}
          urls={['/creer-une-histoire/1?edit', '/creer-une-histoire/2', '/creer-une-histoire/3', '/creer-une-histoire/4', '/creer-une-histoire/5']}
          activeStep={0}
        />
        <div className="width-900">
          <h1>Inventez et dessinez un objet magique</h1>
          <p className="text">
            Cet objet, tout comme le lieu que vous choisirez à l’étape suivante, est magique ! Grâce à leurs pouvoirs, le village idéal a atteint
            l’objectif du développement durable que vous choisirez en étape 3.{' '}
          </p>
          <StorySelector />
        </div>
      </div>
    </Base>
  );
};
export default StoryStep1;
