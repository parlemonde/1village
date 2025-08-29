import React from 'react';

import AccessControl from 'src/components/AccessControl';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import CollapsibleTable from 'src/components/table/CollapsibleTable';
// import PelicoReflechit from 'src/svg/pelico/pelico_reflechit.svg';

const ClassroomParamStep4 = () => {
  return (
    <Base>
      <AccessControl featureName="id-family" redirectToWIP>
        <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
          <Steps
            steps={['Visibilité', 'Ajout enfants', 'Communication', 'Gestion']}
            urls={['/familles/1?edit', '/familles/2', '/familles/3', '/familles/4']}
            activeStep={3}
          />
          {/* <div className="width-900" style={{ marginTop: '20px', marginBottom: '50px' }}>
            <h1> Vous pourrez bientôt visualiser sur cette page les familles qui ont activé leur compte. </h1>
            <PelicoReflechit style={{ marginTop: '50px', width: '50%', height: 'auto', maxWidth: '360px' }} />
            <p className="text"></p>
          </div> */}
          <div className="width-900">
            <h1> Gérez les accès familles </h1>
            <span>
              Pour chaque enfant de votre classe, vous pouvez voir le nombre de compte famille créé ainsi que télécharger individuellement le texte de
              présentation (si une famille a perdu le sien par exemple).
            </span>

            <CollapsibleTable />
          </div>
          <StepsButton prev="/familles/3" />
        </div>
      </AccessControl>
    </Base>
  );
};

export default ClassroomParamStep4;
