import React from 'react';

import { Steps } from 'src/components/Steps';

interface StepsNavigationProps {
  currentStep: number;
  errorSteps?: number[];
}

const StepsNavigation: React.FC<StepsNavigationProps> = ({ currentStep, errorSteps }) => (
  <Steps
    steps={['Contenu', 'Forme', 'Prévisualiser']}
    urls={['/admin/newportal/contenulibre/1?edit', '/admin/newportal/contenulibre/2', '/admin/newportal/contenulibre/3']}
    activeStep={currentStep}
    errorSteps={errorSteps}
  />
);

export default StepsNavigation;
