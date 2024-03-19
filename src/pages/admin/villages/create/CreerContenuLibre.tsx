import React from 'react';

import { Stepper, Step, StepLabel, Box } from '@mui/material';

import BackArrow from 'src/svg/back-arrow.svg';

interface CreerContenuLibreProps {
  onBackClick?: (() => void) | undefined;
}

const CreerContenuLibre = ({ onBackClick }: CreerContenuLibreProps) => {
  const steps = ['Contenu', 'Forme', 'Pré-visualiser'];

  const renderClickableTitle = () => (
    <div onClick={onBackClick} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
      <BackArrow />
      <h1 style={{ marginLeft: '10px' }}>Créer du contenu libre</h1>
    </div>
  );

  const renderDescription = () => <p>Un contenu libre est une activité publiée dans le fil d’activité par Pélico </p>;

  const renderSteps = () => {
    return (
      <Box sx={{ width: '100%' }}>
        <Stepper activeStep={0} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    );
  };

  return (
    <div>
      {renderClickableTitle()}
      {renderDescription()}
      {renderSteps()}
    </div>
  );
};

export default CreerContenuLibre;
