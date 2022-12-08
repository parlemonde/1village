import { useRouter } from 'next/router';
import React from 'react';

import { FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';

const ClassroomParamStep1 = () => {
  const router = useRouter();
  const onNext = () => {
    router.push('/familles/2');
  };

  return (
    <Base>
      <Steps
        steps={['Visibilité', 'Identifiants', 'Communication', 'Gestion']}
        urls={['/familles/1?edit', '/familles/2', '/familles/3', 'familles/4']}
        activeStep={0}
      />
      <div className="width-900">
        <h1>Choisissez ce que voient les familles</h1>
        <p className="text">
          Vous allez inviter les familles de vos élèves à se connecter à 1Village. Ainsi, elles pourront observer les échanges qui ont lieu en ligne.
          Vous avez la possibilité de définir ce que les familles voient sur la plateforme. Choisissez parmi ces 4 options :
        </p>
        <RadioGroup aria-label="visibility" name="visibility" value={1}>
          <FormControlLabel
            value={1}
            control={<Radio />}
            label="les familles peuvent voir toutes les activités publiées sur 1Village, dès leur publication"
            style={{ maxWidth: '100%' }}
          />
          <FormControlLabel
            control={<Radio />}
            // label="les familles peuvent voir toutes les activités publiées sur 1Village, mais __ jours après leurs publication"
            label={
              <div className="se-presenter-step-one__line" style={{ display: 'flex', alignItems: 'flex-start', margin: '1.4rem 0' }}>
                <span style={{ flexShrink: 0, marginRight: '0.5rem' }}>Nous sommes</span>
                <TextField
                  className="se-presenter-step-one__textfield se-presenter-step-one__textfield--full-width"
                  variant="standard"
                  style={{ flex: 1, minWidth: 0 }}
                  fullWidth
                  placeholder={'hello'}
                  value={''}
                  //   onChange={dataChange('presentation')}
                  //   error={showError && !data.presentation}
                  //   helperText={showError && !data.presentation ? 'Ce champ est obligatoire' : ''}
                />
              </div>
            }
            style={{ maxWidth: '100%' }}
          />
          <FormControlLabel
            control={<Radio />}
            label="les familles peuvent voir toutes les activités publiées sur 1Village, dès leur publication, mais seulement celles publiées par notre classe"
            style={{ maxWidth: '100%' }}
          />
          <FormControlLabel
            control={<Radio />}
            label="les familles peuvent voir toutes les activités publiées sur 1Village, mais seulement celles publiées par notre classe 
          et __ jours après leurs publication"
            style={{ maxWidth: '100%' }}
          />
        </RadioGroup>
        <StepsButton next={onNext} />
        <p className="text">Indépendamment de ce réglage, vous pouvez réglez individuellement la visibilité des activités déjà publiées en ligne.</p>
      </div>
    </Base>
  );
};

export default ClassroomParamStep1;
