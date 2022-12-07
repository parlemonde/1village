import { useRouter } from 'next/router';
import React from 'react';

import { TextareaAutosize, TextField } from '@mui/material';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { BackButton } from 'src/components/buttons/BackButton';

const Communication = () => {
  const router = useRouter();
  const onNext = () => {
    router.push('/contenu-libre/2');
  };
  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <BackButton href="/contenu-libre" />
        <Steps
          steps={['Visibilité', 'Identifiants', 'Communication', 'Gestion']}
          urls={['/famille/1', '/famille/2', '/famille/3', '/famille/4']}
          activeStep={2}
        />
        <div className="width-900">
          <h1>Ecrivez le contenu de votre publication</h1>
          <p className="text">
            Communiquer les identifiants aux familles Pour inviter les familles à se connecter, nous avons préparé un texte de présentation, que vous
            pouvez modifier, ou traduire dans une autre langue.
          </p>
          <p>
            Comme vous pourrez le constater, ce texte contient le mot-variable <span style={{ fontWeight: 'bold' }}>%identifiant%</span> : vous devez
            le laisser sous ce format.{' '}
          </p>
          <p>
            Ainsi, vous pourrez générer autant de textes de présentation que d’élèves dans votre classe : à vous ensuite de les imprimer et les
            transmettre aux familles. Dans chaque texte, le mot-variable %identifiant% aura été remplacé automatiquement par l’identifiant unique
            généré à l’étape précédente.
          </p>
          <TextField
            onChange={dataChange('title')}
            label="Titre de votre publication"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            style={{ width: '100%', marginBottom: '1rem' }}
          />
          <StepsButton prev="/famille/2" next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default Communication;
