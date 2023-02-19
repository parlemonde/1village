import React from 'react';
import Base from 'react-player/base';

import { Steps } from 'src/components/Steps';

const ClassroomParamStep4 = () => {
  return (
    <Base>
      <Steps
        steps={['Visibilité', 'Identifiants', 'Communication', 'Gestion']}
        urls={['/familles/1?edit', '/familles/2', '/familles/3', 'familles/4']}
        activeStep={3}
      />
      <div className="width-900"></div>
    </Base>
  );
};

export default ClassroomParamStep4;
