import React from 'react';

import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';

const Question = () => {
  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <div className="width-900">
          <h1 style={{ marginTop: '0.5rem' }}>Poser une question</h1>
          <p className="text">
            Dans cette activité, nous vous proposons de poser une question aux Pélicopains sur leur mode de vie (alimentation, jeux, danses etc.).
            Vous pourrez ensuite répondre aux questions des Pélicopains sous forme d’un texte court ou d’une activités (énigme, vidéo…).
          </p>
          <StepsButton next="/poser-une-question/1" />
        </div>
      </div>
    </Base>
  );
};

export default Question;
