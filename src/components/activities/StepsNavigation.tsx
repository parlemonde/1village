import React from 'react';

import { Steps } from 'src/components/Steps';

interface StepsNavigationProps {
  currentStep: number;
  errorSteps?: number[];
  isEdit?: boolean;
  id?: number;
}

const StepsNavigation: React.FC<StepsNavigationProps> = ({ currentStep, errorSteps, isEdit, id }) => (
  <Steps
    steps={['Contenu', 'Forme', 'Prévisualiser']}
    urls={
      !isEdit
        ? ['/admin/newportal/contenulibre/1?edit', '/admin/newportal/contenulibre/2', '/admin/newportal/contenulibre/3']
        : [`/admin/newportal/contenulibre/edit/1/${id}`, `/admin/newportal/contenulibre/edit/2/${id}`, `/admin/newportal/contenulibre/edit/3/${id}`]
    }
    activeStep={currentStep}
    errorSteps={errorSteps}
  />
);

export default StepsNavigation;
