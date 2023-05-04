import React, { useState } from 'react';

import { Box, Button } from '@mui/material';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import WithFeatureFlag from 'src/components/WithFeatureFlag';
import CollapsibleTable from 'src/components/table/CollapsibleTable';
import { getFeatureFlags } from 'src/utils/getFeatureFlags';

const ClassroomParamStep4 = () => {
  const [numOfPresToPrint] = useState<number>(0);

  const onPrint = () => {};

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={['Visibilité', 'Identifiants', 'Communication', 'Gestion']}
          urls={['/familles/1?edit', '/familles/2', '/familles/3', '/familles/4']}
          activeStep={3}
        />
        <div className="width-900">
          <h1> Gérer les identifiants des familles </h1>
          <span>
            Chaque ligne de ce tableau correspond à un élève de votre classe.
            <br />
            <br />
            Pour chaque élève, vous pouvez télécharger à nouveau le texte de présentation contenant son identifiant unique, si l’élève l’a égaré.{' '}
            <br />
            <br />
            Si un élève a quitté votre classe, vous pouvez supprimer la ligne correspondante.
            <br />
            <br />
            Vous pouvez visualiser combien d’accès ont été créés pour chaque élève, et révoquer certains accès s’ils vous semblent suspicieux. Pour
            rajouter un élève en cours d’année, rendez-vous à l’étape “Identifiants”.
          </span>

          <Box marginTop="20px" textAlign="left">
            <Button id="myButton" onClick={onPrint} variant="outlined">
              Télécharger {numOfPresToPrint <= 1 ? numOfPresToPrint + ' présentation' : numOfPresToPrint + 'présentations'}
            </Button>
          </Box>
          <br />

          <CollapsibleTable />
        </div>
        <StepsButton prev="/familles/3" />
      </div>
    </Base>
  );
};

const ProtectedClassroomParamStep4Visibility = WithFeatureFlag('id-family', getFeatureFlags)(ClassroomParamStep4);

export default ProtectedClassroomParamStep4Visibility;
