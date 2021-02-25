import Link from 'next/link';
import React from 'react';

import { Button } from '@material-ui/core';

import { Base } from 'src/components/Base';

const Question: React.FC = () => {
  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <div className="width-900">
          <h1 style={{ marginTop: '0.5rem' }}>Poser une question</h1>
          <p className="text">
            Dans cette activité, nous vous proposons de poser une question aux Pélicopains sur leur mode de vie (alimentation, jeux, danses etc.).
            Vous pourrez ensuite répondre aux questions des Pélicopains sous forme d’un texte court ou d’une activités (énigme, vidéo…).
          </p>
          <div style={{ width: '100%', textAlign: 'right', margin: '3rem 0' }}>
            <Link href="/poser-une-question/1">
              <Button component="a" href="/poser-une-question/1" variant="outlined" color="primary">
                Étape suivante
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Base>
  );
};

export default Question;
